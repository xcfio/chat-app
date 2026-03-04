import { main } from "../../"
import Register from "./register"
import Login from "./login"

export default function Auth(fastify: Awaited<ReturnType<typeof main>>) {
    Register(fastify)
    Login(fastify)
}
