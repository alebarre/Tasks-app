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
   * Lista tarefas do usuário
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
