// src/services/AuthService.js
/**
 * Autor: Alexandre Barreto
 * Data: 2026-05-13
 */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '../config/unifiedConfig.js';
import { UserRepository } from '../repositories/UserRepository.js';
import { sendEmail } from '../utils/email.js';

export class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Registra um novo usuário
   */
  async register(data) {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      const error = new Error('Este e-mail já está em uso');
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    const user = await this.userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      verificationToken,
      isEmailVerified: false
    });

    try {
      const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify?token=${verificationToken}`;
      await sendEmail({
        to: user.email,
        subject: 'Bem-vindo ao TaskApp - Verifique seu e-mail',
        html: `<h2>Bem-vindo ao TaskApp!</h2>
               <p>Por favor, clique no link abaixo para verificar seu endereço de e-mail:</p>
               <a href="${verifyUrl}">Verificar E-mail</a>`
      });
    } catch (error) {
      await this.userRepository.delete(user.id);
      throw error;
    }

    return { message: 'Registro realizado com sucesso. Verifique seu e-mail para ativar a conta.' };
  }

  /**
   * Faz login do usuário
   */
  async login(email, password) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      const error = new Error('Credenciais inválidas');
      error.statusCode = 401;
      throw error;
    }

    if (!user.isEmailVerified) {
      const error = new Error('Por favor, verifique seu e-mail antes de fazer o login');
      error.statusCode = 403;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error('Credenciais inválidas');
      error.statusCode = 401;
      throw error;
    }

    const token = this.generateToken(user.id);
    return { user: this.sanitizeUser(user), token };
  }

  async verifyEmail(token) {
    const user = await this.userRepository.findByVerificationToken(token);
    if (!user) {
      const error = new Error('Token de verificação inválido ou expirado');
      error.statusCode = 400;
      throw error;
    }

    await this.userRepository.update(user.id, {
      isEmailVerified: true,
      verificationToken: null
    });

    return { message: 'E-mail verificado com sucesso' };
  }

  async forgotPassword(email) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return { message: 'Se esse e-mail estiver registrado, enviaremos um link de recuperação.' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

    await this.userRepository.update(user.id, {
      resetPasswordToken: resetToken,
      resetPasswordExpires
    });

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
    await sendEmail({
      to: user.email,
      subject: 'TaskApp - Solicitação de Redefinição de Senha',
      html: `<h2>Redefinição de Senha</h2>
             <p>Você solicitou uma redefinição de senha. Clique no link abaixo para criar uma nova senha:</p>
             <a href="${resetUrl}">Redefinir Senha</a>
             <p>Se você não solicitou isso, por favor ignore este e-mail.</p>`
    });

    return { message: 'Se esse e-mail estiver registrado, enviaremos um link de recuperação.' };
  }

  async resetPassword(token, newPassword) {
    const user = await this.userRepository.findByResetToken(token);
    if (!user) {
      const error = new Error('Token de redefinição inválido ou expirado');
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(user.id, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null
    });

    return { message: 'Senha redefinida com sucesso. Você já pode fazer login.' };
  }

  /**
   * Retorna os dados do usuário atual
   */
  async me(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      const error = new Error('Usuário não encontrado');
      error.statusCode = 404;
      throw error;
    }
    return this.sanitizeUser(user);
  }

  generateToken(userId) {
    return jwt.sign({ userId }, config.auth.jwtSecret, {
      expiresIn: config.auth.jwtExpiresIn,
    });
  }

  sanitizeUser(user) {
    const { password, ...rest } = user;
    return rest;
  }
}
