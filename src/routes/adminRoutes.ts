import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const adminRoutes = Router();
const adminController = new AdminController();

adminRoutes.get(
  '/ping',
  authMiddleware,
  roleMiddleware(['admin']),
  (req, res) => adminController.ping(req, res)
);

export default adminRoutes;