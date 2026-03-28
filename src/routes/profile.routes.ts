import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller.js';
import { InteractionController } from '../controllers/interaction.controller.js';
import { authGuard } from '../middlewares/auth.middleware.js';
import { requirePermission } from '../middlewares/rbac.middleware.js';

const router = Router();

router.get('/:username', authGuard, requirePermission('SNIPPET_READ'), ProfileController.getProfile);
router.patch('/me', authGuard, requirePermission('SNIPPET_READ'), ProfileController.updateProfile);

// Notifications
router.get('/me/notifications', authGuard, requirePermission('SNIPPET_READ'), InteractionController.getNotifications);
router.patch('/me/notifications/:id/read', authGuard, requirePermission('SNIPPET_READ'), InteractionController.markNotificationRead);

export default router;
