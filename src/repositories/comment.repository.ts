import { prisma } from '../config/prisma.js';

export const CommentRepository = {
  async create(data: {
    content: string;
    authorId: string;
    snippetId: string;
    parentCommentId?: string;
  }) {
    return prisma.comment.create({
      data,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            profile: {
              select: {
                displayName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });
  },

  async findById(id: string) {
    return prisma.comment.findUnique({
      where: { id },
      include: {
        snippet: {
          select: {
            authorId: true,
          },
        },
      },
    });
  },

  async delete(id: string) {
    return prisma.comment.delete({
      where: { id },
    });
  },
};
