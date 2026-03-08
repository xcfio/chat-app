"use client"

import { getSocket } from "./socket"

export function Catch(error: unknown) {
    console.error(error)

    const socket = getSocket()
    socket.connect()

    if (!socket.connected) socket.connect()
    socket.on("connect", () => {
        if (Error.isError(error)) {
            socket.emit("errors", { name: error.name, message: error.message, stack: error.stack })
        } else {
            socket.emit("errors", { name: "An unexpected error occurred", message: JSON.stringify(error) })
        }
    })
}
