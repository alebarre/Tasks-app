// src/middleware/error.js
/**
 * Autor: Alexandre Barreto
 * Data: 2026-05-13
 */

/**
 * Middleware global de tratamento de erros
 */
export const errorHandler = (err, req, res, next) => {
  console.error(err); // Em producao usar Sentry

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erro interno do servidor',
  });
};

/**
 * Wrapper para rotas assíncronas
 */
export const asyncErrorWrapper = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
