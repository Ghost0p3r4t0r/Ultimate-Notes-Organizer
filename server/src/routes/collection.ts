import { Router } from 'express';
import { collectionController } from '../controllers/collection';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

router.get('/', collectionController.list);
router.get('/:id', collectionController.getById);
router.post('/', collectionController.create);
router.put('/:id', collectionController.update);
router.delete('/:id', collectionController.delete);

export default router;
