import { createHmac } from "node:crypto"

export function HmacPassword(password: string): string {
    return createHmac("sha256", process.env.HMAC_SECRET).update(password).digest("hex")
}
