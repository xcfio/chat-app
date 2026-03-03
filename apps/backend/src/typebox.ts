import { Type, TSchema, TSchemaOptions } from "typebox"
import { v7 } from "uuid"

// Utility for nullable fields (value | null) - matches PostgreSQL behavior
export const Nullable = <T extends TSchema>(schema: T, options?: TSchemaOptions) =>
    Type.Union([schema, Type.Null()], options)

export const UUID = Type.String({
    examples: [v7()],
    pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
    description: "UUID Version 7"
})
