import { uuid, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { MessageStatus } from "../type"
import { Static } from "@sinclair/typebox"
import { user } from "./user"
import { v7 } from "uuid"

export const message = pgTable("message", {
    id: uuid("id")
        .unique()
        .primaryKey()
        .$defaultFn(() => v7()),
    content: text("content").notNull(),
    sender: uuid("sender_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    receiver: uuid("receiver_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    status: text("status").notNull().default("sent").$type<Static<typeof MessageStatus>>(),
    createdAt: timestamp("created_at", { withTimezone: false }).notNull().defaultNow(),
    editedAt: timestamp("edited_at", { withTimezone: false }).$onUpdateFn(() => new Date())
})
