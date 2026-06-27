import { Router } from 'express';
import { uploadController } from '../controllers/upload';
import { authenticate } from '../middlewares/auth';
import { uploadMultiple } from '../middlewares/upload';

const router = Router();

router.use(authenticate);

router.post('/', uploadMultiple, uploadController.uploadFiles);
router.get('/item/:itemId', uploadController.listByItem);
router.delete('/:id', uploadController.deleteFile);

export default router;
