import { Router } from 'express';
import { favoriteController } from '../controllers/favorite';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);
router.get('/', favoriteController.list);
router.post('/:itemId/toggle', favoriteController.toggle);

export default router;
