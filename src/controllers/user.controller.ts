import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';
import { prisma } from '../config/prisma.js';

export const UserController = {
  listAll: async (req: Request, res: Response, next: NextFunction) => {
    logger.debug('UserController.listAll: Listing all users');
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          createdAt: true,
          profile: true,
        },
      });
      res.json(users);
    } catch (err) {
      next(err);
    }
  },
};
