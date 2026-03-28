import { prisma } from '../config/prisma.js';

export const RefreshTokenRepository = {
  async create(data: { hashedToken: string; userId: string; expiresAt: Date }) {
    return prisma.refreshToken.create({
      data,
    });
  },

  async findByToken(hashedToken: string) {
    return prisma.refreshToken.findUnique({
      where: { hashedToken },
      include: { user: true },
    });
  },

  async revoke(id: string) {
    return prisma.refreshToken.update({
      where: { id },
      data: { revoked: true },
    });
  },

  async deleteExpired() {
    return prisma.refreshToken.deleteMany({
      where: {
        OR: [{ expiresAt: { lt: new Date() } }, { revoked: true }],
      },
    });
  },

  async deleteByUserId(userId: string) {
    return prisma.refreshToken.deleteMany({
      where: { userId },
    });
  },
};
