import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT || 4000),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL!,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET!,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET!,
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES || '15m',
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES || '7d',
  cookieSecure: process.env.COOKIE_SECURE === 'true',
  corsAllowedOrigins: (process.env.CORS_ALLOWED_ORIGINS || '').split(','),
};
