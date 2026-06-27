import { Router } from 'express';
import authRoutes from './auth';
import collectionRoutes from './collection';

const router = Router();

router.use('/auth', authRoutes);
router.use('/collections', collectionRoutes);

export default router;
