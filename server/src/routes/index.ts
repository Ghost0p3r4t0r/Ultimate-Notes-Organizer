import { Router } from 'express';
import authRoutes from './auth';
import collectionRoutes from './collection';
import itemRoutes from './item';
import uploadRoutes from './upload';
import searchRoutes from './search';
import compareRoutes from './compare';
import dashboardRoutes from './dashboard';
import favoriteRoutes from './favorite';
import importExportRoutes from './importExport';

const router = Router();

router.use('/auth', authRoutes);
router.use('/collections', collectionRoutes);
router.use('/items', itemRoutes);
router.use('/upload', uploadRoutes);
router.use('/search', searchRoutes);
router.use('/compare', compareRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/import-export', importExportRoutes);

export default router;
