import { Request, Response, NextFunction } from 'express';
import { ProfileService } from '../services/profile.service.js';
import { UpdateProfileInput } from '../schemas/profile.schema.js';

export const ProfileController = {
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const profile = await ProfileService.getProfile(req.params.username);
      res.json(profile);
    } catch (error) {
      next(error);
    }
  },

  async updateProfile(req: Request<{}, {}, UpdateProfileInput>, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new Error('Unauthorized');

      const profile = await ProfileService.updateProfile(req.user.id, req.body);
      res.json(profile);
    } catch (error) {
      next(error);
    }
  },
};
