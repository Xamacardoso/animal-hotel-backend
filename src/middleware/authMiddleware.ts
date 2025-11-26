import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { ENV } from '../core/config/env';
import { AuthUser } from 'src/types';

export const authHook = async (
    request: FastifyRequest,
    reply: FastifyReply,
) => {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        reply.status(401).send({ error: 'Token não fornecido ou formato de token invalido' });
        throw new Error('Unauthorized');
    }

    const [, token] = authHeader.split(' ');

    try {
        const decoded = jwt.verify(token, ENV.JWT_SECRET) as AuthUser;

        (request as any).user = decoded;
    } catch (error) {
        reply.status(401).send({ error: 'Token inválido ou expirado' });
        throw new Error('Unauthorized');
    }
}