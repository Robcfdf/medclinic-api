import { Request, Response, NextFunction } from 'express';

export function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): Response {
  console.error('Erro capturado pelo middleware central:', err);

  const status = err.status || 500;
  const message = err.message || 'Erro interno do servidor.';

  return res.status(status).json({ error: message });
}