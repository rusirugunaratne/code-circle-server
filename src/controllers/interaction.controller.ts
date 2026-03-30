import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';
import { InteractionService } from '../services/interaction.service.js';
import { CommentInput } from '../schemas/interaction.schema.js';

export const InteractionController = {
  async toggleLike(req: Request, res: Response, next: NextFunction) {
    logger.debug({ snippetId: req.params.id, userId: req.user?.id }, 'InteractionController.toggleLike: Toggling like');
    try {
      if (!req.user) throw new Error('Unauthorized');

      const result = await InteractionService.toggleLike(req.user.id, req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async addComment(req: Request<{ id: string }, {}, CommentInput>, res: Response, next: NextFunction) {
    logger.info({ snippetId: req.params.id, userId: req.user?.id }, 'InteractionController.addComment: Adding comment');
    try {
      if (!req.user) throw new Error('Unauthorized');

      const comment = await InteractionService.addComment({
        ...req.body,
        authorId: req.user.id,
        snippetId: req.params.id,
      });
      res.status(201).json(comment);
    } catch (error) {
      next(error);
    }
  },

  async getNotifications(req: Request, res: Response, next: NextFunction) {
    logger.debug({ userId: req.user?.id }, 'InteractionController.getNotifications: Fetching notifications');
    try {
      if (!req.user) throw new Error('Unauthorized');

      const notifications = await InteractionService.getNotifications(req.user.id);
      res.json(notifications);
    } catch (error) {
      next(error);
    }
  },

  async markNotificationRead(req: Request, res: Response, next: NextFunction) {
    logger.info({ notificationId: req.params.id, userId: req.user?.id }, 'InteractionController.markNotificationRead: Marking as read');
    try {
      if (!req.user) throw new Error('Unauthorized');

      await InteractionService.markNotificationRead(req.params.id, req.user.id);
      res.json({ message: 'Notification marked as read' });
    } catch (error) {
      next(error);
    }
  },
};
