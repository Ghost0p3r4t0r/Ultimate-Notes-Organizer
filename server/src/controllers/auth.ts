import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { authService } from '../services/auth';
import { registerSchema, loginSchema } from '../validators/auth';
import { AuthRequest } from '../types';

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = registerSchema.parse(req.body);
      const result = await authService.register(data.email, data.password, data.name);
      res.status(httpStatus.CREATED).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = loginSchema.parse(req.body);
      const result = await authService.login(data.email, data.password);
      res.status(httpStatus.OK).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        res.status(httpStatus.BAD_REQUEST).json({ success: false, message: 'Refresh token required' });
        return;
      }
      const result = await authService.refresh(refreshToken);
      res.status(httpStatus.OK).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
      res.status(httpStatus.OK).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  },

  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await authService.getProfile(req.userId!);
      res.status(httpStatus.OK).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  },
};
