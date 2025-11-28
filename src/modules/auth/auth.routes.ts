import { FastifyTypedInstance } from "../../types";
import { AuthController } from "./auth.controller";
import { LoginDTO, RegisterDTO } from "./dto/auth.dto";

const authController = new AuthController();

export async function authRoutes(app: FastifyTypedInstance) {
    app.post('/register', {
        schema: {
            body: RegisterDTO,
            summary: 'Registrar um novo usuário e tutor',
            tags: ['Auth'],
        },
    }, authController.register);

    app.post('/login', {
        schema: {
            body: LoginDTO,
            summary: 'Login de usuário retornando token jwt',
            tags: ['Auth'],
        }
    }, authController.login);
}