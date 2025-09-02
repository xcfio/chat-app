import { uuid, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { user } from "./user"
import { v7 } from "uuid"
import { room } from "./room"

export const message = pgTable("message", {
    id: uuid("id")
        .unique()
        .primaryKey()
        .$defaultFn(() => v7()),
    content: text("content").notNull(),
    type: text("type").notNull().$type<"text" | "system">(),

    authorId: uuid("author_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    roomId: uuid("room_id")
        .notNull()
        .references(() => room.id, { onDelete: "cascade" }),

    replyToId: uuid("reply_to_id").references((() => message.id) as any, { onDelete: "set null" }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    editedAt: timestamp("edited_at")
})
