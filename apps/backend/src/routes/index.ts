import Conversation from "./conversation"
import Discovery from "./discovery"
import Message from "./message"
import Auth from "./auth"
import { main } from "../"

export default function Routes(fastify: Awaited<ReturnType<typeof main>>) {
    Conversation(fastify)
    Discovery(fastify)
    Message(fastify)
    Auth(fastify)
}
