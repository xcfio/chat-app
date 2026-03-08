"use client"

import { getSocket } from "./socket"

export function Catch(error: unknown) {
    console.log(error)

    const socket = getSocket()
    const payload = Error.isError(error)
        ? { name: error.name, message: error.message, stack: error.stack }
        : { name: "An unexpected error occurred", message: JSON.stringify(error) }

    const send = () => {
        if (Error.isError(error)) {
            socket.emit("errors", payload)
        } else {
            socket.emit("errors", payload)
        }

        setTimeout(() => socket.disconnect(), 250)
    }

    if (socket.connected) {
        send()
        return
    }

    socket.once("connect", send)
    socket.connect()
}
