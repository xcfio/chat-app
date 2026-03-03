import SwaggerUI from "@fastify/swagger-ui"
import { FastifySwaggerUiOptions } from "@fastify/swagger-ui"
import { SCSS } from "../function"
import { main } from "../"

export default async function swagger_ui(fastify: Awaited<ReturnType<typeof main>>) {
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
            title: "API Documentation",
            css: [
                {
                    filename: "custom.css",
                    content: SCSS
                }
            ]
        }
    })
}
