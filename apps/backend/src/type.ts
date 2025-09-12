import { Type, Static } from "@sinclair/typebox"
import { Server } from "socket.io"
import { v7 } from "uuid"

declare module "fastify" {
    interface FastifyInstance {
        authenticate: (request: FastifyRequest, reply: FastifyReply) => void
        user: Static<typeof JWTPayloadSchema>
        io: Server
    }
}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: "development" | "production"
            DATABASE_URI: string
            COOKIE_SECRET: string
            JWT_SECRET: string

            GITHUB_CLIENT_ID: string
            GITHUB_CLIENT_SECRET: string

            GOOGLE_CLIENT_ID: string
            GOOGLE_CLIENT_SECRET: string
        }
    }
}

export function ErrorResponse(code: number, description?: string) {
    return Type.Object(
        {
            statusCode: Type.Number({
                examples: [code],
                description: "HTTP status code of the error"
            }),
            error: Type.String({
                description: "Error type or category"
            }),
            message: Type.String({
                description: "Human-readable error message"
            })
        },
        {
            $id: "ErrorResponse",
            description: description ?? "Standard error response format for API endpoints"
        }
    )
}
export const UserStatusSchema = Type.Union([Type.Literal("online"), Type.Literal("offline")])
export const MessageStatusSchema = Type.Union([Type.Literal("sent"), Type.Literal("delivered"), Type.Literal("read")])
export const OAuthProviderSchema = Type.Union([Type.Literal("github"), Type.Literal("google")])
const DateSchema = Type.Unsafe<Date>({ type: "object", instanceOf: "Date" })

export const JWTPayloadSchema = Type.Object({
    id: Type.String({ format: "uuid" }),
    email: Type.String({ format: "email" }),
    username: Type.String(),
    name: Type.Union([Type.String(), Type.Null()]),
    avatar: Type.Union([Type.String(), Type.Null()]),
    type: OAuthProviderSchema,
    token: Type.String(),
    iat: Type.Number(),
    exp: Type.Number()
})

export const UserSchema = Type.Object({
    id: Type.String({ format: "uuid" }),
    type: OAuthProviderSchema,
    token: Type.String(),
    email: Type.String({ format: "email" }),
    username: Type.String(),
    name: Type.Union([Type.String(), Type.Null()]),
    avatar: Type.Union([Type.String(), Type.Null()]),
    lastSeen: DateSchema,
    createdAt: DateSchema
})

export const ReplyUserSchema = Type.Object(
    {
        id: Type.String({
            examples: [v7()],
            format: "uuid",
            description: "Unique identifier for the user"
        }),
        email: Type.String({
            format: "email",
            description: "User's email address"
        }),
        username: Type.String({
            description: "Unique username for the user account"
        }),
        name: Type.Union(
            [
                Type.String({
                    description: "User's display name if it exists"
                }),
                Type.Null({
                    description: "Null if no display name is set"
                })
            ],
            {
                description: "User's display name (optional)"
            }
        ),
        avatar: Type.Union(
            [
                Type.String({
                    description: "URL to the user's avatar image if it exists"
                }),
                Type.Null({
                    description: "Null if no avatar is set"
                })
            ],
            {
                description: "User's avatar image (optional)"
            }
        ),
        createdAt: Type.String({
            format: "date-time",
            description: "ISO timestamp of when user account was created"
        })
    },
    {
        description: "User profile information"
    }
)

export const MessageSchema = Type.Object({
    id: Type.String({ format: "uuid" }),
    content: Type.String(),
    status: MessageStatusSchema,
    createdAt: DateSchema,
    sender: Type.String(),
    receiver: Type.String()
})

export const ConversationSchema = Type.Object({
    id: Type.String({ format: "uuid" }),
    participants: Type.Tuple([Type.String(), Type.String()]),
    lastMessage: Type.Optional(Type.String()),
    updatedAt: DateSchema
})

export const ServerToClientEventsSchema = Type.Object({
    new_message: Type.Function([MessageSchema], Type.Void()),
    message_read: Type.Function([Type.String()], Type.Void()),
    user_status_changed: Type.Function([Type.String(), UserStatusSchema], Type.Void()),
    user_typing: Type.Function([Type.String(), Type.Boolean()], Type.Void()),
    error: Type.Function(
        [
            Type.Object({
                message: Type.String(),
                code: Type.String()
            })
        ],
        Type.Void()
    )
})

export const ClientToServerEventsSchema = Type.Object({
    send_message: Type.Function([Type.String(), Type.String()], Type.Void()),
    mark_message_read: Type.Function([Type.String()], Type.Void()),
    update_status: Type.Function([UserStatusSchema], Type.Void()),
    start_typing: Type.Function([Type.String()], Type.Void()),
    stop_typing: Type.Function([Type.String()], Type.Void())
})

export type UserStatus = Static<typeof UserStatusSchema>
export type MessageStatus = Static<typeof MessageStatusSchema>
export type OAuthProvider = Static<typeof OAuthProviderSchema>
export type JWTPayload = Static<typeof JWTPayloadSchema>
export type User = Static<typeof UserSchema>
export type Message = Static<typeof MessageSchema>
export type Conversation = Static<typeof ConversationSchema>
export type ServerToClientEvents = Static<typeof ServerToClientEventsSchema>
export type ClientToServerEvents = Static<typeof ClientToServerEventsSchema>
