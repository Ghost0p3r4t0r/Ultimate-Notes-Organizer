import { Router } from 'express';
import authRoutes from './auth';
import collectionRoutes from './collection';
import itemRoutes from './item';
import uploadRoutes from './upload';

const router = Router();

router.use('/auth', authRoutes);
router.use('/collections', collectionRoutes);
router.use('/items', itemRoutes);
router.use('/upload', uploadRoutes);

export default router;
