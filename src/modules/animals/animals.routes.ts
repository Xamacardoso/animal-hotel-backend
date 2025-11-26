import { FastifyTypedInstance } from "../../types";
import { AnimalsController } from "./animals.controller";
import z from "zod";
import { authHook } from "../../middleware/authMiddleware";
import { AnimalCreateDTO } from "./dto/animals.dto";

const animalsController = new AnimalsController();

const AnimalIdParamsSchema = z.object({
   // Transforma a string do parâmetro URL em inteiro e valida se é positivo
   id: z.string().transform(val => parseInt(val, 10)).pipe(z.number().int().positive())
});

export async function animalsRoutes(app: FastifyTypedInstance) {
    app.post('/', {
        preHandler: authHook,
        schema: {
            body: AnimalCreateDTO,
            tags: ['Animals'],
            description: 'Cadastra um novo animal para o tutor autenticado.',
            security: [{ BearerAuth: [] }],
        }
    }, (req: any, res) => animalsController.create(req, res));

    app.get('/', {
        preHandler: authHook,
        schema: {
            tags: ['Animals'],
            description: 'Lista todos os animais do tutor autenticado.',
            security: [{ BearerAuth: [] }],
        }
    }, (req: any, res) => animalsController.listAnimalsByTutor(req, res));

    app.delete('/:id', {
        preHandler: authHook,
        schema: {
            params: AnimalIdParamsSchema,
            tags: ['Animals'],
            description: 'Remove um animal do tutor autenticado pelo ID.',
            security: [{ BearerAuth: [] }],
        }
    }, (req: any, res) => animalsController.delete(req, res));
}