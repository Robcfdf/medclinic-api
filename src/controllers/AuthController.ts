import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response): Promise<Response> {
    try {
      const user = await authService.register(req.body);
      return res.status(201).json(user);
    } catch (error: any) {
      const status = error.status || 500;
      const message = error.message || 'Erro interno do servidor.';
      return res.status(status).json({ error: message });
    }
  }
}