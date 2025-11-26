import { Response } from 'express';
import { PrismaClient } from '@prisma/client';

import { AuthRequest } from '../middleware/authMiddleware';

const prisma = new PrismaClient();

export class AnimalController {
    
    // Cadastrar animal (Automaticamente vinculado ao tutor logado)
    async create(req: AuthRequest, res: Response) {
        try {
            const { nome, especie, raca, idade, observacao, genero } = req.body;
            const cod_tutor = req.user?.cod_tutor;

            if (!cod_tutor) {
                return res.status(403).json({ error: 'Usuário não é um tutor válido' });
            }

            const animal = await prisma.animal.create({
                data: {
                    nome,
                    especie,
                    raca,
                    idade,
                    observacao,
                    genero,
                    fk_cod_tutor: cod_tutor
                }
            });

            return res.status(201).json(animal);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao cadastrar animal' });
        }
    }

    // Listar APENAS os animais do tutor logado
    async listMyAnimals(req: AuthRequest, res: Response) {
        try {
            const cod_tutor = req.user?.cod_tutor;

            const animais = await prisma.animal.findMany({
                where: {
                    fk_cod_tutor: cod_tutor
                }
            });

            return res.json(animais);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar animais' });
        }
    }
    
    // Deletar animal (Só se pertencer ao tutor)
    async delete(req: AuthRequest, res: Response) {
        const { id } = req.params;
        const cod_tutor = req.user?.cod_tutor;

        // Verifica se o animal pertence ao tutor antes de deletar
        const count = await prisma.animal.count({
            where: {
                cod_animal: Number(id),
                fk_cod_tutor: cod_tutor
            }
        });

        if (count === 0) {
            return res.status(403).json({ error: 'Não autorizado ou animal não encontrado' });
        }

        await prisma.animal.delete({ where: { cod_animal: Number(id) }});
        return res.status(204).send();
    }
}