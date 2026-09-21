// src/controllers/TaskController.js
/**
 * Autor: Alexandre Barreto
 * Data: 2026-05-13
 */
import { BaseController } from './BaseController.js';
import { TaskService } from '../services/TaskService.js';

export class TaskController extends BaseController {
  constructor() {
    super();
    this.taskService = new TaskService();
  }

  /**
   * Lista tarefas ativas do usuário
   */
  async list(req, res) {
    try {
      const tasks = await this.taskService.listTasks(req.user.id);
      this.handleSuccess(res, tasks, 200);
    } catch (error) {
      this.handleError(error, res, 'TaskController.list');
    }
  }

  /**
   * Lista tarefas arquivadas do usuário
   */
  async listArchived(req, res) {
    try {
      const tasks = await this.taskService.listArchivedTasks(req.user.id);
      this.handleSuccess(res, tasks, 200);
    } catch (error) {
      this.handleError(error, res, 'TaskController.listArchived');
    }
  }

  /**
   * Cria nova tarefa
   */
  async create(req, res) {
    try {
      const task = await this.taskService.createTask(req.user.id, req.body);
      this.handleSuccess(res, task, 201);
    } catch (error) {
      this.handleError(error, res, 'TaskController.create');
    }
  }

  /**
   * Atualiza tarefa existente
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const task = await this.taskService.updateTask(id, req.user.id, req.body);
      this.handleSuccess(res, task, 200);
    } catch (error) {
      this.handleError(error, res, 'TaskController.update');
    }
  }

  /**
   * Arquiva em lote todas as tarefas concluídas
   */
  async archiveCompleted(req, res) {
    try {
      const result = await this.taskService.archiveCompletedTasks(req.user.id);
      this.handleSuccess(res, result, 200);
    } catch (error) {
      this.handleError(error, res, 'TaskController.archiveCompleted');
    }
  }

  /**
   * Reativa uma tarefa arquivada
   */
  async unarchive(req, res) {
    try {
      const { id } = req.params;
      const task = await this.taskService.unarchiveTask(id, req.user.id);
      this.handleSuccess(res, task, 200);
    } catch (error) {
      this.handleError(error, res, 'TaskController.unarchive');
    }
  }

  /**
   * Deleta tarefa
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      await this.taskService.deleteTask(id, req.user.id);
      this.handleSuccess(res, null, 204);
    } catch (error) {
      this.handleError(error, res, 'TaskController.delete');
    }
  }
}
