// src/server.js
/**
 * Autor: Alexandre Barreto
 * Data: 2026-05-13
 */
import express from 'express';
import cors from 'cors';
import { config } from './config/unifiedConfig.js';
import { errorHandler } from './middleware/error.js';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/task.js';

const app = express();

app.use(cors());
app.use(express.json());

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Tratamento de rotas inexistentes
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Middleware de tratamento de erros global
app.use(errorHandler);

app.listen(config.app.port, () => {
  console.log(`Server is running on port ${config.app.port}`);
});

export default app;
