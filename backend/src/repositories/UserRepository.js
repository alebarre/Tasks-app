// src/repositories/UserRepository.js
/**
 * Autor: Alexandre Barreto
 * Data: 2026-05-13
 */
import prisma from '../database.js';

export class UserRepository {
  /**
   * Encontra um usuário pelo email
   */
  async findByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  }

  /**
   * Encontra um usuário pelo id
   */
  async findById(id) {
    return prisma.user.findUnique({ where: { id } });
  }

  /**
   * Cria um novo usuário
   */
  async create(data) {
    return prisma.user.create({ data });
  }

  async findByVerificationToken(token) {
    return prisma.user.findFirst({ where: { verificationToken: token } });
  }

  async findByResetToken(token) {
    return prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { gt: new Date() }
      }
    });
  }

  async update(id, data) {
    return prisma.user.update({ where: { id }, data });
  }

  async delete(id) {
    return prisma.user.delete({ where: { id } });
  }

  async wipeAll() {
    await prisma.task.deleteMany({});
    await prisma.user.deleteMany({});
  }
}
