// src/config/unifiedConfig.js
/**
 * Autor: Alexandre Barreto
 * Data: 2026-05-13
 */
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  app: {
    port: process.env.PORT || 3000,
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'super-secret-default-key-dev-only',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
};
