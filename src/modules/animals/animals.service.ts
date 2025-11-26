import { AnimalRepository } from "./animals.repository";
import { AnimalCreateInput } from "./dto/animals.dto";

const animalsRepository = new AnimalRepository();

export class AnimalService {
    async getAnimalsByTutor(tutorId: number) {
        if (!tutorId) {
            throw new Error('Usuario nao autenticado.');
        }

        return animalsRepository.findByTutorId(tutorId);
    }

    async createAnimal(tutorId: number, data: AnimalCreateInput) {
        if (!tutorId) {
            throw new Error('Usuario nao autenticado.');
        }

        const animalData = {
            ...data,
            fkCodTutor: tutorId
        };

        return animalsRepository.createAnimal(animalData);
    }

    async deleteAnimal(tutorId: number, animalId: number) {
        if (!tutorId) {
            throw new Error('Usuario nao autenticado.');
        }

        const deleted = await animalsRepository.deleteAnimal(animalId, tutorId);

        if (!deleted) {
            throw new Error('Animal não encontrado ou não pertence ao tutor.');
        }

        return true;
    }
}