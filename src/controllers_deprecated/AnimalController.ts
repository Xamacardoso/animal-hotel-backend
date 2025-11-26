import { Response } from 'express';
import { eq, and } from 'drizzle-orm';
import { db } from '../core/database';
import { animais } from '../core/database/schema';
import { AuthRequest } from '../middleware/authMiddleware';
import { AnimalCreateSchema } from '../core/validation.schema';

export class AnimalController {
    
    // Cadastrar animal (Automaticamente vinculado ao tutor logado)
    async create(req: AuthRequest, res: Response) {
        try {
            // 1. Validação de Entrada com Zod
            const parsedData = AnimalCreateSchema.safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json({ 
                    error: 'Dados de entrada inválidos.', 
                    details: parsedData.error.flatten().fieldErrors 
                });
            }
            const { nome, especie, raca, idade, observacao, genero } = parsedData.data;
            const codTutor = req.user?.cod_tutor; 

            if (!codTutor) {
                return res.status(403).json({ error: 'Usuário não é um tutor válido' });
            }

            // 2. Cria o animal no banco de dados
            const newAnimal = await db.insert(animais)
                .values({
                    nome,
                    especie,
                    raca,
                    idade,
                    observacao,
                    genero,
                    fkCodTutor: codTutor
                })
                .returning(); 

            return res.status(201).json(newAnimal[0]);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao cadastrar animal' });
        }
    }

    // Listar APENAS os animais do tutor logado
    async listMyAnimals(req: AuthRequest, res: Response) {
        try {
            const codTutor = req.user?.cod_tutor;

            if (!codTutor) {
                return res.status(403).json({ error: 'Usuário não é um tutor válido' });
            }

            const listaAnimais = await db.query.animais.findMany({
                where: eq(animais.fkCodTutor, codTutor)
            });

            return res.json(listaAnimais);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao buscar animais' });
        }
    }
    
    // Deletar animal (Só se pertencer ao tutor)
    async delete(req: AuthRequest, res: Response) {
        const id = Number(req.params.id);
        const codTutor = req.user?.cod_tutor;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID do animal inválido.' });
        }
        
        // Verifica se o animal pertence ao tutor e deleta
        const deleted = await db.delete(animais)
            .where(
                and(
                    eq(animais.codAnimal, id),
                    eq(animais.fkCodTutor, codTutor!)
                )
            )
            .returning(); 

        if (deleted.length === 0) {
            return res.status(403).json({ error: 'Não autorizado ou animal não encontrado' });
        }

        return res.status(204).send();
    }
}