import { uuid, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { user } from "./user"
import { room } from "./room"
import { v7 } from "uuid"

export const member = pgTable("members", {
    id: uuid("id")
        .unique()
        .primaryKey()
        .$defaultFn(() => v7()),
    userId: uuid("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    roomId: uuid("room_id")
        .notNull()
        .references(() => room.id, { onDelete: "cascade" }),
    role: text("role").notNull().$type<"owner" | "admin" | "member">(),
    joinedAt: timestamp("joined_at").defaultNow().notNull()
})
