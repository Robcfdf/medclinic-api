import { Request, Response } from 'express';

export function notFoundMiddleware(req: Request, res: Response): Response {
  return res.status(404).json({ error: 'Rota não encontrada.' });
}
