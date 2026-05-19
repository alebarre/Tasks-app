// src/repositories/TaskRepository.js
/**
 * Autor: Alexandre Barreto
 * Data: 2026-05-13
 */
import prisma from '../database.js';

export class TaskRepository {
  /**
   * Retorna todas as tarefas de um usuário
   */
  async findAllByUser(userId) {
    return prisma.task.findMany({ where: { userId } });
  }

  /**
   * Encontra uma tarefa pelo id
   */
  async findById(id) {
    return prisma.task.findUnique({ where: { id } });
  }

  /**
   * Cria uma tarefa
   */
  async create(data) {
    return prisma.task.create({ data });
  }

  /**
   * Atualiza uma tarefa
   */
  async update(id, data) {
    return prisma.task.update({ where: { id }, data });
  }

  /**
   * Deleta uma tarefa
   */
  async delete(id) {
    return prisma.task.delete({ where: { id } });
  }
}
