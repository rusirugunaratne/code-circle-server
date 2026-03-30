import crypto from 'crypto';
import { logger } from '../utils/logger.js';
import { UserRepository } from '../repositories/user.repository.js';
import { RefreshTokenRepository } from '../repositories/refreshToken.repository.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';
import { env } from '../config/env.js';

export const AuthService = {
  async register(data: { email: string; username: string; password: string }) {
    logger.debug({ email: data.email }, 'AuthService.register: Checking for existing user');
    const existingUser = await UserRepository.findByEmail(data.email);
    if (existingUser) {
      logger.warn({ email: data.email }, 'AuthService.register: Email already in use');
      throw new Error('Email already in use');
    }

    const usernameTaken = await UserRepository.findByUsername(data.username);
    if (usernameTaken) {
      logger.warn({ username: data.username }, 'AuthService.register: Username already taken');
      throw new Error('Username already taken');
    }

    const passwordHash = await hashPassword(data.password);
    const user = await UserRepository.create({
      email: data.email,
      username: data.username,
      passwordHash,
    });

    const tokens = await this.generateTokens(user.id, user.role);
    return { user: this.formatUser(user), ...tokens };
  },

  async login(data: { email: string; password: string }) {
    const user = await UserRepository.findByEmail(data.email);
    if (!user) throw new Error('Invalid credentials');

    const isPasswordValid = await comparePassword(data.password, user.passwordHash);
    if (!isPasswordValid) {
      logger.warn({ email: data.email }, 'AuthService.login: Invalid password');
      throw new Error('Invalid credentials');
    }

    const tokens = await this.generateTokens(user.id, user.role);
    return { user: this.formatUser(user), ...tokens };
  },

  async refresh(refreshToken: string) {
    const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const tokenRecord = await RefreshTokenRepository.findByToken(hashedToken);

    if (!tokenRecord || tokenRecord.revoked || tokenRecord.expiresAt < new Date()) {
      throw new Error('Invalid or expired refresh token');
    }

    const { user } = tokenRecord;
    const tokens = await this.generateTokens(user.id, user.role);

    // Optional: Revoke old token (token rotation)
    await RefreshTokenRepository.revoke(tokenRecord.id);

    return { user: this.formatUser(user), ...tokens };
  },

  async logout(refreshToken: string) {
    const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const tokenRecord = await RefreshTokenRepository.findByToken(hashedToken);
    if (tokenRecord) {
      await RefreshTokenRepository.revoke(tokenRecord.id);
    }
  },

  async generateTokens(userId: string, role: any) {
    const accessToken = generateAccessToken({ sub: userId, role });
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Default 7 days

    await RefreshTokenRepository.create({
      hashedToken,
      userId,
      expiresAt,
    });

    return { accessToken, refreshToken };
  },

  formatUser(user: any) {
    const { passwordHash, ...rest } = user;
    return rest;
  },
};
