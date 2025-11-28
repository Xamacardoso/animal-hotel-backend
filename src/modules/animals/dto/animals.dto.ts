import {z} from "zod";


// Esquema para o Cadastro de Animal
export const AnimalCreateDTO = z.object({
    nome: z.string().min(1, "Nome do animal é obrigatório."),
    especie: z.string().min(1, "Espécie é obrigatória."),
    raca: z.string().optional(),
    idade: z.number().int().positive("Idade deve ser um número positivo.").optional(),
    observacao: z.string().optional(),
    genero: z.enum(['M', 'F']).optional(),
});

export type AnimalCreateInput = z.infer<typeof AnimalCreateDTO>;