"use client"

import { AuthenticatedUser, LoginUser, RegisterUser } from "schema"
import { Static } from "typebox"
import ky from "ky"

const api = ky.create({
    prefixUrl: process.env.NEXT_PUBLIC_API_ENDPOINT ?? "http://localhost:7200",
    credentials: "include"
})

export const ftc = {
    login: async (obj: Static<typeof LoginUser>): Promise<Static<typeof AuthenticatedUser> | string> => {
        console.log(obj)
        return ""
    },
    register: async (obj: Static<typeof RegisterUser>): Promise<Static<typeof AuthenticatedUser> | string> => {
        console.log(obj)
        return ""
    }
} as const
