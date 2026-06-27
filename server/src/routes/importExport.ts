import { Router } from 'express';
import { importExportController } from '../controllers/importExport';
import { authenticate } from '../middlewares/auth';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const router = Router();

router.use(authenticate);

router.post('/import', upload.single('file'), importExportController.importData);
router.get('/export', importExportController.exportData);
router.get('/export-preview', importExportController.exportPreview);

export default router;
