import { Router } from 'express';
import * as communityController from '../controllers/communityController.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/posts', optionalAuth, communityController.getPosts);
router.post('/posts', authenticate, communityController.createPost);
router.put('/posts/:id/like', authenticate, communityController.likePost);

export default router;
