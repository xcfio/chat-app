import { createHmac } from "node:crypto"

export function HmacPassword(password: string): string {
    return createHmac("sha512", process.env.HMAC_SECRET).update(password).digest("hex")
}
