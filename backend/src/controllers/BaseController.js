// src/controllers/BaseController.js
/**
 * Autor: Alexandre Barreto
 * Data: 2026-05-13
 */

/**
 * Controller base para padronizar respostas e erros
 */
export class BaseController {
  handleSuccess(res, data, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      data,
    });
  }

  handleError(error, res, contextName) {
    console.error(`[${contextName}] Error:`, error); // Idealmente reportado ao Sentry
    
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';

    return res.status(statusCode).json({
      success: false,
      message,
    });
  }
}
