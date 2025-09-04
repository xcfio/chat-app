import { main } from "../../"
import AuthDiscord from "./discord"
import AuthGithub from "./github"
import AuthGoogle from "./google"

export default function OAuth2(fastify: Awaited<ReturnType<typeof main>>) {
    AuthDiscord(fastify)
    AuthGithub(fastify)
    AuthGoogle(fastify)
}
