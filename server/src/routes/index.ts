import { Router } from 'express';
import authRoutes from './auth';
import collectionRoutes from './collection';
import itemRoutes from './item';

const router = Router();

router.use('/auth', authRoutes);
router.use('/collections', collectionRoutes);
router.use('/items', itemRoutes);

export default router;
