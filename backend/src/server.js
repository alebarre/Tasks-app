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

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', origins: allowedOrigins });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Tratamento de rotas inexistentes
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Rota não encontrada' });
});

// Middleware de tratamento de erros global
app.use(errorHandler);

app.listen(config.app.port, () => {
  console.log(`Servidor rodando na porta ${config.app.port}`);
});

export default app;
