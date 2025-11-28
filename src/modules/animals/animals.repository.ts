import { db } from "../../core/database"; 
import { eq, and, InferInsertModel } from "drizzle-orm";
import { animais, TAnimal } from "../../core/database/schema";

// Essa linha define o tipo para inserção de novos animais, baseado no esquema do banco de dados, facilitando a tipagem correta dos dados ao criar novos registros.
type NewAnimal = InferInsertModel<typeof animais>;

export class AnimalRepository {
    async findByTutorId(tutorId: number) : Promise<TAnimal[]> {
        return db.query.animais.findMany({
            where: eq(animais.fkCodTutor, tutorId)
        });
    }

    async createAnimal(animalData: Omit<NewAnimal, 'codAnimal'>) : Promise<TAnimal> {
        const result = await db.insert(animais)
            .values(animalData)
            .returning();

        return result[0];
    }

    async deleteAnimal(animalId: number, tutorId: number) : Promise<boolean> {
        // Lógica para deletar um animal pelo ID, garantindo que pertence ao tutor
        const deleted = await db.delete(animais)
            .where(
                and(
                    eq(animais.codAnimal, animalId),
                    eq(animais.fkCodTutor, tutorId)
                )
            )
            .returning({codAnimal: animais.codAnimal});

        return deleted.length > 0;
    }
}