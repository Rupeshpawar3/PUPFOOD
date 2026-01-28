import { Router } from 'express';
import * as foodController from '../controllers/foodScannerController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/analyze', foodController.analyzeFood);
router.post('/identify-dog', foodController.identifyDog);

export default router;
