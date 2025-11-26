import bcrypt from "bcryptjs";
import { AuthRepository } from "./auth.repository";
import { LoginInput, RegisterInput } from "./dto/auth.dto";
import { ENV } from "../../core/config/env";
import jwt from 'jsonwebtoken';
const authRepository = new AuthRepository();

export class AuthService {
    async register(data: RegisterInput) {
        // Verifica se o usuario ja existe
        const existingUser = await authRepository.findByEmail(data.email);

        if (existingUser) {
            throw new Error('E-mail já cadastrado.');
        }

        const senhaHash = await bcrypt.hash(data.senha, 10);

        const result = await authRepository.createTutor(data, senhaHash);

        // Retornando sem a senha hash
        const { senhaHash: _, ...userWithoutPass } = result.user;
        return {
            user: userWithoutPass,
            tutor: result.tutor
        };
    }

    async login(data: LoginInput) {
        const user = await authRepository.findByEmail(data.email);

        if (!user) {
            throw new Error('Credenciais inválidas.');
        }

        const isPasswordValid = await bcrypt.compare(data.senha, user.senhaHash);

        if (!isPasswordValid) {
            throw new Error('Credenciais inválidas.');
        }

        // Gerando jwt
        const token = jwt.sign({
            cod_usuario: user.codUsuario,
            cod_tutor: user.tutor?.codTutor,
            email: user.email
        }, ENV.JWT_SECRET, { expiresIn: '1d' });

        // Retornando dados
        const { senhaHash, ...userWithoutPass } = user;
        return {
            user: userWithoutPass,
            tutor: user.tutor,
            token
        };
    }
}