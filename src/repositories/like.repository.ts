import { prisma } from '../config/prisma.js';

export const LikeRepository = {
  async find(userId: string, snippetId: string) {
    return prisma.like.findUnique({
      where: {
        userId_snippetId: {
          userId,
          snippetId,
        },
      },
    });
  },

  async create(userId: string, snippetId: string) {
    return prisma.like.create({
      data: {
        userId,
        snippetId,
      },
    });
  },

  async delete(userId: string, snippetId: string) {
    return prisma.like.delete({
      where: {
        userId_snippetId: {
          userId,
          snippetId,
        },
      },
    });
  },
};
