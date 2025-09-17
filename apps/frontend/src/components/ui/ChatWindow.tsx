// src/components/ui/ChatWindow.tsx
"use client"

import { useState, useEffect } from "react"
import { Paper, Group, Avatar, Text, ActionIcon, Divider, Stack } from "@mantine/core"
import { IconPhone, IconVideo, IconDots } from "@tabler/icons-react"
import { users } from "@/lib/api"
import { User, Message } from "@/lib/types"
import { MessageList } from "./MessageList"
import { MessageInput } from "./MessageInput"

interface ChatWindowProps {
    conversationId: string
    otherUserId: string
}

export function ChatWindow({ conversationId, otherUserId }: ChatWindowProps) {
    const [otherUser, setOtherUser] = useState<User | null>(null)
    const [editingMessage, setEditingMessage] = useState<Message | null>(null)
    const [loading, setLoading] = useState(true)

    const loadOtherUser = async () => {
        try {
            const response = await users.getById(otherUserId)
            setOtherUser(response.data)
        } catch (error) {
            console.error("Error loading user:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (otherUserId) {
            loadOtherUser()
        }
    }, [otherUserId])

    if (loading || !otherUser) {
        return (
            <Paper h="100%" className="flex items-center justify-center">
                <Text c="dimmed">Loading...</Text>
            </Paper>
        )
    }

    return (
        <Stack h="100%" gap={0}>
            {/* Chat Header */}
            <Paper p="md" shadow="sm" style={{ borderBottom: "1px solid #e9ecef" }}>
                <Group justify="space-between">
                    <Group>
                        <Avatar src={otherUser.avatar} alt={otherUser.name || otherUser.username} size="md" />
                        <div>
                            <Text fw={600}>{otherUser.name || otherUser.username}</Text>
                            <Text size="sm" c="dimmed">
                                @{otherUser.username}
                            </Text>
                        </div>
                    </Group>

                    <Group gap="xs">
                        <ActionIcon variant="subtle" size="lg">
                            <IconPhone size={20} />
                        </ActionIcon>
                        <ActionIcon variant="subtle" size="lg">
                            <IconVideo size={20} />
                        </ActionIcon>
                        <ActionIcon variant="subtle" size="lg">
                            <IconDots size={20} />
                        </ActionIcon>
                    </Group>
                </Group>
            </Paper>

            {/* Messages */}
            <div style={{ flex: 1 }}>
                <MessageList conversationId={conversationId} otherUser={otherUser} onEditMessage={setEditingMessage} />
            </div>

            {/* Message Input */}
            <MessageInput
                conversationId={conversationId}
                editingMessage={editingMessage}
                onCancelEdit={() => setEditingMessage(null)}
            />
        </Stack>
    )
}
