# --- Estágio 1: Builder (Compila o TypeScript) ---
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copia arquivos de dependência
COPY package*.json ./
COPY prisma ./prisma/

# Instala TODAS as dependências (incluindo dev) para poder compilar
RUN npm install

# Gera o cliente do Prisma (necessário para o build)
RUN npx prisma generate

# Copia o código fonte
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
RUN npm install --only=production

# Copia o código compilado do estágio anterior
COPY --from=builder /usr/src/app/dist ./dist

# Copia a pasta prisma (necessária para validações de schema em runtime, se houver)
COPY --from=builder /usr/src/app/prisma ./prisma

# Copia o cliente Prisma gerado do estágio anterior (CRUCIAL)
# O Prisma gera os arquivos binários dentro de node_modules
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /usr/src/app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 3000

# Comando padrão para produção
CMD ["npm", "start"]