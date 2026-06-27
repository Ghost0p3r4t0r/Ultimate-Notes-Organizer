import { Router } from 'express';
import authRoutes from './auth';
import collectionRoutes from './collection';
import itemRoutes from './item';
import uploadRoutes from './upload';
import searchRoutes from './search';

const router = Router();

router.use('/auth', authRoutes);
router.use('/collections', collectionRoutes);
router.use('/items', itemRoutes);
router.use('/upload', uploadRoutes);
router.use('/search', searchRoutes);

export default router;
