import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { signupValidation, loginValidation } from '../middleware/validation.js';

const router = Router();

router.post('/signup', signupValidation, authController.signup);
router.post('/login', loginValidation, authController.login);
router.post('/google', authController.googleAuth);
router.get('/me', authenticate, authController.getMe);

export default router;
