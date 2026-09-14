import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { UserRepository } from '../repositories/UserRepository';

export class UserController {
  async me(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;

      const user = await UserRepository.findOne({ where: { id: userId } });

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }

      const { senha, ...userSemSenha } = user;
      return res.status(200).json(userSemSenha);
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }
}