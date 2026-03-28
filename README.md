# CodeCircle API

CodeCircle is a full-stack platform for developers to share, discover, and interact with code snippets. This repository contains the backend API built with Node.js, TypeScript, and Prisma.

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Database Setup](#database-setup)
- [Seeding Data](#seeding-data)
- [API Documentation](#api-documentation)
- [Tech Stack](#tech-stack)

## Features
- **Authentication**: JWT-based auth with access and refresh tokens.
- **RBAC (Role-Based Access Control)**: Fine-grained permissions for Users and Admins.
- **Snippets**: Create, read, update, and delete code snippets.
- **Interactions**: Like snippets and add comments/replies.
- **Profiles**: Personalized user profiles with tech stacks and social links.
- **Notifications**: Real-time notifications for likes and comments.
- **Validation**: Strict request validation using Zod.

## Prerequisites
- **Node.js**: v18 or higher.
- **npm**: v9 or higher.
- **PostgreSQL**: Local or cloud-hosted instance.

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/rusirugunaratne/code-circle-server.git
   cd code-circle-server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Copy `.env.example` to `.env` and fill in your database credentials and secrets.
   ```bash
   cp .env.example .env
   ```
   > [!IMPORTANT]
   > Ensure `DATABASE_URL` is correctly configured to point to your PostgreSQL instance.

## Database Setup

Initialize the database schema using Prisma:
```bash
npx prisma migrate dev
```

Generate the Prisma Client:
```bash
npm run prisma:generate
```

## Seeding Data

Populate your database with initial sample data (test users and snippets):
```bash
npm run prisma:seed
```

## Running the App

Start the development server:
```bash
npm run dev
```
The server will be running on `http://localhost:4000` (by default).

## API Documentation

A comprehensive Postman collection is available for testing:
- [codecircle_collection.json](./codecircle_collection.json)

Import this file into Postman and set the `baseUrl` and `accessToken` variables as described in the walkthrough.

## Tech Stack
- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Validation**: Zod
- **Authentication**: JsonWebToken (JWT)
- **CORS**: cors middleware
