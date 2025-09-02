import { uuid, pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core"
import { user } from "./user"
import { v7 } from "uuid"

export const room = pgTable("room", {
    id: uuid("id")
        .unique()
        .primaryKey()
        .$defaultFn(() => v7()),
    name: text("name").notNull(),
    description: text("description"),
    type: text("type").notNull().$type<"direct" | "group">(),
    isPrivate: boolean("is_private").default(false),
    avatar: text("avatar"),
    ownerId: uuid("owner_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdateFn(() => new Date())
})
