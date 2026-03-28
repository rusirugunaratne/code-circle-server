import { prisma } from '../config/prisma.js';
import { NotificationType } from '@prisma/client';

export const NotificationRepository = {
  async create(data: {
    recipientId: string;
    actorId: string;
    type: NotificationType;
    targetId: string;
  }) {
    return prisma.notification.create({
      data,
    });
  },

  async findByRecipient(recipientId: string) {
    return prisma.notification.findMany({
      where: { recipientId },
      orderBy: { createdAt: 'desc' },
      include: {
        actor: {
          select: {
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

  async markAsRead(id: string) {
    return prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  },

  async markAllAsRead(recipientId: string) {
    return prisma.notification.updateMany({
      where: { recipientId, isRead: false },
      data: { isRead: true },
    });
  },
};
