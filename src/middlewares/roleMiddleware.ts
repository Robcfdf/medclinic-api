import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authMiddleware';

export function roleMiddleware(rolesPermitidas: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void | Response => {
    const userRole = req.user?.role;

    if (!userRole || !rolesPermitidas.includes(userRole)) {
      return res.status(403).json({ error: 'Acesso negado. Permissão insuficiente.' });
    }

    return next();
  };
}