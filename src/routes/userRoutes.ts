import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authMiddleware } from '../middlewares/authMiddleware';

const userRoutes = Router();
const userController = new UserController();

userRoutes.get('/me', authMiddleware, (req, res) => userController.me(req, res));

export default userRoutes;