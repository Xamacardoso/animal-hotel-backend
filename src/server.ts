import { ENV } from './core/config/env'; // Importa a configuração de ambiente
import { pool } from './core/database';
import fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import fastifyCors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import { authRoutes } from './modules/auth/auth.routes';
import { animalsRoutes } from './modules/animals/animals.routes';

// --- Configuração do App Express ---
const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {origin: '*'});

app.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'API de Hotel de Animais',
            description: 'API para gerenciar usuários, tutores e animais.',
            version: '1.0.0',
        },
    }
});

app.register(authRoutes, { prefix: '/api' });
app.register(animalsRoutes, { prefix: '/api/animals' });

// --- Inicialização do Servidor ---
const PORT = parseInt(ENV.PORT, 10); // Pega a porta do ENV tipado

const start = async () => {
    try {
        await app.listen({port: PORT, host: '0.0.0.0'});
        await app.ready();

        app.swagger();

        console.log(`\n⚙️  Ambiente: ${ENV.NODE_ENV}`);
        console.log(`🚀 Servidor rodando`);
        // Omitindo a URL completa do DB por segurança, mostrando apenas o host/porta
        console.log(`🎲 DB Host: ${ENV.DATABASE_URL.split('@')[1]}`); 
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
}

function shutdown() {
    console.log('\nDesligando servidor...');
    app.close(() => {
        // Encerra todas as conexões do pool do PostgreSQL
        pool.end(() => {
            console.log('Conexões do DB encerradas.');
            process.exit(0);
        });
    });
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

start();