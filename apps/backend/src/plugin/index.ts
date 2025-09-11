import { main } from "../"
import cookie from "./cookie"
import cors from "./cors"
import jwt from "./jwt"
import rl from "./rate-limit"
import socket from "./socket-io"
import swagger from "./swagger"

export default async function Plugin(fastify: Awaited<ReturnType<typeof main>>) {
    await rl(fastify)
    await swagger(fastify)
    await socket(fastify)
    await cookie(fastify)
    await jwt(fastify)
    await cors(fastify)
}
