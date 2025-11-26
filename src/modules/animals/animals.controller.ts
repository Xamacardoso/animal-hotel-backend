import { AnimalService } from "./animals.service";
import { AnimalCreateInput } from "./dto/animals.dto";
import { FastifyReply, FastifyRequest, RouteGenericInterface } from "fastify";

const animalsService = new AnimalService();

interface AnimalCreateRoute extends RouteGenericInterface {
    Body: AnimalCreateInput;
}

interface DeleteAnimalRoute extends RouteGenericInterface {
    Params: {
        id: string;
    };
}

export class AnimalsController {
    async create(
        request: FastifyRequest<{Body: AnimalCreateInput}>,
        reply: FastifyReply
    ) {
        const body = request.body;
        const codTutor = request.user?.cod_tutor!;

        // if (!codTutor) {
        //     return reply.status(401).send({ message: 'Tutor não autenticado.' });
        // }

        try {
            const newAnimal = await animalsService.createAnimal(codTutor, body);
            return reply.status(201).send({ message: 'Animal cadastrado com sucesso!', newAnimal});

        } catch (error: any) {
            console.error(error);

            return reply.status(500).send({ message: 'Erro ao cadastrar animal.' });
        }
    }

    async listAnimalsByTutor(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        const codTutor = request.user?.cod_tutor!;

        try {
            const animals = await animalsService.getAnimalsByTutor(codTutor);

            return reply.status(200).send(animals);
        } catch (error: any) {
            console.error(error);

            return reply.status(500).send({ message: 'Erro ao buscar animais.' });
        }
    }

    async delete(
        request: FastifyRequest<DeleteAnimalRoute>,
        reply: FastifyReply
    ) {
        const codTutor = request.user?.cod_tutor!;
        const animalId = Number(request.params.id);

        try {
            await animalsService.deleteAnimal(codTutor, animalId);

            return reply.status(204).send();
        } catch (error: any) {
            console.error(error);

            return reply.status(500).send({ message: 'Erro ao deletar animal.' });
        }
    }
}