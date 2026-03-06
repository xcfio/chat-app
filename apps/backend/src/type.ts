import { AuthenticatedSocket, Payload } from "schema"

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: "development" | "production" | "test"
            DATABASE_URI: string

            COOKIE_SECRET: string
            JWT_SECRET: string
            HMAC_SECRET: string
        }
    }
}

declare module "fastify" {
    interface FastifyInstance {
        auth: (request: FastifyRequest, reply: FastifyReply) => void
        io: AuthenticatedSocket
    }
    interface FastifyRequest {
        payload: Payload
    }
}
