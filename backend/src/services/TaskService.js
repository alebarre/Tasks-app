// src/services/TaskService.js
/**
 * Autor: Alexandre Barreto
 * Data: 2026-05-13
 */
import { TaskRepository } from '../repositories/TaskRepository.js';

export class TaskService {
  constructor() {
    this.taskRepository = new TaskRepository();
  }

  /**
   * Lista todas as tarefas do usuário
   */
  async listTasks(userId) {
    return this.taskRepository.findAllByUser(userId);
  }

  /**
   * Cria uma nova tarefa para o usuário
   */
  async createTask(userId, data) {
    const taskData = {
      ...data,
      userId,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    };
    return this.taskRepository.create(taskData);
  }

  /**
   * Atualiza uma tarefa verificando a propriedade
   */
  async updateTask(taskId, userId, data) {
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    if (task.userId !== userId) {
      const error = new Error('Unauthorized');
      error.statusCode = 403;
      throw error;
    }

    const updateData = { ...data };
    if (data.dueDate) {
      updateData.dueDate = new Date(data.dueDate);
    }

    return this.taskRepository.update(taskId, updateData);
  }

  /**
   * Remove uma tarefa verificando a propriedade
   */
  async deleteTask(taskId, userId) {
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    if (task.userId !== userId) {
      const error = new Error('Unauthorized');
      error.statusCode = 403;
      throw error;
    }

    return this.taskRepository.delete(taskId);
  }
}
