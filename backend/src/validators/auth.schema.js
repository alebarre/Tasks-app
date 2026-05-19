// src/validators/auth.schema.js
/**
 * Autor: Alexandre Barreto
 * Data: 2026-05-13
 */
import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
    email: z.string().email('Endereço de e-mail inválido'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string()
  }).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Endereço de e-mail inválido'),
    password: z.string().min(1, 'A senha é obrigatória'),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Endereço de e-mail inválido'),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string(),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  }),
});
