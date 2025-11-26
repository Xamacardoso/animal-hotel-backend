import express from 'express';
import cors from 'cors';
import { AuthController } from './controllers_deprecated/AuthController';
import { AnimalController } from './controllers_deprecated/AnimalController';
import { authMiddleware } from './middleware/authMiddleware';

const app = express();
app.use(express.json());
app.use(cors());

// Instâncias dos Controllers
const authController = new AuthController();
const animalController = new AnimalController();

// --- Rotas Públicas ---
app.post('/register', authController.register); // Cria Usuario + Tutor
app.post('/login', authController.login);

// --- Rotas Privadas (Requerem Token) ---
// Animais
app.post('/animais', authMiddleware, animalController.create);
app.get('/animais', authMiddleware, animalController.listMyAnimals);
app.delete('/animais/:id', authMiddleware, animalController.delete);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});