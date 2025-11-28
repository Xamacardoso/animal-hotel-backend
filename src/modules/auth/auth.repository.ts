import { db } from "../../core/database";
import { eq } from "drizzle-orm";
import { RegisterInput } from "./dto/auth.dto";
import { tutores, usuarios } from "../../core/database/schema";

type TRegisterData = RegisterInput & { senha: string};

export class AuthRepository {
    // Buscar usuário pelo email, incluindo dados do tutor
    async findByEmail(email: string) {
        return db.query.usuarios.findFirst({
            where: eq(usuarios.email, email),
            with: {tutor: true}
        });
    }

    async createTutor(data: TRegisterData, senhaHash: string) {
        return db.transaction(async (tx) => {
            // Criando usuario
            const newUsers = await tx.insert(usuarios)
                .values({ 
                    email: data.email, 
                    senhaHash: senhaHash, 
                    nivelAcesso: 'tutor' 
                })
                .returning();

            const newUser = newUsers[0];

            // Cria o tutor
            const newTutors = await tx.insert(tutores)
                .values({ 
                    nome: data.nome,
                    telefone: data.telefone,
                    fkCodUsuario: newUser.codUsuario 
                })
                .returning();

            return { user: newUser, tutor: newTutors[0] };
        });
    }
}