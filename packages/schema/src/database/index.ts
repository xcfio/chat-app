import { ConversationInsert, conversations, ConversationSelect, ConversationUpdate } from "./conversations"
import { MessageInsert, messages, MessageSelect, MessageUpdate } from "./messages"
import { UserInsert, users, UserSelect, UserUpdate } from "./users"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

export const db = drizzle({ client: postgres(process.env.DATABASE_URI) })

export const table = {
    conversations,
    messages,
    users
} as const

export const Schema = {
    ConversationInsert,
    ConversationSelect,
    ConversationUpdate,

    MessageInsert,
    MessageSelect,
    MessageUpdate,

    UserInsert,
    UserSelect,
    UserUpdate
} as const
