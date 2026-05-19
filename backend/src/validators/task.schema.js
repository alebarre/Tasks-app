// src/validators/task.schema.js
/**
 * Autor: Alexandre Barreto
 * Data: 2026-05-13
 */
import { z } from 'zod';

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'O título é obrigatório'),
    description: z.string().optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).optional(),
    dueDate: z.string().datetime({ message: 'A data deve ser válida' }).optional(),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'O título não pode estar vazio').optional(),
    description: z.string().optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).optional(),
    dueDate: z.string().datetime({ message: 'A data deve ser válida' }).optional(),
  }),
});
