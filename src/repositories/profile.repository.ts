import { prisma } from '../config/prisma.js';

export const ProfileRepository = {
  async update(userId: string, data: any) {
    return prisma.profile.update({
      where: { userId },
      data,
    });
  },

  async findByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        profile: true,
        _count: {
          select: {
            snippets: true,
            likes: true,
          },
        },
      },
    });
  },
};
