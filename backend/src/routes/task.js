// src/routes/task.js
/**
 * Autor: Alexandre Barreto
 * Data: 2026-05-13
 */
import { Router } from 'express';
import { TaskController } from '../controllers/TaskController.js';
import { authMiddleware } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createTaskSchema, updateTaskSchema } from '../validators/task.schema.js';
import { asyncErrorWrapper } from '../middleware/error.js';

const router = Router();
const taskController = new TaskController();

router.use(authMiddleware);

router.get('/', asyncErrorWrapper((req, res) => taskController.list(req, res)));
router.post('/', validate(createTaskSchema), asyncErrorWrapper((req, res) => taskController.create(req, res)));
router.put('/:id', validate(updateTaskSchema), asyncErrorWrapper((req, res) => taskController.update(req, res)));
router.delete('/:id', asyncErrorWrapper((req, res) => taskController.delete(req, res)));

export default router;
