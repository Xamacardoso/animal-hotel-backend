import {z} from "zod";

// Esquema para login
export const LoginDTO = z.object({
    email: z.string().email("Formato de e-mail inválido."),
    senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});
  
// Esquema para o Registro
export const RegisterDTO = z.object({
    nome: z.string().min(1, "Nome é obrigatório."),
    telefone: z.string().optional(),
    email: z.string().email("Formato de e-mail inválido."),
    senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

export type LoginInput = z.infer<typeof LoginDTO>;
export type RegisterInput = z.infer<typeof RegisterDTO>;