import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { db } from '../core/database/index';
import { usuarios, tutores, TUsuario, TTutor } from '../core/database/schema';
import { RegisterSchema, LoginSchema } from '../core/validation.schema';
import { ENV } from '../core/config/env'; 

export class AuthController {
    
    async register(req: Request, res: Response) {
        try {
            // 1. Validação de Entrada com Zod
            const parsedData = RegisterSchema.safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json({ 
                    error: 'Dados de entrada inválidos.', 
                    details: parsedData.error.flatten().fieldErrors 
                });
            }
            const { nome, telefone, email, senha } = parsedData.data;

            // 2. Verifica se o e-mail já existe
            const userExists = await db.query.usuarios.findFirst({
                where: eq(usuarios.email, email)
            });
            if (userExists) {
                return res.status(400).json({ error: 'E-mail já cadastrado.' });
            }

            // 3. Cria o hash da senha
            const senhaHashBcrypt = await bcrypt.hash(senha, 10);

            // 4. Executa a Transação Drizzle (cria Usuário e Tutor)
            const result: any = await db.transaction(async (tx) => {
                
                // Cria o Usuário
                const newUsers = await tx.insert(usuarios)
                    .values({ email, senhaHash: senhaHashBcrypt, nivelAcesso: 'tutor' })
                    .returning();
                
                const newUser = newUsers[0];

                // Cria o Tutor, ligando-o ao novo Usuário
                const newTutors = await tx.insert(tutores)
                    .values({ 
                        nome,
                        telefone,
                        fkCodUsuario: newUser.codUsuario 
                    })
                    .returning();

                // Usamos o 'as TUsuario/TTutor' para garantir que a inferência seja compatível com a remoção da senha hash no final
                return { user: newUser as TUsuario, tutor: newTutors[0] as TTutor };
            });

            // 5. Remove o hash da senha do objeto de retorno
            const { senhaHash, ...userWithoutPass } = result.user;

            return res.status(201).json({
                message: 'Usuário e Tutor criados com sucesso.',
                user: userWithoutPass,
                tutor: result.tutor
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao criar conta.' });
        }
    }

    async login(req: Request, res: Response) {
        try {
            // 1. Validação de Entrada com Zod
            const parsedData = LoginSchema.safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json({ 
                    error: 'Dados de entrada inválidos.', 
                    details: parsedData.error.flatten().fieldErrors 
                });
            }
            const { email, senha } = parsedData.data;

            // 2. Busca o usuário e o tutor associado
            const user = await db.query.usuarios.findFirst({
                where: eq(usuarios.email, email),
                with: {
                    tutor: { columns: { codTutor: true, nome: true, telefone: true } }
                }
            });

            if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });

            // 3. Verifica a senha
            const isValidPassword = await bcrypt.compare(senha, user.senhaHash);
            if (!isValidPassword) return res.status(401).json({ error: 'Credenciais inválidas' });

            // 4. Gera o token
            const token = jwt.sign({
                cod_usuario: user.codUsuario,
                cod_tutor: user.tutor?.codTutor,
                email: user.email
            }, ENV.JWT_SECRET, { expiresIn: '1d' });

            // 5. Retorna dados
            const { senhaHash, ...userWithoutPass } = user;
            return res.json({ 
                user: userWithoutPass, 
                tutor: user.tutor,
                token 
            });

        } catch (error) {
            return res.status(500).json({ error: 'Erro no login' });
        }
    }
}