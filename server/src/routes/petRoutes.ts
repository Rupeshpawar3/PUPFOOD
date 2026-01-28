import { Router } from 'express';
import * as petController from '../controllers/petController.js';
import { authenticate } from '../middleware/auth.js';
import { petValidation } from '../middleware/validation.js';

const router = Router();

// All pet routes require authentication
router.use(authenticate);

router.get('/', petController.getAllPets);
router.get('/:id', petController.getPetById);
router.post('/', petValidation, petController.createPet);
router.put('/:id', petController.updatePet);
router.delete('/:id', petController.deletePet);

export default router;
