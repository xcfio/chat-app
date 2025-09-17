// src/components/providers/AuthProvider.tsx
"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { User } from "@/lib/types"
import { auth } from "@/lib/api"

interface AuthContextType {
    user: User | null
    loading: boolean
    login: (provider: "github" | "google") => void
    logout: () => Promise<void>
    refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    const checkAuth = async () => {
        try {
            const response = await auth.me()
            setUser(response.data)
        } catch (error) {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    const login = (provider: "github" | "google") => {
        const url = provider === "github" ? auth.githubLogin() : auth.googleLogin()
        window.location.href = url
    }

    const logout = async () => {
        try {
            await auth.logout()
            setUser(null)
        } catch (error) {
            console.error("Logout error:", error)
        }
    }

    const refreshUser = async () => {
        try {
            const response = await auth.refresh()
            setUser(response.data)
        } catch (error) {
            setUser(null)
        }
    }

    useEffect(() => {
        checkAuth()
    }, [])

    return <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
