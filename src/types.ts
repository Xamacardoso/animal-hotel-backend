import { FastifyBaseLogger, FastifyInstance, FastifyRequest, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault, RouteGenericInterface } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export interface AuthUser {
    cod_tutor: number;
    cod_usuario: number;
    email: string;
}

declare module 'fastify' {
    interface FastifyRequest {
        user?: AuthUser;
    }
}

// export type FastifyAuthRequest<T extends RouteGenericInterface = RouteGenericInterface> = FastifyRequest<T> & {
//     user: AuthUser
// };

export type FastifyTypedInstance = FastifyInstance<
    RawServerDefault,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    FastifyBaseLogger,
    ZodTypeProvider
>;
