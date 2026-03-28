import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('AdminPass123!', 10);
  const userPassword = await bcrypt.hash('UserPass123!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@codecircle.dev' },
    update: {},
    create: {
      email: 'admin@codecircle.dev',
      username: 'admin',
      passwordHash: adminPassword,
      role: Role.ADMIN,
      profile: {
        create: {
          displayName: 'Admin User',
          headline: 'Platform Administrator',
          bio: 'Manages CodeCircle.',
          techStack: ['TypeScript', 'Node.js', 'PostgreSQL']
        }
      }
    }
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@codecircle.dev' },
    update: {},
    create: {
      email: 'user@codecircle.dev',
      username: 'demo_user',
      passwordHash: userPassword,
      role: Role.USER,
      profile: {
        create: {
          displayName: 'Demo User',
          headline: 'Fullstack Developer',
          bio: 'Loves sharing snippets.',
          techStack: ['React', 'TypeScript']
        }
      }
    }
  });

  console.log('Seeded users:', { admin, user });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
