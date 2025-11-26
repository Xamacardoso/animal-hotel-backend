// src/env.ts
import dotenv from "dotenv";
import path from "path";

// Decide qual env usar com base em NODE_ENV ou outra variável
const envFile = process.env.NODE_ENV === "production" ? ".env.prod" : ".env.dev";

// Carrega o arquivo correspondente
dotenv.config({
  path: path.resolve(process.cwd(), envFile),
});

// Exporta as variáveis já tipadas para usar no projeto
export const ENV = {
  DATABASE_URL: process.env.DATABASE_URL!,
  PORT: process.env.PORT || "3000",
  // adicione outras variáveis que você precisar
};