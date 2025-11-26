import { Request, Response } from 'express';
import PrismaClient from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient.PrismaClient();

export class AuthController {
    // Registro: Cria Usuario E Tutor numa única transação
    async register(req: Request, res: Response) {
        try {
            const { nome, email, senha, telefone } = req.body;

            // Verifica se email já existe
            const userExists = await prisma.usuario.findUnique({ where: { email } });
            if (userExists) return res.status(400).json({ error: 'Email já cadastrado' });

            const hash = await bcrypt.hash(senha, 10);

            // Transação: Cria usuário e tutor juntos. Se um falhar, tudo falha.
            const result = await prisma.$transaction(async (tx) => {
                const newUser = await tx.usuario.create({
                    data: {
                        email,
                        senha_hash: hash,
                        nivel_acesso: 'tutor'
                    }
                });

                const newTutor = await tx.tutor.create({
                    data: {
                        nome,
                        telefone,
                        fk_cod_usuario: newUser.cod_usuario
                    }
                });

                return { user: newUser, tutor: newTutor };
            });

            return res.status(201).json(result);

        } catch (error) {
            return res.status(500).json({ error: 'Erro ao criar conta' });
        }
    }

    // Login: Retorna Token com ID do Usuario e ID do Tutor
    async login(req: Request, res: Response) {
        const { email, senha } = req.body;

        const user = await prisma.usuario.findUnique({
            where: { email },
            include: { tutor: true } // Já traz o tutor associado
        });

        if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });

        const isValidPassword = await bcrypt.compare(senha, user.senha_hash);
        if (!isValidPassword) return res.status(401).json({ error: 'Credenciais inválidas' });

        // Gera token contendo IDs importantes
        const token = jwt.sign({
            cod_usuario: user.cod_usuario,
            cod_tutor: user.tutor?.cod_tutor, // Importante para filtrar animais depois!
            email: user.email
        }, process.env.JWT_SECRET as string, { expiresIn: '1d' });

        // Retorna dados básicos e token (sem senha)
        const { senha_hash, ...userWithoutPass } = user;
        return res.json({ user: userWithoutPass, token });
    }
}