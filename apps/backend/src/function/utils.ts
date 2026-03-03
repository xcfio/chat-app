type Serialized<T> = {
    [K in keyof T]: T[K] extends Date
        ? string
        : T[K] extends Date | null
          ? string | null
          : T[K] extends (infer U)[]
            ? U extends Date
                ? string[]
                : Serialized<U>[]
            : T[K] extends object
              ? Serialized<T[K]>
              : T[K]
}

/**
 * Converts a database object to TypeBox-compatible format
 * Handles Date objects, null values, and arrays
 */
export function toTypeBox<T extends Record<string, unknown>>(arg: T): Serialized<T> {
    if (!arg || typeof arg !== "object") return arg as Serialized<T>

    const result = {} as Record<string, unknown>

    for (const [key, value] of Object.entries(arg)) {
        if (value === null || value === undefined) {
            result[key] = null
        } else if (value instanceof Date) {
            result[key] = value.toISOString()
        } else if (Array.isArray(value)) {
            result[key] = value.map((item) => (item instanceof Date ? item.toISOString() : item))
        } else if (typeof value === "object" && !(value instanceof Date)) {
            result[key] = toTypeBox(value as Record<string, unknown>)
        } else {
            result[key] = value
        }
    }

    return result as Serialized<T>
}
