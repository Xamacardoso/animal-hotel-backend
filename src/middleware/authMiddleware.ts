import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Estendendo a tipagem do Express para incluir o usuario no request
export interface AuthRequest extends Request {
    user?: {
        cod_usuario: number;
        cod_tutor?: number;
        email: string;
    }
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    // O header vem como "Bearer <token>", pegamos só a segunda parte
    const [, token] = authHeader.split(' ');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = decoded as any;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido' });
    }
};