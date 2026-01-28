import { Router } from 'express';
import * as assistantController from '../controllers/assistantController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/chat', assistantController.chat);
router.post('/tts', assistantController.textToSpeech);
router.post('/transcribe', assistantController.transcribeAudio);
router.post('/thinking', assistantController.thinkingQuery);

export default router;
