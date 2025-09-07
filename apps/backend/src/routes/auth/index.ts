import { main } from "../../"
import AuthGithub from "./github"
import AuthGoogle from "./google"

export default function OAuth2(fastify: Awaited<ReturnType<typeof main>>) {
    AuthGithub(fastify)
    AuthGoogle(fastify)
}
