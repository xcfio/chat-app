"use client"

import { AuthenticatedUser, ErrorResponse, LoginUser, RegisterUser } from "schema"
import { Value } from "typebox/value"
import { Static } from "typebox"
import ky from "ky"

const api = ky.create({
    prefixUrl: process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:7200",
    credentials: "include",
    throwHttpErrors: false
})

export const ftc = {
    messages: {
        send: async () => {},
        read: async () => {},
        edit: async () => {},
        delete: async () => {}
    },
    login: async (obj: Static<typeof LoginUser>): Promise<Static<typeof AuthenticatedUser> | string> => {
        try {
            const data = await api.post("auth/login", { json: obj }).json<Static<typeof AuthenticatedUser>>()
            return Value.Check(ErrorResponse(500), data) ? data.message : data
        } catch (error) {
            console.log(error)
            return "An error occurred"
        }
    },
    register: async (obj: Static<typeof RegisterUser>): Promise<Static<typeof AuthenticatedUser> | string> => {
        try {
            const data = await api.post("auth/register", { json: obj }).json<Static<typeof AuthenticatedUser>>()
            return Value.Check(ErrorResponse(500), data) ? data.message : data
        } catch (error) {
            console.log(error)
            return "An error occurred"
        }
    }
} as const
