// src/routes/auth.js
/**
 * Autor: Alexandre Barreto
 * Data: 2026-05-13
 */
import { Router } from 'express';
import { AuthController } from '../controllers/AuthController.js';
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../validators/auth.schema.js';
import { authMiddleware } from '../middleware/auth.js';
import { asyncErrorWrapper } from '../middleware/error.js';

const router = Router();
const authController = new AuthController();

router.post('/register', validate(registerSchema), asyncErrorWrapper((req, res) => authController.register(req, res)));
router.post('/login', validate(loginSchema), asyncErrorWrapper((req, res) => authController.login(req, res)));
router.get('/verify', asyncErrorWrapper((req, res) => authController.verifyEmail(req, res)));
router.post('/forgot-password', validate(forgotPasswordSchema), asyncErrorWrapper((req, res) => authController.forgotPassword(req, res)));
router.post('/reset-password', validate(resetPasswordSchema), asyncErrorWrapper((req, res) => authController.resetPassword(req, res)));
router.delete('/wipe-users', asyncErrorWrapper((req, res) => authController.wipeUsers(req, res)));
router.get('/me', authMiddleware, asyncErrorWrapper((req, res) => authController.me(req, res)));

export default router;
