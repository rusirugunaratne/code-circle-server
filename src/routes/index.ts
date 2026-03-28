import { Router } from 'express';
import authRoutes from './auth.routes.js';
import snippetRoutes from './snippet.routes.js';
import profileRoutes from './profile.routes.js';
import userRoutes from './user.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/snippets', snippetRoutes);
router.use('/profiles', profileRoutes);
router.use('/users', userRoutes);

export default router;
