import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authGuard } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refresh);
router.post('/logout', AuthController.logout);
router.get('/me', authGuard, AuthController.me);

export default router;
