import { Static, Type } from "typebox"

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: "development" | "production" | "test"
            DATABASE_URI: string
        }
    }
}

export type Payload = Static<typeof Payload>
export const Payload = Type.Object({
    iat: Type.Number(),
    exp: Type.Number()
})

export function ErrorResponse(code: number, description?: string) {
    return Type.Object(
        {
            statusCode: Type.Integer({ examples: [code], description: "HTTP status code of the error" }),
            error: Type.String({ description: "Error type or category" }),
            message: Type.String({ description: "Human-readable error message" })
        },
        {
            $id: "ErrorResponse",
            description: description ?? "Standard error response format for API endpoints"
        }
    )
}
