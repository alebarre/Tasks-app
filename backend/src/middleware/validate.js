// src/middleware/validate.js
/**
 * Autor: Alexandre Barreto
 * Data: 2026-05-13
 */
export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.errors,
    });
  }
};
