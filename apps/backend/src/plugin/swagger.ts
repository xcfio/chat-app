import SwaggerUI from "@fastify/swagger-ui"
import Swagger from "@fastify/swagger"
import { bugs, license } from "../../package.json"
import { SCSS } from "../function/css"
import { main } from "../"

export default async function swagger(fastify: Awaited<ReturnType<typeof main>>) {
    await fastify.register(Swagger, {
        hideUntagged: true,
        openapi: {
            openapi: "3.1.0",
            info: {
                title: "Chat App API",
                description:
                    "RESTful API for real-time chat application with user authentication and message management",
                version: "1.0.0",
                license: {
                    name: license,
                    url: "https://opensource.org/licenses/MIT"
                },
                contact: {
                    email: bugs.url,
                    name: "Support Team",
                    url: "https://discord.com/invite/FaCCaFM74Q"
                },
                termsOfService: "/terms"
            },
            tags: [
                {
                    name: "Authentication",
                    description: "OAuth authentication and session management endpoints"
                },
                {
                    name: "Users",
                    description: "User profile management and discovery endpoints"
                },
                {
                    name: "Conversations",
                    description: "Direct conversation management endpoints"
                },
                {
                    name: "Messages",
                    description: "Message operations and status management endpoints"
                },
                {
                    name: "Search",
                    description: "Search functionality for users and messages"
                },
                {
                    name: "Health",
                    description: "System health and status endpoints"
                }
            ]
        }
    })

    await fastify.register(SwaggerUI, {
        routePrefix: "/",
        staticCSP: true,
        transformSpecificationClone: true,
        uiConfig: {
            defaultModelRendering: "example",
            docExpansion: "list",
            displayRequestDuration: true,
            showCommonExtensions: false,
            displayOperationId: false,
            tryItOutEnabled: false,
            showExtensions: false,
            deepLinking: false,
            filter: true,
            defaultModelsExpandDepth: 1,
            defaultModelExpandDepth: 1,
            supportedSubmitMethods: []
        },
        theme: {
            title: "Chat App API Documentation",
            css: [
                {
                    filename: "custom.css",
                    content: SCSS
                }
            ]
        },
        logo: {
            type: "image/svg+xml",
            href: "https://github.com/xcfio/chat-app",
            target: "_blank",
            content: await (
                await fetch(
                    "https://raw.githubusercontent.com/xcfio/chat-app/refs/heads/main/apps/frontend/public/favicon.svg"
                )
            ).text()
        }
    })
}
