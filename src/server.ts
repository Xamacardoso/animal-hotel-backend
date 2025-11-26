import express from 'express';
import cors from 'cors';
import { AuthController } from './controllers/AuthController';
import { AnimalController } from './controllers/AnimalController';
import { authMiddleware } from './middleware/authMiddleware';
import { ENV } from './core/config/env'; // Importa a configuração de ambiente
import { pool } from './core/database';

// --- Configuração do App Express ---
const app = express();

// Middlewares Globais
app.use(express.json()); // Permite que o Express leia JSON no corpo da requisição
app.use(cors()); // Habilita CORS para permitir requisições de outras origens

// Instâncias dos Controllers
const authController = new AuthController();
const animalController = new AnimalController();

// --- Rotas Públicas (Autenticação) ---
app.post('/register', authController.register); // Cria Usuario + Tutor
app.post('/login', authController.login);

// --- Rotas Privadas (Requerem Token JWT) ---
// O authMiddleware verifica o token antes de passar para o controller
// Animais
app.post('/animais', authMiddleware, animalController.create);
app.get('/animais', authMiddleware, animalController.listMyAnimals);
app.delete('/animais/:id', authMiddleware, animalController.delete);

// --- Inicialização do Servidor ---
const PORT = parseInt(ENV.PORT, 10); // Pega a porta do ENV tipado

const server = app.listen(PORT, () => {
    // Exibe informações importantes ao iniciar o servidor
    console.log(`Ambiente: ${ENV.NODE_ENV}`);
    console.log(`🚀 Servidor rodando`);
    // Omitindo a URL completa do DB por segurança, mostrando apenas o host/porta
    console.log(`DB Host: ${ENV.DATABASE_URL.split('@')[1]}`); 
});

function shutdown() {
    console.log('\nDesligando servidor...');
    server.close(() => {
        // Encerra todas as conexões do pool do PostgreSQL
        pool.end(() => {
            console.log('Conexões do DB encerradas.');
            process.exit(0);
        });
    });
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);