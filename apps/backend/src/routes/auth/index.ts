import { main } from "../../"
import Register from "./register"
import Login from "./login"
import Logout from "./logout"

export default function Auth(fastify: Awaited<ReturnType<typeof main>>) {
    Register(fastify)
    Login(fastify)
    Logout(fastify)
}
