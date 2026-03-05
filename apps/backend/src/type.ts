declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: "development" | "production" | "test"
            DATABASE_URI: string

            COOKIE_SECRET: string
            JWT_SECRET: string
            HMAC_SECRET: string
        }
    }
}
