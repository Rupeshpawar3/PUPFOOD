import { Router } from 'express';
import * as healthController from '../controllers/healthController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/:petId/records', healthController.getHealthRecords);
router.post('/:petId/vaccination', healthController.addVaccination);
router.post('/medicine/scan', healthController.analyzeMedicine);
router.post('/video/analyze', healthController.analyzeHealthVideo);
router.post('/vets/nearby', healthController.findNearbyVets);

export default router;
