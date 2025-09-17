// src/components/providers/SocketProvider.tsx
"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"
import { ServerToClientEvents, ClientToServerEvents, Message, UserStatus } from "@/lib/types"
import { useAuth } from "./AuthProvider"

interface SocketContextType {
    socket: Socket<ServerToClientEvents, ClientToServerEvents> | null
    connected: boolean
    updateStatus: (status: UserStatus) => void
    startTyping: (chatId: string) => void
    stopTyping: (chatId: string) => void
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

export function SocketProvider({ children }: { children: React.ReactNode }) {
    const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null)
    const [connected, setConnected] = useState(false)
    const { user } = useAuth()

    useEffect(() => {
        if (user) {
            const socketIO = io(process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3001", {
                withCredentials: true,
                transports: ["websocket"]
            })

            socketIO.on("connect", () => {
                console.log("Socket connected")
                setConnected(true)
                socketIO.emit("update_status", "online")
            })

            socketIO.on("disconnect", () => {
                console.log("Socket disconnected")
                setConnected(false)
            })

            setSocket(socketIO)

            return () => {
                socketIO.emit("update_status", "offline")
                socketIO.close()
            }
        }
    }, [user])

    const updateStatus = (status: UserStatus) => {
        socket?.emit("update_status", status)
    }

    const startTyping = (chatId: string) => {
        socket?.emit("typing", chatId, true)
    }

    const stopTyping = (chatId: string) => {
        socket?.emit("typing", chatId, false)
    }

    useEffect(() => {
        const handleBeforeUnload = () => {
            socket?.emit("update_status", "offline")
        }

        window.addEventListener("beforeunload", handleBeforeUnload)
        return () => window.removeEventListener("beforeunload", handleBeforeUnload)
    }, [socket])

    return (
        <SocketContext.Provider value={{ socket, connected, updateStatus, startTyping, stopTyping }}>
            {children}
        </SocketContext.Provider>
    )
}

export function useSocket() {
    const context = useContext(SocketContext)
    if (context === undefined) {
        throw new Error("useSocket must be used within a SocketProvider")
    }
    return context
}
