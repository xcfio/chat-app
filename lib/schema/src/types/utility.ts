import { TSchema, TSchemaOptions, Type } from "typebox"
import { v7 } from "uuid"

export const Nullable = <T extends TSchema>(schema: T, options?: TSchemaOptions) => {
    return Type.Union([schema, Type.Null()], options)
}

export const UUID = Type.String({
    examples: [v7()],
    pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
})

export const Date = Type.String({ format: "date-time" })
