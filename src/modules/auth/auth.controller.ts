import { FastifyReply, FastifyRequest } from "fastify";
import { AuthService } from "./auth.service";
import { LoginInput, RegisterInput } from "./dto/auth.dto";

const authService = new AuthService();

export class AuthController {
    async register(request: FastifyRequest<{Body: RegisterInput}>, reply: FastifyReply) {
        try {
            const result = await authService.register(request.body);
            return reply.code(201).send({
                message: 'Usuário e Tutor criados com sucesso.',
                ...result
            });

        } catch (error: any) {
            return reply.code(500).send({ message: error.message });
        }
    }

    async login(request: FastifyRequest<{Body: LoginInput}>, reply: FastifyReply) {
        try {
            const result = await authService.login(request.body);
            return reply.code(200).send(result);
            
        } catch (error: any) {
            return reply.code(400).send({ message: error.message });
        }
    }
}