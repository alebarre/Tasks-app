// src/controllers/AuthController.js
/**
 * Autor: Alexandre Barreto
 * Data: 2026-05-13
 */
import { BaseController } from './BaseController.js';
import { AuthService } from '../services/AuthService.js';

export class AuthController extends BaseController {
  constructor() {
    super();
    this.authService = new AuthService();
  }

  /**
   * Lida com registro de usuário
   */
  async register(req, res) {
    try {
      const result = await this.authService.register(req.body);
      this.handleSuccess(res, result, 201);
    } catch (error) {
      this.handleError(error, res, 'AuthController.register');
    }
  }

  /**
   * Lida com login de usuário
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);
      this.handleSuccess(res, result, 200);
    } catch (error) {
      this.handleError(error, res, 'AuthController.login');
    }
  }

  async verifyEmail(req, res) {
    try {
      const { token } = req.query;
      const result = await this.authService.verifyEmail(token);
      this.handleSuccess(res, result, 200);
    } catch (error) {
      this.handleError(error, res, 'AuthController.verifyEmail');
    }
  }

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const result = await this.authService.forgotPassword(email);
      this.handleSuccess(res, result, 200);
    } catch (error) {
      this.handleError(error, res, 'AuthController.forgotPassword');
    }
  }

  async resetPassword(req, res) {
    try {
      const { token, password } = req.body;
      const result = await this.authService.resetPassword(token, password);
      this.handleSuccess(res, result, 200);
    } catch (error) {
      this.handleError(error, res, 'AuthController.resetPassword');
    }
  }

  async wipeUsers(req, res) {
    try {
      await this.authService.userRepository.wipeAll();
      this.handleSuccess(res, { message: 'Todos os usuários e tarefas foram apagados com sucesso.' }, 200);
    } catch (error) {
      this.handleError(error, res, 'AuthController.wipeUsers');
    }
  }

  /**
   * Retorna dados do usuário autenticado
   */
  async me(req, res) {
    try {
      const user = await this.authService.me(req.user.id);
      this.handleSuccess(res, user, 200);
    } catch (error) {
      this.handleError(error, res, 'AuthController.me');
    }
  }
}
