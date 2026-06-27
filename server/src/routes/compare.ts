import { Router } from 'express';
import { compareController } from '../controllers/compare';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);
router.get('/', compareController.compare);

export default router;
