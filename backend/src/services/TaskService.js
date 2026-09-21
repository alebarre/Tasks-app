// src/services/TaskService.js
/**
 * Autor: Alexandre Barreto
 * Data: 2026-05-13
 */
import { TaskRepository } from '../repositories/TaskRepository.js';

/** Campos que o usuário pode informar ao criar/editar uma tarefa */
const EDITABLE_FIELDS = ['title', 'description', 'priority', 'status', 'dueDate'];

function pickEditable(data) {
  const picked = {};
  for (const field of EDITABLE_FIELDS) {
    if (data[field] !== undefined) picked[field] = data[field];
  }
  return picked;
}

function httpError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

export class TaskService {
  constructor() {
    this.taskRepository = new TaskRepository();
  }

  /**
   * Lista as tarefas ativas (não arquivadas) do usuário
   */
  async listTasks(userId) {
    return this.taskRepository.findAllByUser(userId, { archived: false });
  }

  /**
   * Lista as tarefas arquivadas do usuário
   */
  async listArchivedTasks(userId) {
    return this.taskRepository.findAllByUser(userId, { archived: true });
  }

  /**
   * Cria uma nova tarefa para o usuário
   */
  async createTask(userId, data) {
    const taskData = {
      ...pickEditable(data),
      userId,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    };
    return this.taskRepository.create(taskData);
  }

  /**
   * Busca a tarefa e garante que pertence ao usuário
   */
  async #findOwnedTask(taskId, userId) {
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw httpError('Tarefa não encontrada', 404);
    }
    if (task.userId !== userId) {
      throw httpError('Não autorizado', 403);
    }
    return task;
  }

  /**
   * Atualiza uma tarefa verificando a propriedade
   */
  async updateTask(taskId, userId, data) {
    await this.#findOwnedTask(taskId, userId);

    const updateData = pickEditable(data);
    if (data.dueDate) {
      updateData.dueDate = new Date(data.dueDate);
    }

    return this.taskRepository.update(taskId, updateData);
  }

  /**
   * Arquiva todas as tarefas concluídas do usuário.
   * Retorna a quantidade arquivada (0 quando não há tarefas concluídas).
   */
  async archiveCompletedTasks(userId) {
    const count = await this.taskRepository.archiveCompletedByUser(userId);
    return { count };
  }

  /**
   * Reativa uma tarefa arquivada, devolvendo-a ao fluxo normal
   */
  async unarchiveTask(taskId, userId) {
    const task = await this.#findOwnedTask(taskId, userId);
    if (!task.archived) {
      throw httpError('A tarefa não está arquivada', 400);
    }
    return this.taskRepository.update(taskId, { archived: false, archivedAt: null });
  }

  /**
   * Remove uma tarefa verificando a propriedade
   */
  async deleteTask(taskId, userId) {
    await this.#findOwnedTask(taskId, userId);
    return this.taskRepository.delete(taskId);
  }
}
