import {z} from "zod";

// Esquema para o Login
export const LoginSchema = z.object({
    email: z.string().email("Formato de e-mail inválido."),
    senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
  });
  
  // Esquema para o Registro
  export const RegisterSchema = z.object({
    nome: z.string().min(1, "Nome é obrigatório."),
    telefone: z.string().optional(),
    email: z.string().email("Formato de e-mail inválido."),
    senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
  });
  
  // Esquema para o Cadastro de Animal
  export const AnimalCreateSchema = z.object({
    nome: z.string().min(1, "Nome do animal é obrigatório."),
    especie: z.string().min(1, "Espécie é obrigatória."),
    raca: z.string().optional(),
    idade: z.number().int().positive("Idade deve ser um número positivo.").optional(),
    observacao: z.string().optional(),
    genero: z.enum(['M', 'F']).optional(),
  });