import { uuid, pgTable, timestamp } from "drizzle-orm/pg-core"
import { v7 } from "uuid"

export const users = pgTable("users", {
    id: uuid("id")
        .primaryKey()
        .$defaultFn(() => v7()),
    createdAt: timestamp("created_at", { withTimezone: false })
        .notNull()
        .$defaultFn(() => new Date()),
    updatedAt: timestamp("updated_at", { withTimezone: false })
        .notNull()
        .$onUpdateFn(() => new Date())
})
