import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { authGuard } from '../middlewares/auth.middleware.js';
import { requirePermission } from '../middlewares/rbac.middleware.js';

const router = Router();

// Only ADMIN (with USER_MANAGE) can list all users.
router.get(
  '/',
  authGuard,
  requirePermission('USER_MANAGE'),
  UserController.listAll
);

export default router;
