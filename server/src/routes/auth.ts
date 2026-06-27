import { Router } from 'express';
import { authController } from '../controllers/auth';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.get('/profile', authenticate, authController.getProfile);

export default router;
