import { ProfileRepository } from '../repositories/profile.repository.js';
import { logger } from '../utils/logger.js';
import { UserRepository } from '../repositories/user.repository.js';

export const ProfileService = {
  async getProfile(username: string) {
    const user = await ProfileRepository.findByUsername(username);
    if (!user) {
      logger.warn({ username }, 'ProfileService.getProfile: User not found');
      throw new Error('User not found');
    }
    return user;
  },

  async updateProfile(userId: string, data: any) {
    return ProfileRepository.update(userId, data);
  },
};
