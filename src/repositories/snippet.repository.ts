import { prisma } from '../config/prisma.js';
import { getPagination, getSorting } from '../utils/pagination.js';

export const SnippetRepository = {
  async getFeed(page = 1, pageSize = 10, tag?: string, search?: string, sort?: string) {
    const pagination = getPagination({ page, pageSize });
    const orderBy: any = getSorting(sort) || { createdAt: 'desc' };

    return prisma.snippet.findMany({
      ...pagination,
      where: {
        ...(tag ? { tags: { some: { name: tag } } } : {}),
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy,
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
        tags: true,
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });
  },

  async findById(id: string) {
    return prisma.snippet.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            profile: true,
          },
        },
        tags: true,
        comments: {
          where: { parentCommentId: null },
          include: {
            author: {
              select: {
                id: true,
                username: true,
                profile: true,
              },
            },
            replies: {
              include: {
                author: {
                  select: {
                    id: true,
                    username: true,
                    profile: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });
  },

  async create(data: {
    title: string;
    description?: string;
    code: string;
    language: string;
    authorId: string;
    tags: string[];
  }) {
    const { tags, ...rest } = data;
    return prisma.snippet.create({
      data: {
        ...rest,
        tags: {
          connectOrCreate: tags.map((name) => ({
            where: { name },
            create: { name },
          })),
        },
      },
      include: {
        tags: true,
      },
    });
  },

  async delete(id: string) {
    return prisma.snippet.delete({
      where: { id },
    });
  },
};
