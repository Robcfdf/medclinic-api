import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

export class AdminController {
  async ping(req: AuthenticatedRequest, res: Response): Promise<Response> {
    return res.status(200).json({
      message: 'Acesso autorizado! Você é um Administrador.',
    });
  }
}