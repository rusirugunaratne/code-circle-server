

## Project Title

**CodeCircle — A Social Platform for Sharing Code Snippets**

***

## Overview

CodeCircle is a community web application where developers can log in, share code snippets, and collaborate through discussions and feedback. [dev](https://dev.to/sh20raj/a-prismaschema-for-an-advance-social-media-website-24l9)
The platform works like a lightweight, developer-focused social network: users post code snippets, others can comment, reply, and like them, and everyone has a public profile showcasing their activity and expertise. [dev](https://dev.to/sh20raj/a-prismaschema-for-an-advance-social-media-website-24l9)

The backend is built with Node.js, Express.js, and TypeScript, using PostgreSQL as the primary database and Prisma ORM for type-safe data access. [prisma](https://www.prisma.io/docs/orm/prisma-schema/data-model/models)
Authentication and identity are handled with JWT-based auth: users register/sign in with email/password, receive a short-lived access token and a long-lived refresh token, and all protected requests pass the access token via the `Authorization` header. [freecodecamp](https://www.freecodecamp.org/news/how-to-build-a-secure-authentication-system-with-jwt-and-refresh-tokens/)

***

## Roles

There are two user roles:

- **Admin**: can manage users (e.g., view users, promote/demote, lock accounts).  
- **User**: can authenticate and interact with all core app features (snippets, comments, likes, notifications, profiles). [codesignal](https://codesignal.com/learn/courses/secure-authentication-authorization-1/lessons/implementing-role-based-access-control-rbac-in-typescript)

RBAC is implemented with a `Role` enum in Prisma and a central permission map used by Express middlewares. [prisma](https://www.prisma.io/docs/orm/prisma-client/client-extensions/shared-extensions/permit-rbac)

***

## Core User Flows

### Authentication and onboarding

- New users register with email, username, and password.  
- Their password is hashed (e.g., with bcrypt), a user and profile record are created in PostgreSQL via Prisma, and they receive an access token (JSON response) plus refresh token (httpOnly cookie). [codevoweb](https://codevoweb.com/node-prisma-postgresql-access-refresh-tokens/)
- On subsequent logins, the same flow returns tokens and user info.  
- Frontend redirects to a personalized home feed or an onboarding screen where users can edit their profile.

### Posting code snippets

- Authenticated users can create a snippet with: title, description, language/technology, code body, and tags.  
- The snippet is stored in the database and appears in the global home feed as well as the author’s profile activity. [dev](https://dev.to/sh20raj/a-prismaschema-for-an-advance-social-media-website-24l9)
- Syntax highlighting is handled on the frontend.

### Browsing and filtering snippets

- Home page shows a paginated list of recent snippets, sorted by creation date.  
- Users can filter snippets by tags (e.g., “JavaScript”, “Algorithms”, “Node.js”) and search by title/description keywords, implemented via Prisma queries over text fields and Tag relations. [prisma](https://www.prisma.io/docs/orm/prisma-schema/data-model/models)
- Each snippet card includes title, tags, author, created time, like count, and comment count (using Prisma `_count`). [prisma](https://www.prisma.io/docs/orm/prisma-schema/data-model/models)

### Comments and replies

- Snippet detail page shows full snippet (code + description) and all comments.  
- Authenticated users can add comments and replies (threaded), using a `parentCommentId` self-reference to model threads. [dev](https://dev.to/sh20raj/a-prismaschema-for-an-advance-social-media-website-24l9)
- Each comment shows author and timestamp.

### Likes

- Users can like or unlike a snippet with a single click.  
- Each like is a `Like` record (userId + snippetId) with a unique composite constraint to enforce “one like per user per snippet”. [prisma](https://www.prisma.io/docs/orm/prisma-schema/data-model/models)
- Snippet displays total likes and whether current user has liked it.

### Notifications

- On comment creation, if the commenter is not the snippet owner, a `Notification` record is created for the snippet owner.  
- On like creation, if the liker is not the snippet owner, a notification is also created.  
- Notifications are listed in an in-app notifications endpoint with unread count and can be marked as read individually or in batch. [dev](https://dev.to/sh20raj/a-prismaschema-for-an-advance-social-media-website-24l9)
- The model is designed to be extended later for real-time updates (WebSockets) or external channels (email, push).

### User profiles

- Public profile page at `/u/:username` or `/users/:id`.  
- Profile shows display name, avatar URL, bio, headline, location, primary tech stack, and links (GitHub, LinkedIn, personal site).  
- Profile also summarizes activity: snippets created, total likes received, recent comments, and potentially “top snippets”. [dev](https://dev.to/sh20raj/a-prismaschema-for-an-advance-social-media-website-24l9)
- Authenticated users can update their own profile via a dedicated settings endpoint.

### User activity view

- Each user has an activity dashboard summarizing: snippets posted, comments written, likes given, likes received on their snippets, and recent notifications with read/unread status. [dev](https://dev.to/sh20raj/a-prismaschema-for-an-advance-social-media-website-24l9)
- This helps users track engagement and contributions over time.

***

## Feature List

- JWT-based authentication and user management (email/password, access + refresh tokens).  
- User profile (bio, links, skills, etc.).  
- CRUD for code snippets (with author-only update/delete).  
- Tagging system for organizing snippets.  
- Home feed with pagination and tag/search filters.  
- Commenting system with threaded replies.  
- Like system for snippets (extensible to comments).  
- In-app notification system for comments and likes.  
- User activity dashboard and basic statistics (likes received, total snippets). [dev](https://dev.to/sh20raj/a-prismaschema-for-an-advance-social-media-website-24l9)

***

## Technical Stack

- Runtime: Node.js.  
- Framework: Express.js.  
- Language: TypeScript.  
- Database: PostgreSQL.  
- ORM: Prisma ORM.  
- Authentication and identity: JWT (access token in JSON, refresh token in httpOnly cookie).  
- API style: RESTful JSON API, designed so it can evolve to GraphQL later if needed. [webdock](https://webdock.io/en/docs/how-guides/javascript-guides/nodejs-boilerplate-typescript-express-prisma)

Frontend is intentionally decoupled, intended for a modern SPA or SSR framework (React, Next.js, etc.). [webdock](https://webdock.io/en/docs/how-guides/javascript-guides/nodejs-boilerplate-typescript-express-prisma)

***

## Backend Architecture

### Application structure

Layered architecture:

- **Routes**: Express routers that define HTTP routes and attach controllers + middlewares.  
- **Controllers**: HTTP handlers that parse/validate requests and call services, returning JSON.  
- **Services**: Business logic for snippets, likes, comments, notifications, profiles, and auth.  
- **Repositories**: Data-access layer using Prisma client; services talk to repositories rather than Prisma directly. [blog.alexrusin](https://blog.alexrusin.com/clean-architecture-in-node-js-implementing-the-repository-pattern-with-typescript-and-prisma/)
- **Types/DTOs**: TypeScript interfaces for request/response shapes to keep controllers and services type-safe.

Example project layout (TypeScript):

```txt
project/
  prisma/
    schema.prisma
    migrations/
  src/
    app.ts
    server.ts
    config/         // env, Prisma, RBAC config
    routes/         // route registration
    controllers/    // HTTP handlers
    services/       // business logic
    repositories/   // Prisma calls
    middlewares/    // auth (JWT), RBAC, validation, error handler
    utils/          // jwt, password, pagination, types, helpers
  .env
```

This matches common “clean architecture” style for Node + Express + Prisma. [blog.alexrusin](https://blog.alexrusin.com/clean-architecture-in-node-js-implementing-the-repository-pattern-with-typescript-and-prisma/)

***

## Data Model (Prisma, high level)

Users authenticate locally with email/password, and the DB schema supports all core features. [prisma](https://www.prisma.io/docs/orm/prisma-schema/data-model/models)

```prisma
// datasource and generator omitted for brevity

enum Role {
  USER
  ADMIN
}

enum NotificationType {
  LIKE
  COMMENT
  REPLY
}

model User {
  id           String          @id @default(cuid())
  email        String          @unique
  username     String          @unique
  passwordHash String
  role         Role            @default(USER)
  createdAt    DateTime        @default(now())

  profile       Profile?
  snippets      Snippet[]
  comments      Comment[]
  likes         Like[]
  notifications Notification[] @relation("Recipient")
  actions       Notification[] @relation("Actor")
  refreshTokens RefreshToken[]
}

model Profile {
  id          String   @id @default(cuid())
  bio         String?
  avatarUrl   String?
  location    String?
  githubUrl   String?
  linkedinUrl String?
  techStack   String[]
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Snippet {
  id          String     @id @default(cuid())
  title       String
  description String?
  code        String     @db.Text
  language    String
  authorId    String
  author      User       @relation(fields: [authorId], references: [id])
  tags        Tag[]      // many-to-many
  comments    Comment[]
  likes       Like[]
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@index([authorId])
}

model Tag {
  id       String    @id @default(cuid())
  name     String    @unique
  snippets Snippet[]
}

model Comment {
  id              String    @id @default(cuid())
  content         String
  authorId        String
  snippetId       String
  parentCommentId String?

  author  User    @relation(fields: [authorId], references: [id])
  snippet Snippet @relation(fields: [snippetId], references: [id], onDelete: Cascade)

  parent  Comment?  @relation("Replies", fields: [parentCommentId], references: [id])
  replies Comment[] @relation("Replies")

  createdAt DateTime @default(now())
}

model Like {
  id        String   @id @default(cuid())
  userId    String
  snippetId String
  user      User     @relation(fields: [userId], references: [id])
  snippet   Snippet  @relation(fields: [snippetId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@unique([userId, snippetId])
}

model Notification {
  id          String           @id @default(cuid())
  recipientId String
  actorId     String
  type        NotificationType
  targetId    String
  isRead      Boolean          @default(false)
  recipient   User             @relation("Recipient", fields: [recipientId], references: [id])
  actor       User             @relation("Actor", fields: [actorId], references: [id])
  createdAt   DateTime         @default(now())
}

model RefreshToken {
  id          String   @id @default(cuid())
  hashedToken String   @unique
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  revoked     Boolean  @default(false)
  expiresAt   DateTime
  createdAt   DateTime @default(now())
}
```

Key points:

- `Role` enum drives RBAC.  
- `RefreshToken` stores hashed tokens for rotation/revocation, matching JWT best practices. [codevoweb](https://codevoweb.com/node-prisma-postgresql-access-refresh-tokens/)
- `Comment` has self-relation for threaded replies.  
- `Like` has unique `(userId, snippetId)` to enforce “one like per snippet per user”. [prisma](https://www.prisma.io/docs/orm/prisma-schema/data-model/models)

***

## DTOs and Types (`src/types/`)

Define DTOs so the API is fully typed in TypeScript. [webdock](https://webdock.io/en/docs/how-guides/javascript-guides/nodejs-boilerplate-typescript-express-prisma)

- **Auth**  
  - `LoginDTO` → `{ email: string; password: string }`  
  - `RegisterDTO` → `{ email: string; username: string; password: string }`  

- **Snippet**  
  - `CreateSnippetDTO` → `{ title: string; code: string; language: string; description?: string; tags: string[] }`  
  - `SnippetFilterQuery` → `{ tag?: string; search?: string; cursor?: string }`  

- **Comment**  
  - `CreateCommentDTO` → `{ content: string; parentCommentId?: string }`  

- **Profile**  
  - `UpdateProfileDTO` → `{ displayName?: string; bio?: string; location?: string; techStack?: string[]; links?: { githubUrl?: string; linkedinUrl?: string; websiteUrl?: string } }`

These shapes are used in controllers and services to keep the contract explicit.

***

## API Endpoints (REST, JWT-based)

### Auth

- `POST /api/auth/register` — register new user, returns `{ accessToken, user }` and refresh token cookie.  
- `POST /api/auth/login` — login, returns `{ accessToken, user }` and refresh token cookie. [digitalocean](https://www.digitalocean.com/community/tutorials/nodejs-jwt-expressjs)
- `POST /api/auth/refresh` — uses refresh token from cookie to issue new access token (and rotated refresh token).  
- `POST /api/auth/logout` — clears refresh token cookie and revokes refresh token in DB.

### Snippets

- `GET /api/snippets` — list snippets with cursor pagination and optional `?tag=` / `?search=` filters.  
- `GET /api/snippets/:id` — snippet detail including comments and counts.  
- `POST /api/snippets` — create snippet (auth required).  
- `DELETE /api/snippets/:id` — delete snippet (owner or admin only).

### Interactions

- `POST /api/snippets/:id/like` — toggle like for the current user.  
- `POST /api/snippets/:id/comments` — add comment or reply.  
- `GET /api/notifications` — list notifications for current user.  
- `PATCH /api/notifications/:id/read` — mark notification as read.

### Profiles

- `GET /api/profiles/:username` — public profile + user snippets.  
- `PATCH /api/profiles/me` — update current user’s profile.

Auth middleware reads the access token, validates it, and injects `req.user = { id, role }` for downstream handlers. [freecodecamp](https://www.freecodecamp.org/news/how-to-build-a-secure-authentication-system-with-jwt-and-refresh-tokens/)

***

## Repository Pattern

Repositories hide Prisma details from services to keep business logic clean. [blog.alexrusin](https://blog.alexrusin.com/clean-architecture-in-node-js-implementing-the-repository-pattern-with-typescript-and-prisma/)

Example: `src/repositories/SnippetRepository.ts`

```ts
export const SnippetRepository = {
  async getFeed(cursor?: string, limit = 10, tag?: string, search?: string) {
    return prisma.snippet.findMany({
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      where: {
        ...(tag ? { tags: { some: { name: tag } } } : {}),
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
              ]
            }
          : {})
      },
      orderBy: { createdAt: 'desc' },
      include: {
        author: true,
        tags: true,
        _count: { select: { likes: true, comments: true } }
      }
    });
  }
};
```

This shows cursor pagination, tag filtering, and search using Prisma, which is a good signal of scalability in a portfolio. [robinwieruch](https://www.robinwieruch.de/prisma-seeding-database/)

***

## Why this works well for your portfolio

- **JWT auth + refresh tokens**: Shows you can build a secure, stateless auth system without relying on third-party identity providers. [digitalocean](https://www.digitalocean.com/community/tutorials/nodejs-jwt-expressjs)
- **Threaded comments**: Demonstrates correct use of self-referential relations and recursive data structures in Prisma. [prisma](https://www.prisma.io/docs/orm/prisma-schema/data-model/models)
- **Cursor pagination**: Shows you understand scalable feed design and avoid the pitfalls of offset-based pagination. [robinwieruch](https://www.robinwieruch.de/prisma-seeding-database/)
- **Clean layering & RBAC**: Highlights production-quality structure with repositories, services, controllers, and role/permission-based access. [zenstack](https://zenstack.dev/blog/model-authz)

Do you want me to now turn this blueprint into a concrete repo-style file layout (like I did earlier) but extended to include comments, likes, and notifications controllers/services as actual TypeScript code?  

It includes:

- Prisma schema (users, profiles, snippets, tags, comments, likes, notifications, refresh tokens, roles).  
- Seed script for one admin + one normal user.  
- Core JWT auth flows: register, login, refresh token, get current user.  
- One sample domain endpoint: create snippet (user) and list snippets.  
- Clean layers: routes → controllers → services → repositories → Prisma.

You can copy-paste into a fresh project and run.

***

## 1. Folder structure

```txt
codecircle-api/
  package.json
  tsconfig.json
  .env
  prisma/
    schema.prisma
    seed.ts
  src/
    app.ts
    server.ts
    config/
      env.ts
      prisma.ts
    routes/
      index.ts
      auth.routes.ts
      snippet.routes.ts
    controllers/
      auth.controller.ts
      snippet.controller.ts
    services/
      auth.service.ts
      snippet.service.ts
    repositories/
      user.repository.ts
      snippet.repository.ts
      refreshToken.repository.ts
    middlewares/
      auth.middleware.ts
      error.middleware.ts
      rbac.middleware.ts
    utils/
      jwt.ts
      password.ts
      pagination.ts
      types.ts
```

***

## 2. package.json

```json
{
  "name": "codecircle-api",
  "version": "1.0.0",
  "main": "dist/server.js",
  "type": "module",
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:migrate": "prisma migrate dev",
    "prisma:generate": "prisma generate",
    "prisma:seed": "ts-node prisma/seed.ts"
  },
  "dependencies": {
    "@prisma/client": "^5.15.0",
    "bcryptjs": "^2.4.3",
    "cookie-parser": "^1.4.6",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "jsonwebtoken": "^9.0.2"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.2",
    "@types/cookie-parser": "^1.4.3",
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/node": "^22.0.0",
    "prisma": "^5.15.0",
    "ts-node": "^10.9.2",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.6.0"
  }
}
```

***

## 3. tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ES2020",
    "moduleResolution": "node",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "include": ["src", "prisma/seed.ts"]
}
```

***

## 4. .env

```env
DATABASE_URL="postgresql://user:password@localhost:5432/codecircle?schema=public"

PORT=4000
NODE_ENV=development

JWT_ACCESS_SECRET="super_access_secret_change_me"
JWT_REFRESH_SECRET="super_refresh_secret_change_me"
ACCESS_TOKEN_EXPIRES="15m"
REFRESH_TOKEN_EXPIRES="7d"
COOKIE_SECURE="false"
```

Adjust `DATABASE_URL` to your Postgres instance. [betterstack](https://betterstack.com/community/guides/scaling-nodejs/prisma-orm/)

***

## 5. prisma/schema.prisma

**File:** `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  USER
  ADMIN
}

enum NotificationType {
  LIKE
  COMMENT
  REPLY
}

model User {
  id           String          @id @default(cuid())
  email        String          @unique
  username     String          @unique
  passwordHash String
  role         Role            @default(USER)
  createdAt    DateTime        @default(now())
  updatedAt    DateTime        @updatedAt

  profile      Profile?
  snippets     Snippet[]
  comments     Comment[]
  likes        Like[]
  notifications Notification[] @relation("Recipient")
  actions      Notification[]  @relation("Actor")
  refreshTokens RefreshToken[]
}

model Profile {
  id          String   @id @default(cuid())
  displayName String?
  bio         String?
  avatarUrl   String?
  location    String?
  headline    String?
  techStack   String[]
  githubUrl   String?
  linkedinUrl String?
  websiteUrl  String?

  userId String @unique
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Snippet {
  id          String     @id @default(cuid())
  title       String
  description String?
  code        String     @db.Text
  language    String
  authorId    String
  author      User       @relation(fields: [authorId], references: [id])
  tags        Tag[]      @relation("SnippetTags", references: [id])
  comments    Comment[]
  likes       Like[]
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@index([authorId])
}

model Tag {
  id       String     @id @default(cuid())
  name     String     @unique
  snippets Snippet[]  @relation("SnippetTags")
}

model Comment {
  id              String    @id @default(cuid())
  content         String
  authorId        String
  snippetId       String
  parentCommentId String?

  author  User    @relation(fields: [authorId], references: [id])
  snippet Snippet @relation(fields: [snippetId], references: [id], onDelete: Cascade)

  parent  Comment?  @relation("Replies", fields: [parentCommentId], references: [id])
  replies Comment[] @relation("Replies")

  createdAt DateTime @default(now())

  @@index([snippetId])
  @@index([authorId])
}

model Like {
  id        String   @id @default(cuid())
  userId    String
  snippetId String

  user    User    @relation(fields: [userId], references: [id])
  snippet Snippet @relation(fields: [snippetId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())

  @@unique([userId, snippetId])
}

model Notification {
  id          String           @id @default(cuid())
  recipientId String
  actorId     String
  type        NotificationType
  targetId    String
  isRead      Boolean          @default(false)
  createdAt   DateTime         @default(now())

  recipient User @relation("Recipient", fields: [recipientId], references: [id])
  actor     User @relation("Actor", fields: [actorId], references: [id])

  @@index([recipientId])
}

model RefreshToken {
  id          String   @id @default(cuid())
  hashedToken String   @unique
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  revoked     Boolean  @default(false)
  expiresAt   DateTime
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([userId])
}
```

This covers users, roles, profiles, snippets, tags, comments, likes, notifications, and refresh tokens. [codevoweb](https://codevoweb.com/node-prisma-postgresql-access-refresh-tokens/)

Run:

```bash
npx prisma migrate dev --name init_schema
npx prisma generate
```

***

## 6. prisma/seed.ts – create admin + user

**File:** `prisma/seed.ts`

```ts
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
```

Run seeding: [robinwieruch](https://www.robinwieruch.de/prisma-seeding-database/)

```bash
npx prisma db seed
```

***

## 7. src/config/env.ts

**File:** `src/config/env.ts`

```ts
import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT || 4000),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL!,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET!,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET!,
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES || '15m',
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES || '7d',
  cookieSecure: process.env.COOKIE_SECURE === 'true'
};
```

***

## 8. src/config/prisma.ts

**File:** `src/config/prisma.ts`

```ts
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();
```

***

## 9. src/utils/types.ts

**File:** `src/utils/types.ts`

```ts
export interface JwtPayload {
  sub: string;
  role: string;
}

export interface AuthenticatedRequestUser {
  id: string;
  role: string;
}
```

***

## 10. src/utils/jwt.ts

**File:** `src/utils/jwt.ts`

```ts
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/env';
import { JwtPayload } from './types';

export function signAccessToken(payload: JwtPayload) {
  return jwt.sign(payload, env.jwtAccessSecret, {
    expiresIn: env.accessTokenExpiresIn
  });
}

export function signRefreshToken(payload: JwtPayload & { ver?: number }) {
  return jwt.sign(payload, env.jwtRefreshSecret, {
    expiresIn: env.refreshTokenExpiresIn
  });
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwtAccessSecret) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload & { ver?: number } {
  return jwt.verify(token, env.jwtRefreshSecret) as JwtPayload & { ver?: number };
}

export function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}
```

***

## 11. src/utils/password.ts

**File:** `src/utils/password.ts`

```ts
import bcrypt from 'bcryptjs';

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export function comparePassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
```

***

## 12. src/utils/pagination.ts

**File:** `src/utils/pagination.ts`

```ts
export function parsePagination(query: any) {
  const limit = Math.min(Number(query.limit) || 10, 50);
  const cursor = (query.cursor as string) || undefined;
  return { limit, cursor };
}
```

***

## 13. src/repositories/user.repository.ts

**File:** `src/repositories/user.repository.ts`

```ts
import { prisma } from '../config/prisma';
import { Role } from '@prisma/client';

export const UserRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  createUser(params: { email: string; username: string; passwordHash: string; role?: Role }) {
    const { email, username, passwordHash, role } = params;
    return prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
        role: role ?? Role.USER,
        profile: {
          create: {
            displayName: username,
            techStack: []
          }
        }
      }
    });
  }
};
```

***

## 14. src/repositories/refreshToken.repository.ts

**File:** `src/repositories/refreshToken.repository.ts`

```ts
import { prisma } from '../config/prisma';

export const RefreshTokenRepository = {
  create(hashedToken: string, userId: string, expiresAt: Date) {
    return prisma.refreshToken.create({
      data: {
        hashedToken,
        userId,
        expiresAt
      }
    });
  },

  revokeByHashed(hashedToken: string) {
    return prisma.refreshToken.updateMany({
      where: { hashedToken, revoked: false },
      data: { revoked: true }
    });
  },

  findValid(hashedToken: string) {
    return prisma.refreshToken.findFirst({
      where: {
        hashedToken,
        revoked: false,
        expiresAt: { gt: new Date() }
      },
      include: { user: true }
    });
  }
};
```

***

## 15. src/repositories/snippet.repository.ts

**File:** `src/repositories/snippet.repository.ts`

```ts
import { prisma } from '../config/prisma';

export const SnippetRepository = {
  create(params: {
    title: string;
    description?: string;
    code: string;
    language: string;
    authorId: string;
    tags?: string[];
  }) {
    const { title, description, code, language, authorId, tags } = params;
    return prisma.snippet.create({
      data: {
        title,
        description,
        code,
        language,
        authorId,
        ...(tags && tags.length
          ? {
              tags: {
                connectOrCreate: tags.map(t => ({
                  where: { name: t },
                  create: { name: t }
                }))
              }
            }
          : {})
      },
      include: {
        author: { select: { id: true, username: true } },
        tags: true
      }
    });
  },

  getFeed(cursor?: string, limit = 10) {
    return prisma.snippet.findMany({
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, username: true } },
        tags: true,
        _count: { select: { likes: true, comments: true } }
      }
    });
  }
};
```

***

## 16. src/services/auth.service.ts

**File:** `src/services/auth.service.ts`

```ts
import { UserRepository } from '../repositories/user.repository';
import { RefreshTokenRepository } from '../repositories/refreshToken.repository';
import { hashPassword, comparePassword } from '../utils/password';
import { hashToken, signAccessToken, signRefreshToken } from '../utils/jwt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { Role } from '@prisma/client';

export const AuthService = {
  async register(email: string, username: string, password: string) {
    const existing = await UserRepository.findByEmail(email);
    if (existing) {
      throw new Error('Email already registered');
    }
    const passwordHash = await hashPassword(password);
    const user = await UserRepository.createUser({ email, username, passwordHash, role: Role.USER });
    return user;
  },

  async login(email: string, password: string) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const ok = await comparePassword(password, user.passwordHash);
    if (!ok) {
      throw new Error('Invalid credentials');
    }

    const basePayload = { sub: user.id, role: user.role };

    const accessToken = signAccessToken(basePayload);

    const refreshToken = signRefreshToken({ ...basePayload, ver: 0 });

    const decoded = jwt.decode(refreshToken) as { exp?: number } | null;
    const expiresAt = decoded?.exp
      ? new Date(decoded.exp * 1000)
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const hashed = hashToken(refreshToken);
    await RefreshTokenRepository.create(hashed, user.id, expiresAt);

    return { user, accessToken, refreshToken };
  },

  async rotateRefreshToken(refreshToken: string) {
    const { verifyRefreshToken } = await import('../utils/jwt');
    const decoded = verifyRefreshToken(refreshToken);
    const hashed = hashToken(refreshToken);

    const record = await RefreshTokenRepository.findValid(hashed);
    if (!record || !record.user) {
      throw new Error('Invalid refresh token');
    }

    await RefreshTokenRepository.revokeByHashed(hashed);

    const basePayload = { sub: record.user.id, role: record.user.role };
    const newAccessToken = signAccessToken(basePayload);
    const newRefreshToken = signRefreshToken({ ...basePayload, ver: (decoded.ver || 0) + 1 });

    const decodedNew = (jwt.decode(newRefreshToken) as { exp?: number }) || {};
    const expiresAt = decodedNew.exp
      ? new Date(decodedNew.exp * 1000)
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const newHashed = hashToken(newRefreshToken);
    await RefreshTokenRepository.create(newHashed, record.user.id, expiresAt);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
};
```

***

## 17. src/services/snippet.service.ts

**File:** `src/services/snippet.service.ts`

```ts
import { SnippetRepository } from '../repositories/snippet.repository';

export const SnippetService = {
  createSnippet(params: {
    title: string;
    description?: string;
    code: string;
    language: string;
    tags?: string[];
    authorId: string;
  }) {
    return SnippetRepository.create(params);
  },

  getFeed(cursor?: string, limit = 10) {
    return SnippetRepository.getFeed(cursor, limit);
  }
};
```

***

## 18. src/middlewares/auth.middleware.ts

**File:** `src/middlewares/auth.middleware.ts`

```ts
import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { AuthenticatedRequestUser } from '../utils/types';

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedRequestUser;
}

export function authGuard(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid Authorization header' });
  }
  const token = header.split(' ') [prisma](https://www.prisma.io/docs/orm/prisma-schema/data-model/models);

  try {
    const decoded = verifyAccessToken(token);
    req.user = { id: decoded.sub, role: decoded.role };
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
```

***

## 19. src/middlewares/rbac.middleware.ts

**File:** `src/middlewares/rbac.middleware.ts`

```ts
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';

export function requireRole(roles: string[] | string) {
  const allowed = Array.isArray(roles) ? roles : [roles];

  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthenticated' });
    }
    if (!allowed.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }
    next();
  };
}
```

***

## 20. src/middlewares/error.middleware.ts

**File:** `src/middlewares/error.middleware.ts`

```ts
import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  res.status(status).json({ message });
}
```

***

## 21. src/controllers/auth.controller.ts

**File:** `src/controllers/auth.controller.ts`

```ts
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { env } from '../config/env';

function setRefreshCookie(res: Response, refreshToken: string) {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: env.cookieSecure ? 'none' : 'lax',
    path: '/api/auth/refresh',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

export const AuthController = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, username, password } = req.body;
      if (!email || !username || !password) {
        return res.status(400).json({ message: 'email, username, password required' });
      }
      const user = await AuthService.register(email, username, password);
      res.status(201).json({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      });
    } catch (err) {
      next(err);
    }
  },

  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'email and password required' });
      }
      const { user, accessToken, refreshToken } = await AuthService.login(email, password);
      setRefreshCookie(res, refreshToken);
      res.json({
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role
        }
      });
    } catch (err) {
      next(err);
    }
  },

  refresh: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = (req as any).cookies?.refreshToken;
      if (!token) {
        return res.status(401).json({ message: 'Refresh token missing' });
      }
      const { accessToken, refreshToken } = await AuthService.rotateRefreshToken(token);
      setRefreshCookie(res, refreshToken);
      res.json({ accessToken });
    } catch (err) {
      next(err);
    }
  }
};
```

***

## 22. src/controllers/snippet.controller.ts

**File:** `src/controllers/snippet.controller.ts`

```ts
import { Response, NextFunction } from 'express';
import { SnippetService } from '../services/snippet.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { parsePagination } from '../utils/pagination';

export const SnippetController = {
  create: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthenticated' });
      }
      const { title, description, code, language, tags } = req.body;
      if (!title || !code || !language) {
        return res.status(400).json({ message: 'title, code, language required' });
      }
      const snippet = await SnippetService.createSnippet({
        title,
        description,
        code,
        language,
        tags,
        authorId: req.user.id
      });
      res.status(201).json(snippet);
    } catch (err) {
      next(err);
    }
  },

  feed: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { limit, cursor } = parsePagination(req.query);
      const snippets = await SnippetService.getFeed(cursor, limit);
      res.json({ items: snippets, nextCursor: snippets.length ? snippets[snippets.length - 1].id : null });
    } catch (err) {
      next(err);
    }
  }
};
```

***

## 23. src/routes/auth.routes.ts

**File:** `src/routes/auth.routes.ts`

```ts
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refresh);

export default router;
```

***

## 24. src/routes/snippet.routes.ts

**File:** `src/routes/snippet.routes.ts`

```ts
import { Router } from 'express';
import { SnippetController } from '../controllers/snippet.controller';
import { authGuard } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authGuard, SnippetController.feed);
router.post('/', authGuard, SnippetController.create);

export default router;
```

***

## 25. src/routes/index.ts

**File:** `src/routes/index.ts`

```ts
import { Router } from 'express';
import authRoutes from './auth.routes';
import snippetRoutes from './snippet.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/snippets', snippetRoutes);

export default router;
```

***

## 26. src/app.ts

**File:** `src/app.ts`

```ts
import express from 'express';
import cookieParser from 'cookie-parser';
import routes from './routes';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api', routes);

app.use(errorHandler);

export default app;
```

***

## 27. src/server.ts

**File:** `src/server.ts`

```ts
import app from './app';
import { env } from './config/env';

app.listen(env.port, () => {
  console.log(`CodeCircle API running on http://localhost:${env.port}`);
});
```

***

## 28. Basic usage

1. Install & migrate & seed:

```bash
npm install
npx prisma migrate dev --name init_schema
npx prisma db seed
npm run dev
```

2. Login with seeded users:

- Admin: `admin@codecircle.dev` / `AdminPass123!` (role ADMIN).  
- User: `user@codecircle.dev` / `UserPass123!` (role USER).

3. Example calls:

- Register:

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"new@cc.dev","username":"newuser","password":"StrongPass123!"}'
```

- Login:

```bash
curl -i -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@codecircle.dev","password":"UserPass123!"}'
```

Response: JSON with `accessToken` and user; `Set-Cookie: refreshToken=...; HttpOnly`.

- Create snippet:

```bash
curl -X POST http://localhost:4000/api/snippets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ACCESS_TOKEN_HERE" \
  -d '{"title":"Hello TS","code":"console.log(\"hi\")","language":"TypeScript","tags":["TypeScript","Node.js"]}'
```

- Get feed:

```bash
curl -X GET http://localhost:4000/api/snippets \
  -H "Authorization: Bearer ACCESS_TOKEN_HERE"
```

From here you can add other routes (comments, likes, notifications, profiles) following the same layers.

Do you want me to extend this project with comments + likes + notifications endpoints next, or keep it at this auth + snippet scope for now?  

To make RBAC “industry standard” in your current codebase, you should centralize roles, keep permissions declarative, and enforce them via small reusable middlewares rather than ad‑hoc `if` checks in controllers. [codesignal](https://codesignal.com/learn/courses/secure-authentication-authorization-1/lessons/implementing-role-based-access-control-rbac-in-typescript)

Below I’ll upgrade your project with:

- A typed `Role` enum (already in Prisma) + a central permission map.  
- A robust `requireRole` and `requirePermission` middleware.  
- Example usage for admin‑only user management and snippet operations.

I’ll only show the new/changed files; everything else from the previous answer stays as‑is.

***

## 1. Tie RBAC to your existing Role enum

You already have:

```prisma
enum Role {
  USER
  ADMIN
}
```

Prisma will generate a TypeScript enum `Role` under `@prisma/client`, which we will reuse everywhere so roles are consistent across DB, JWT, and code. [prisma](https://www.prisma.io/docs/orm/prisma-schema/data-model/models)

***

## 2. Central role/permission config

**New file:** `src/config/rbac.ts`

```ts
import { Role } from '@prisma/client';

// High-level permissions used in the app.
export type Permission =
  | 'USER_MANAGE'
  | 'SNIPPET_MANAGE_ALL'
  | 'SNIPPET_MANAGE_OWN'
  | 'SNIPPET_READ';

// Map each Role to a list of permissions.
// This is the single source of truth for RBAC.[web:58][web:60][web:65]
export const rolePermissions: Record<Role, Permission[]> = {
  [Role.ADMIN]: [
    'USER_MANAGE',
    'SNIPPET_MANAGE_ALL',
    'SNIPPET_MANAGE_OWN',
    'SNIPPET_READ'
  ],
  [Role.USER]: [
    'SNIPPET_MANAGE_OWN',
    'SNIPPET_READ'
  ]
};

// Helper to check if a role includes a permission.
export function roleHasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false;
}
```

This pattern (roles → permissions → protected routes) is the typical recommendation in modern RBAC tutorials and libraries. [zenstack](https://zenstack.dev/blog/model-authz)

***

## 3. Make JWT and auth middleware use Role from Prisma

### 3.1 Update JWT payload typing

**File:** `src/utils/types.ts` (replace content)

```ts
import { Role } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  role: Role;
}

export interface AuthenticatedRequestUser {
  id: string;
  role: Role;
}
```

### 3.2 Ensure JWT helpers keep type safety

**File:** `src/utils/jwt.ts` (no behavioral change, just uses new types)

```ts
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/env';
import { JwtPayload } from './types';

export function signAccessToken(payload: JwtPayload) {
  return jwt.sign(payload, env.jwtAccessSecret, {
    expiresIn: env.accessTokenExpiresIn
  });
}

export function signRefreshToken(payload: JwtPayload & { ver?: number }) {
  return jwt.sign(payload, env.jwtRefreshSecret, {
    expiresIn: env.refreshTokenExpiresIn
  });
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwtAccessSecret) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload & { ver?: number } {
  return jwt.verify(token, env.jwtRefreshSecret) as JwtPayload & { ver?: number };
}

export function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}
```

### 3.3 Auth middleware stays the same structurally

**File:** `src/middlewares/auth.middleware.ts` (only typing tweak)

```ts
import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { AuthenticatedRequestUser } from '../utils/types';

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedRequestUser;
}

export function authGuard(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid Authorization header' });
  }
  const token = header.split(' ') [codesignal](https://codesignal.com/learn/courses/secure-authentication-authorization-1/lessons/implementing-role-based-access-control-rbac-in-typescript);

  try {
    const decoded = verifyAccessToken(token);
    req.user = { id: decoded.sub, role: decoded.role };
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
```

***

## 4. RBAC middleware with roles and permissions

**File:** `src/middlewares/rbac.middleware.ts` (replace with robust version)

```ts
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';
import { Role } from '@prisma/client';
import { Permission, roleHasPermission } from '../config/rbac';

// Require a minimum role (simple role hierarchy check).
export function requireRole(minRoles: Role[] | Role) {
  const allowed = Array.isArray(minRoles) ? minRoles : [minRoles];

  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthenticated' });
    }
    if (!allowed.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }
    next();
  };
}

// Require a specific permission derived from rolePermissions.
export function requirePermission(permission: Permission) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthenticated' });
    }

    if (!roleHasPermission(req.user.role, permission)) {
      return res.status(403).json({ message: `Forbidden: missing permission ${permission}` });
    }

    next();
  };
}
```

Using dedicated `requirePermission` middleware is how many guides structure scalable RBAC for APIs. [linkedin](https://www.linkedin.com/posts/sagar0333_simple-role-based-access-control-rbac-activity-7344607374520782848-S-6k)

***

## 5. Use RBAC in routes: admin management + snippet ownership

### 5.1 Example: admin-only user management route

Add a simple “list all users” endpoint that only ADMIN can call.

**New file:** `src/controllers/user.controller.ts`

```ts
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';

export const UserController = {
  listAll: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          createdAt: true
        }
      });
      res.json(users);
    } catch (err) {
      next(err);
    }
  }
};
```

**New file:** `src/routes/user.routes.ts`

```ts
import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authGuard } from '../middlewares/auth.middleware';
import { requirePermission } from '../middlewares/rbac.middleware';

const router = Router();

// Only ADMIN (with USER_MANAGE) can list all users.
router.get(
  '/',
  authGuard,
  requirePermission('USER_MANAGE'),
  UserController.listAll
);

export default router;
```

Wire into main router.

**File:** `src/routes/index.ts` (update)

```ts
import { Router } from 'express';
import authRoutes from './auth.routes';
import snippetRoutes from './snippet.routes';
import userRoutes from './user.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/snippets', snippetRoutes);
router.use('/users', userRoutes); // admin-only example

export default router;
```

Now `/api/users` is accessible only by tokens whose JWT `role` maps to `USER_MANAGE` (i.e., ADMIN in our config). [developer.auth0](https://developer.auth0.com/resources/code-samples/api/express/basic-role-based-access-control)

***

### 5.2 Enforce “own vs all” on snippets

Keep `SNIPPET_READ` global for auth’d users, but differentiate between:

- `SNIPPET_MANAGE_OWN` for regular users (update/delete their own snippets).  
- `SNIPPET_MANAGE_ALL` for admins (manage any snippet).

As an example, add a “delete snippet” endpoint that checks both permission and ownership.

**Update:** `src/repositories/snippet.repository.ts` (add methods)

```ts
import { prisma } from '../config/prisma';

export const SnippetRepository = {
  // existing create + getFeed

  create(params: {
    title: string;
    description?: string;
    code: string;
    language: string;
    authorId: string;
    tags?: string[];
  }) { /* unchanged */ },

  getFeed(cursor?: string, limit = 10) { /* unchanged */ },

  findById(id: string) {
    return prisma.snippet.findUnique({ where: { id } });
  },

  deleteById(id: string) {
    return prisma.snippet.delete({ where: { id } });
  }
};
```

**Update:** `src/services/snippet.service.ts`

```ts
import { SnippetRepository } from '../repositories/snippet.repository';
import { Role } from '@prisma/client';

export const SnippetService = {
  createSnippet(params: {
    title: string;
    description?: string;
    code: string;
    language: string;
    tags?: string[];
    authorId: string;
  }) {
    return SnippetRepository.create(params);
  },

  getFeed(cursor?: string, limit = 10) {
    return SnippetRepository.getFeed(cursor, limit);
  },

  async deleteSnippet(id: string, requesterId: string, requesterRole: Role) {
    const snippet = await SnippetRepository.findById(id);
    if (!snippet) {
      const err: any = new Error('Snippet not found');
      err.status = 404;
      throw err;
    }

    const isOwner = snippet.authorId === requesterId;
    const isAdmin = requesterRole === Role.ADMIN;

    if (!isOwner && !isAdmin) {
      const err: any = new Error('Forbidden: cannot delete this snippet');
      err.status = 403;
      throw err;
    }

    await SnippetRepository.deleteById(id);
  }
};
```

**Update:** `src/controllers/snippet.controller.ts` (add delete)

```ts
import { Response, NextFunction } from 'express';
import { SnippetService } from '../services/snippet.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { parsePagination } from '../utils/pagination';

export const SnippetController = {
  create: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => { /* unchanged */ },

  feed: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => { /* unchanged */ },

  delete: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthenticated' });
      }
      const { id } = req.params;
      await SnippetService.deleteSnippet(id, req.user.id, req.user.role);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
};
```

**Update:** `src/routes/snippet.routes.ts`

```ts
import { Router } from 'express';
import { SnippetController } from '../controllers/snippet.controller';
import { authGuard } from '../middlewares/auth.middleware';
import { requirePermission } from '../middlewares/rbac.middleware';

const router = Router();

// Read feed: any authenticated user with SNIPPET_READ
router.get(
  '/',
  authGuard,
  requirePermission('SNIPPET_READ'),
  SnippetController.feed
);

// Create snippet: user must have SNIPPET_MANAGE_OWN
router.post(
  '/',
  authGuard,
  requirePermission('SNIPPET_MANAGE_OWN'),
  SnippetController.create
);

// Delete snippet: permission checked, and service enforces owner or admin
router.delete(
  '/:id',
  authGuard,
  requirePermission('SNIPPET_MANAGE_OWN'),
  SnippetController.delete
);

export default router;
```

Pattern:

- Authentication extracts `user.id` + `user.role` from JWT.  
- `requirePermission` enforces coarse-grained RBAC (who *may* attempt the action).  
- Service layer enforces fine-grained ownership logic (who *actually* owns this resource). [youtube](https://www.youtube.com/watch?v=IVt9oKhRLb8)

***

## 6. How to use

- Admin user (from seed) has `Role.ADMIN` → full permissions.  
- Normal user has `Role.USER` → can manage only their own snippets, cannot call `/api/users`.

Example:

```bash
# As admin
curl -H "Authorization: Bearer ADMIN_ACCESS_TOKEN" http://localhost:4000/api/users

# As normal user (should be 403)
curl -H "Authorization: Bearer USER_ACCESS_TOKEN" http://localhost:4000/api/users
```

This structure (central role→permission map, small declarative middlewares, ownership checks in service) matches what is commonly taught in RBAC tutorials and used in production Express/Prisma stacks. [youtube](https://www.youtube.com/watch?v=fUWkVxCv4IQ)

use pagination (page number and page size based)
use sorting (like sort parameter x.asc,y.desc)