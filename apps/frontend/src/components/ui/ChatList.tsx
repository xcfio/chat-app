// src/components/ui/ChatList.tsx
"use client"

import { useState, useEffect } from "react"
import { Paper, Group, Avatar, Text, Stack, ActionIcon, ScrollArea, Badge, Menu } from "@mantine/core"
import { IconDots, IconTrash } from "@tabler/icons-react"
import { notifications } from "@mantine/notifications"
import { conversations, users } from "@/lib/api"
import { Conversation, User } from "@/lib/types"
import { useAuth } from "../providers/AuthProvider"

interface ChatListProps {
    selectedChatId?: string
    onChatSelect: (chatId: string) => void
    refreshTrigger?: number
}

interface ConversationWithUser extends Conversation {
    otherUser: User
    unreadCount?: number
}

export function ChatList({ selectedChatId, onChatSelect, refreshTrigger }: ChatListProps) {
    const [conv, setConversations] = useState<ConversationWithUser[]>([])
    const [loading, setLoading] = useState(true)
    const { user: currentUser } = useAuth()

    const loadConversations = async () => {
        if (!currentUser) return

        try {
            const response = await conversations.getAll()
            const conversationsData = response.data

            // Get other user data for each conversation
            const conversationsWithUsers = await Promise.all(
                conversationsData.map(async (conv) => {
                    const otherUserId = conv.p1 === currentUser.id ? conv.p2 : conv.p1
                    try {
                        const userResponse = await users.getById(otherUserId)
                        return {
                            ...conv,
                            otherUser: userResponse.data,
                            unreadCount: 0 // TODO: Implement unread count from API
                        }
                    } catch (error) {
                        console.error("Error loading user:", error)
                        return null
                    }
                })
            )

            setConversations(conversationsWithUsers.filter(Boolean) as ConversationWithUser[])
        } catch (error) {
            notifications.show({
                title: "Error",
                message: "Failed to load conversations",
                color: "red"
            })
        } finally {
            setLoading(false)
        }
    }

    const deleteConversation = async (conversationId: string) => {
        try {
            await conversations.delete(conversationId)
            setConversations((prev) => prev.filter((c) => c.id !== conversationId))
            notifications.show({
                title: "Success",
                message: "Conversation deleted",
                color: "green"
            })
        } catch (error) {
            notifications.show({
                title: "Error",
                message: "Failed to delete conversation",
                color: "red"
            })
        }
    }

    useEffect(() => {
        loadConversations()
    }, [currentUser, refreshTrigger])

    const formatTime = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diff = now.getTime() - date.getTime()
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))

        if (days === 0) {
            return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        } else if (days === 1) {
            return "Yesterday"
        } else if (days < 7) {
            return date.toLocaleDateString([], { weekday: "short" })
        } else {
            return date.toLocaleDateString([], { month: "short", day: "numeric" })
        }
    }

    return (
        <Paper h="100%" p="md">
            <ScrollArea h="calc(100vh - 140px)">
                <Stack gap="xs">
                    {conv.map((conversation) => (
                        <Paper
                            key={conversation.id}
                            p="sm"
                            withBorder
                            className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                                selectedChatId === conversation.id ? "bg-blue-50 border-blue-200" : ""
                            }`}
                            onClick={() => onChatSelect(conversation.id)}
                        >
                            <Group justify="space-between">
                                <Group flex={1}>
                                    <Avatar
                                        src={conversation.otherUser.avatar}
                                        alt={conversation.otherUser.name || conversation.otherUser.username}
                                        size="md"
                                    />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <Group justify="space-between" align="flex-start">
                                            <Text fw={500} truncate>
                                                {conversation.otherUser.name || conversation.otherUser.username}
                                            </Text>
                                            <Text size="xs" c="dimmed">
                                                {formatTime(conversation.updatedAt)}
                                            </Text>
                                        </Group>
                                        <Text size="sm" c="dimmed" truncate>
                                            Last message preview...
                                        </Text>
                                    </div>
                                    {conversation.unreadCount && conversation.unreadCount > 0 && (
                                        <Badge size="sm" color="blue">
                                            {conversation.unreadCount}
                                        </Badge>
                                    )}
                                </Group>

                                <Menu shadow="md" width={200}>
                                    <Menu.Target>
                                        <ActionIcon variant="subtle" size="sm" onClick={(e) => e.stopPropagation()}>
                                            <IconDots size={16} />
                                        </ActionIcon>
                                    </Menu.Target>

                                    <Menu.Dropdown>
                                        <Menu.Item
                                            leftSection={<IconTrash size={14} />}
                                            color="red"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                deleteConversation(conversation.id)
                                            }}
                                        >
                                            Delete conversation
                                        </Menu.Item>
                                    </Menu.Dropdown>
                                </Menu>
                            </Group>
                        </Paper>
                    ))}

                    {conv.length === 0 && !loading && (
                        <Text ta="center" c="dimmed" py="xl">
                            No conversations yet
                        </Text>
                    )}
                </Stack>
            </ScrollArea>
        </Paper>
    )
}
