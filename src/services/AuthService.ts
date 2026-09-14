import { UserRepository } from '../repositories/UserRepository';
import { CreateUserDTO } from '../dtos/CreateUserDTO';
import { LoginDTO } from '../dtos/LoginDTO';
import { hashPassword, comparePassword } from '../utils/passwordUtils';
import { generateToken } from '../utils/jwtUtils';
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

  async login(data: LoginDTO): Promise<{ token: string }> {
    const { email, senha } = data;

    if (!email || !senha) {
      throw { status: 400, message: 'E-mail e senha são obrigatórios.' };
    }

    const user = await UserRepository.findOne({ where: { email } });

    if (!user) {
      throw { status: 401, message: 'Credenciais inválidas.' };
    }

    const senhaValida = await comparePassword(senha, user.senha);

    if (!senhaValida) {
      throw { status: 401, message: 'Credenciais inválidas.' };
    }

    const token = generateToken({ id: user.id, role: user.role });

    return { token };
  }
}