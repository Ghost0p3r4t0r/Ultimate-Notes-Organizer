import { Router } from 'express';
import { itemController } from '../controllers/item';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

router.get('/collection/:collectionId', itemController.list);
router.get('/:id', itemController.getById);
router.post('/', itemController.create);
router.put('/:id', itemController.update);
router.delete('/:id', itemController.delete);

export default router;
