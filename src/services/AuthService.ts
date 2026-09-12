import { UserRepository } from '../repositories/UserRepository';
import { CreateUserDTO } from '../dtos/CreateUserDTO';
import { hashPassword } from '../utils/passwordUtils';
import { User } from '../entities/User';

export class AuthService {
  async register(data: CreateUserDTO): Promise<Omit<User, 'senha'>> {
    const { nome, email, senha } = data;

    if (!nome || !email || !senha) {
      throw { status: 400, message: 'Nome, e-mail e senha são obrigatórios.' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw { status: 400, message: 'Formato de e-mail inválido.' };
    }

    const existingUser = await UserRepository.findOne({ where: { email } });
    if (existingUser) {
      throw { status: 409, message: 'E-mail já cadastrado.' };
    }

    const senhaHash = await hashPassword(senha);

    const user = UserRepository.create({
      nome,
      email,
      senha: senhaHash,
    });

    await UserRepository.save(user);

    const { senha: _, ...userSemSenha } = user;
    return userSemSenha;
  }
}