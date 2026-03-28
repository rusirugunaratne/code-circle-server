import { prisma } from '../config/prisma.js';
import { Role } from '@prisma/client';

export const UserRepository = {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });
  },

  async findByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username },
      include: { profile: true },
    });
  },

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });
  },

  async create(data: {
    email: string;
    username: string;
    passwordHash: string;
    role?: Role;
  }) {
    return prisma.user.create({
      data: {
        ...data,
        profile: {
          create: {},
        },
      },
      include: { profile: true },
    });
  },
};
