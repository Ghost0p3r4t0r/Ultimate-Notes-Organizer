import { authService } from '../services/auth';
import { userRepository } from '../repositories/user';
import * as jwtUtils from '../utils/jwt';
import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma';

jest.mock('../repositories/user');
jest.mock('../utils/jwt');
jest.mock('../utils/prisma', () => ({
  refreshToken: {
    create: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
  },
  $connect: jest.fn(),
  $disconnect: jest.fn(),
  $queryRaw: jest.fn(),
  $executeRawUnsafe: jest.fn(),
}));
jest.mock('bcryptjs');

const mockedUserRepo = jest.mocked(userRepository);
const mockedJwt = jest.mocked(jwtUtils);
const mockedBcrypt = jest.mocked(bcrypt);
const mockedPrisma = jest.mocked(prisma);

const testUser = {
  id: 'user-1',
  email: 'test@example.com',
  password: 'hashed-password',
  name: 'Test User',
  avatar: null,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      mockedUserRepo.findByEmail.mockResolvedValue(null);
      mockedBcrypt.hash.mockResolvedValue('hashed-password' as never);
      mockedUserRepo.create.mockResolvedValue(testUser);
      mockedJwt.signAccessToken.mockReturnValue('access-token');
      mockedJwt.signRefreshToken.mockReturnValue('refresh-token');
      mockedPrisma.refreshToken.create.mockResolvedValue({ id: 'rt-1' } as any);

      const result = await authService.register('test@example.com', 'password123', 'Test User');

      expect(result.user.email).toBe('test@example.com');
      expect(result.user.name).toBe('Test User');
      expect(result.accessToken).toBe('access-token');
      expect(result.refreshToken).toBe('refresh-token');
      expect(mockedUserRepo.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'hashed-password',
        name: 'Test User',
      });
    });

    it('should reject duplicate email', async () => {
      mockedUserRepo.findByEmail.mockResolvedValue(testUser);

      await expect(
        authService.register('test@example.com', 'password123', 'Test User')
      ).rejects.toThrow('Email already registered');
      expect(mockedUserRepo.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should login with valid credentials', async () => {
      mockedUserRepo.findByEmail.mockResolvedValue(testUser);
      mockedBcrypt.compare.mockResolvedValue(true as never);
      mockedJwt.signAccessToken.mockReturnValue('access-token');
      mockedJwt.signRefreshToken.mockReturnValue('refresh-token');
      mockedPrisma.refreshToken.create.mockResolvedValue({ id: 'rt-1' } as any);

      const result = await authService.login('test@example.com', 'password123');

      expect(result.user.email).toBe('test@example.com');
      expect(result.accessToken).toBe('access-token');
      expect(result.refreshToken).toBe('refresh-token');
    });

    it('should reject wrong password', async () => {
      mockedUserRepo.findByEmail.mockResolvedValue(testUser);
      mockedBcrypt.compare.mockResolvedValue(false as never);

      await expect(
        authService.login('test@example.com', 'wrongpass')
      ).rejects.toThrow('Invalid email or password');
    });

    it('should reject non-existent email', async () => {
      mockedUserRepo.findByEmail.mockResolvedValue(null);

      await expect(
        authService.login('nobody@example.com', 'password123')
      ).rejects.toThrow('Invalid email or password');
    });
  });

  describe('refresh', () => {
    it('should refresh tokens with valid refresh token', async () => {
      mockedJwt.verifyRefreshToken.mockReturnValue({ userId: 'user-1' });
      mockedPrisma.refreshToken.findUnique.mockResolvedValue({
        id: 'rt-1',
        token: 'old-refresh-token',
        userId: 'user-1',
        expiresAt: new Date(Date.now() + 86400000),
        createdAt: new Date(),
      } as any);
      mockedPrisma.refreshToken.delete.mockResolvedValue({} as any);
      mockedJwt.signAccessToken.mockReturnValue('new-access-token');
      mockedJwt.signRefreshToken.mockReturnValue('new-refresh-token');
      mockedPrisma.refreshToken.create.mockResolvedValue({ id: 'rt-2' } as any);

      const result = await authService.refresh('old-refresh-token');

      expect(result.accessToken).toBe('new-access-token');
      expect(result.refreshToken).toBe('new-refresh-token');
      expect(mockedPrisma.refreshToken.delete).toHaveBeenCalledWith({ where: { id: 'rt-1' } });
    });

    it('should reject invalid refresh token', async () => {
      mockedJwt.verifyRefreshToken.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(
        authService.refresh('invalid-token')
      ).rejects.toThrow('Invalid refresh token');
    });

    it('should reject expired refresh token', async () => {
      mockedJwt.verifyRefreshToken.mockReturnValue({ userId: 'user-1' });
      mockedPrisma.refreshToken.findUnique.mockResolvedValue({
        id: 'rt-1',
        token: 'old-refresh-token',
        userId: 'user-1',
        expiresAt: new Date(Date.now() - 86400000),
        createdAt: new Date(),
      } as any);

      await expect(
        authService.refresh('old-refresh-token')
      ).rejects.toThrow('Refresh token expired');
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      mockedUserRepo.findById.mockResolvedValue(testUser);

      const result = await authService.getProfile('user-1');

      expect(result.email).toBe('test@example.com');
      expect(result.name).toBe('Test User');
    });

    it('should throw if user not found', async () => {
      mockedUserRepo.findById.mockResolvedValue(null);

      await expect(
        authService.getProfile('nonexistent')
      ).rejects.toThrow('User not found');
    });
  });
});
