import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);
router.get('/', dashboardController.stats);

export default router;
