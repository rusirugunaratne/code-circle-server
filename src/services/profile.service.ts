import { ProfileRepository } from '../repositories/profile.repository.js';
import { UserRepository } from '../repositories/user.repository.js';

export const ProfileService = {
  async getProfile(username: string) {
    const user = await ProfileRepository.findByUsername(username);
    if (!user) throw new Error('User not found');
    return user;
  },

  async updateProfile(userId: string, data: any) {
    return ProfileRepository.update(userId, data);
  },
};
