import { Request, Response, NextFunction } from 'express';
import { InteractionService } from '../services/interaction.service.js';

export const InteractionController = {
  async toggleLike(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new Error('Unauthorized');

      const result = await InteractionService.toggleLike(req.user.id, req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async addComment(req: Request, res: Response, next: NextFunction) {
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
    try {
      if (!req.user) throw new Error('Unauthorized');

      const notifications = await InteractionService.getNotifications(req.user.id);
      res.json(notifications);
    } catch (error) {
      next(error);
    }
  },

  async markNotificationRead(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new Error('Unauthorized');

      await InteractionService.markNotificationRead(req.params.id, req.user.id);
      res.json({ message: 'Notification marked as read' });
    } catch (error) {
      next(error);
    }
  },
};
