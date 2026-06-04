// src/middleware/auth.js
/**
 * Autor: Alexandre Barreto
 * Data: 2026-05-13
 */
import jwt from 'jsonwebtoken';
import { config } from '../config/unifiedConfig.js';

/**
 * Verifica o token JWT nas requisições protegidas
 */
export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Não autorizado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.auth.jwtSecret);
    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token inválido' });
  }
};
