import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { userRepository } from '../repositories/user';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { UnauthorizedError, ConflictError } from '../utils/errors';
import prisma from '../utils/prisma';
import { config } from '../config';

export const authService = {
  async register(email: string, password: string, name: string) {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new ConflictError('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await userRepository.create({ email, password: hashedPassword, name });

    const accessToken = signAccessToken(user.id);
    const refreshToken = signRefreshToken(user.id);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar, createdAt: user.createdAt.toISOString(), updatedAt: user.updatedAt.toISOString() },
      accessToken,
      refreshToken,
    };
  },

  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const accessToken = signAccessToken(user.id);
    const refreshToken = signRefreshToken(user.id);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar, createdAt: user.createdAt.toISOString(), updatedAt: user.updatedAt.toISOString() },
      accessToken,
      refreshToken,
    };
  },

  async refresh(token: string) {
    let payload: { userId: string };
    try {
      payload = verifyRefreshToken(token);
    } catch {
      throw new UnauthorizedError('Invalid refresh token');
    }

    const storedToken = await prisma.refreshToken.findUnique({ where: { token } });
    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new UnauthorizedError('Refresh token expired');
    }

    await prisma.refreshToken.delete({ where: { id: storedToken.id } });

    const newAccessToken = signAccessToken(payload.userId);
    const newRefreshToken = signRefreshToken(payload.userId);

    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: payload.userId,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  },

  async logout(token: string) {
    await prisma.refreshToken.deleteMany({ where: { token } });
  },

  async getProfile(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) throw new UnauthorizedError('User not found');
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  },
};
