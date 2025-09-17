// src/components/ui/MessageInput.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import { TextInput, ActionIcon, Group, Paper, Button } from "@mantine/core"
import { IconSend, IconX } from "@tabler/icons-react"
import { notifications } from "@mantine/notifications"
import { messages } from "@/lib/api"
import { Message } from "@/lib/types"
import { useSocket } from "../providers/SocketProvider"

interface MessageInputProps {
    conversationId: string
    editingMessage?: Message | null
    onCancelEdit: () => void
}

export function MessageInput({ conversationId, editingMessage, onCancelEdit }: MessageInputProps) {
    const [message, setMessage] = useState("")
    const [sending, setSending] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const { socket, startTyping, stopTyping } = useSocket()
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        if (editingMessage) {
            setMessage(editingMessage.content)
            inputRef.current?.focus()
        } else {
            setMessage("")
        }
    }, [editingMessage])

    const handleTyping = () => {
        startTyping(conversationId)

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }

        typingTimeoutRef.current = setTimeout(() => {
            stopTyping(conversationId)
        }, 1000)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!message.trim()) return

        setSending(true)
        stopTyping(conversationId)

        try {
            if (editingMessage) {
                await messages.edit(editingMessage.id, message.trim())
                onCancelEdit()
                notifications.show({
                    title: "Success",
                    message: "Message edited",
                    color: "green"
                })
            } else {
                await messages.send(conversationId, message.trim())
            }
            setMessage("")
        } catch (error) {
            notifications.show({
                title: "Error",
                message: editingMessage ? "Failed to edit message" : "Failed to send message",
                color: "red"
            })
        } finally {
            setSending(false)
        }
    }

    return (
        <Paper p="md" shadow="sm">
            {editingMessage && (
                <Group mb="sm" justify="space-between">
                    <span className="text-sm text-gray-600">Editing message</span>
                    <ActionIcon variant="subtle" size="sm" onClick={onCancelEdit}>
                        <IconX size={16} />
                    </ActionIcon>
                </Group>
            )}

            <form onSubmit={handleSubmit}>
                <Group gap="sm">
                    <TextInput
                        ref={inputRef}
                        flex={1}
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => {
                            setMessage(e.currentTarget.value)
                            if (e.currentTarget.value) {
                                handleTyping()
                            } else {
                                stopTyping(conversationId)
                            }
                        }}
                        maxLength={2000}
                        disabled={sending}
                        onBlur={() => stopTyping(conversationId)}
                    />
                    <ActionIcon
                        type="submit"
                        size="lg"
                        variant="filled"
                        disabled={!message.trim() || sending}
                        loading={sending}
                    >
                        <IconSend size={18} />
                    </ActionIcon>
                </Group>
            </form>
        </Paper>
    )
}
