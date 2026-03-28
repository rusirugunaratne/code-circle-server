import { Router } from 'express';
import { SnippetController } from '../controllers/snippet.controller.js';
import { InteractionController } from '../controllers/interaction.controller.js';
import { authGuard } from '../middlewares/auth.middleware.js';
import { requirePermission } from '../middlewares/rbac.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { createSnippetSchema, getFeedSchema } from '../schemas/snippet.schema.js';
import { commentSchema } from '../schemas/interaction.schema.js';

const router = Router();

// Read feed: any authenticated user with SNIPPET_READ
router.get(
  '/',
  authGuard,
  requirePermission('SNIPPET_READ'),
  validate(getFeedSchema),
  SnippetController.getFeed
);

router.get('/:id', authGuard, requirePermission('SNIPPET_READ'), SnippetController.getSnippet);

// Create snippet: user must have SNIPPET_MANAGE_OWN
router.post(
  '/',
  authGuard,
  requirePermission('SNIPPET_MANAGE_OWN'),
  validate(createSnippetSchema),
  SnippetController.createSnippet
);

// Delete snippet: permission checked, and service enforces owner or admin
router.delete(
  '/:id',
  authGuard,
  requirePermission('SNIPPET_MANAGE_OWN'),
  SnippetController.deleteSnippet
);

// Interactions on snippets
router.post('/:id/like', authGuard, requirePermission('SNIPPET_READ'), InteractionController.toggleLike);
router.post('/:id/comments', authGuard, requirePermission('SNIPPET_READ'), validate(commentSchema), InteractionController.addComment);

export default router;
