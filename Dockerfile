# --- Estágio 1: Builder (Compila o TypeScript) ---
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copia arquivos de dependência
COPY package*.json ./
# A pasta prisma não é mais necessária

# Instala TODAS as dependências (incluindo dev) para poder compilar
RUN npm install

# O comando npx prisma generate foi removido

# Copia o código fonte (inclui src/ e drizzle.config.ts)
COPY . .

# Compila o TypeScript para JavaScript (pasta /dist)
RUN npm run build

# --- Estágio 2: Production (Imagem Final Leve) ---
FROM node:20-alpine

WORKDIR /usr/src/app

ENV NODE_ENV=production

# Copia package.json para instalar apenas deps de produção
COPY package*.json ./

# Instala APENAS dependências de produção (ignora devDependencies)
# O Drizzle ORM, Zod e o driver PG são instalados aqui
RUN npm install --only=production

# Copia o código compilado do estágio anterior
COPY --from=builder /usr/src/app/dist ./dist

COPY --from=builder /usr/src/app/src/core/database/migrations ./src/core/database/migrations

# As pastas prisma, .prisma e @prisma não são mais necessárias e foram removidas.

EXPOSE 3000

# Comando padrão para produção
CMD ["sh", "-c","node dist/core/database/migrate.js && npm start"]