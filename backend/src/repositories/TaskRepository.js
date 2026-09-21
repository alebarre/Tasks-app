// src/repositories/TaskRepository.js
/**
 * Autor: Alexandre Barreto
 * Data: 2026-05-13
 */
import prisma from '../database.js';

export class TaskRepository {
  /**
   * Retorna as tarefas de um usuário, filtrando por arquivadas ou ativas
   */
  async findAllByUser(userId, { archived = false } = {}) {
    return prisma.task.findMany({
      where: { userId, archived },
      ...(archived && { orderBy: { archivedAt: 'desc' } }),
    });
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
   * Arquiva em lote todas as tarefas concluídas (e ainda não arquivadas) do usuário.
   * Retorna a quantidade de tarefas arquivadas.
   */
  async archiveCompletedByUser(userId) {
    const result = await prisma.task.updateMany({
      where: { userId, status: 'COMPLETED', archived: false },
      data: { archived: true, archivedAt: new Date() },
    });
    return result.count;
  }

  /**
   * Deleta uma tarefa
   */
  async delete(id) {
    return prisma.task.delete({ where: { id } });
  }
}
