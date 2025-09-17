// src/components/ui/MessageList.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import { Paper, Group, Avatar, Text, Stack, ActionIcon, Menu, ScrollArea, Loader, Badge } from "@mantine/core"
import { IconDots, IconEdit, IconTrash, IconCheck, IconChecks } from "@tabler/icons-react"
import { notifications } from "@mantine/notifications"
import { messages } from "@/lib/api"
import { Message, User } from "@/lib/types"
import { useAuth } from "../providers/AuthProvider"
import { useSocket } from "../providers/SocketProvider"

interface MessageListProps {
    conversationId: string
    otherUser: User
    onEditMessage: (message: Message) => void
}

export function MessageList({ conversationId, otherUser, onEditMessage }: MessageListProps) {
    const [messageList, setMessageList] = useState<Message[]>([])
    const [loading, setLoading] = useState(true)
    const { user: currentUser } = useAuth()
    const { socket } = useSocket()
    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())

    const loadMessages = async () => {
        try {
            const response = await messages.getByConversation(conversationId)
            setMessageList(response.data.reverse()) // Reverse to show newest at bottom
            scrollToBottom()
        } catch (error) {
            notifications.show({
                title: "Error",
                message: "Failed to load messages",
                color: "red"
            })
        } finally {
            setLoading(false)
        }
    }

    const deleteMessage = async (messageId: string) => {
        try {
            await messages.delete(messageId)
            setMessageList((prev) => prev.filter((m) => m.id !== messageId))
            notifications.show({
                title: "Success",
                message: "Message deleted",
                color: "green"
            })
        } catch (error) {
            notifications.show({
                title: "Error",
                message: "Failed to delete message",
                color: "red"
            })
        }
    }

    const scrollToBottom = () => {
        setTimeout(() => {
            scrollAreaRef.current?.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: "smooth"
            })
        }, 100)
    }

    useEffect(() => {
        if (conversationId) {
            setLoading(true)
            loadMessages()
        }
    }, [conversationId])

    // Socket event listeners
    useEffect(() => {
        if (!socket) return

        const handleNewMessage = (message: Message) => {
            if (message.conversation === conversationId) {
                setMessageList((prev) => [...prev, message])
                scrollToBottom()
            }
        }

        const handleMessageDeleted = ({
            messageId,
            conversationId: msgConvId
        }: {
            messageId: string
            conversationId: string
        }) => {
            if (msgConvId === conversationId) {
                setMessageList((prev) => prev.filter((m) => m.id !== messageId))
            }
        }

        const handleMessageEdited = ({
            messageId,
            content,
            editedAt,
            conversationId: msgConvId
        }: {
            messageId: string
            content: string
            editedAt: string
            conversationId: string
        }) => {
            if (msgConvId === conversationId) {
                setMessageList((prev) => prev.map((m) => (m.id === messageId ? { ...m, content, editedAt } : m)))
            }
        }

        const handleUserTyping = (userId: string, isTyping: boolean) => {
            if (userId !== currentUser?.id) {
                setTypingUsers((prev) => {
                    const newSet = new Set(prev)
                    if (isTyping) {
                        newSet.add(userId)
                    } else {
                        newSet.delete(userId)
                    }
                    return newSet
                })
            }
        }

        socket.on("new_message", handleNewMessage)
        socket.on("message_deleted", handleMessageDeleted)
        socket.on("message_edited", handleMessageEdited)
        socket.on("user_typing", handleUserTyping)

        return () => {
            socket.off("new_message", handleNewMessage)
            socket.off("message_deleted", handleMessageDeleted)
            socket.off("message_edited", handleMessageEdited)
            socket.off("user_typing", handleUserTyping)
        }
    }, [socket, conversationId, currentUser])

    const formatTime = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }

    const getMessageStatus = (message: Message) => {
        switch (message.status) {
            case "sent":
                return <IconCheck size={14} color="gray" />
            case "delivered":
                return <IconChecks size={14} color="gray" />
            case "read":
                return <IconChecks size={14} color="blue" />
            default:
                return null
        }
    }

    if (loading) {
        return (
            <Paper h="100%" p="md" className="flex items-center justify-center">
                <Loader />
            </Paper>
        )
    }

    return (
        <Paper h="100%">
            <ScrollArea h="calc(100vh - 200px)" p="md" ref={scrollAreaRef}>
                <Stack gap="md">
                    {messageList.map((message) => {
                        const isOwn = message.sender === currentUser?.id
                        const showAvatar = !isOwn

                        return (
                            <Group
                                key={message.id}
                                align="flex-start"
                                justify={isOwn ? "flex-end" : "flex-start"}
                                gap="sm"
                            >
                                {showAvatar && (
                                    <Avatar
                                        src={otherUser.avatar}
                                        alt={otherUser.name || otherUser.username}
                                        size="sm"
                                        mt={4}
                                    />
                                )}

                                <Paper
                                    p="sm"
                                    maw="70%"
                                    className={`${
                                        isOwn ? "bg-blue-500 text-white" : "bg-gray-100 border border-gray-200"
                                    }`}
                                    style={{
                                        borderRadius: isOwn ? "16px 4px 16px 16px" : "4px 16px 16px 16px"
                                    }}
                                >
                                    <Text size="sm" style={{ wordBreak: "break-word" }}>
                                        {message.content}
                                    </Text>

                                    <Group justify="space-between" align="center" mt={4} gap="xs">
                                        <Text size="xs" c={isOwn ? "gray.2" : "dimmed"}>
                                            {formatTime(message.createdAt)}
                                            {message.editedAt && " (edited)"}
                                        </Text>

                                        <Group gap={4} align="center">
                                            {isOwn && getMessageStatus(message)}

                                            {isOwn && (
                                                <Menu shadow="md" width={120}>
                                                    <Menu.Target>
                                                        <ActionIcon
                                                            variant="subtle"
                                                            size="xs"
                                                            c={isOwn ? "white" : "gray"}
                                                        >
                                                            <IconDots size={12} />
                                                        </ActionIcon>
                                                    </Menu.Target>

                                                    <Menu.Dropdown>
                                                        <Menu.Item
                                                            leftSection={<IconEdit size={14} />}
                                                            onClick={() => onEditMessage(message)}
                                                        >
                                                            Edit
                                                        </Menu.Item>
                                                        <Menu.Item
                                                            leftSection={<IconTrash size={14} />}
                                                            color="red"
                                                            onClick={() => deleteMessage(message.id)}
                                                        >
                                                            Delete
                                                        </Menu.Item>
                                                    </Menu.Dropdown>
                                                </Menu>
                                            )}
                                        </Group>
                                    </Group>
                                </Paper>
                            </Group>
                        )
                    })}

                    {typingUsers.size > 0 && (
                        <Group align="flex-start" gap="sm">
                            <Avatar src={otherUser.avatar} alt={otherUser.name || otherUser.username} size="sm" />
                            <Paper p="sm" bg="gray.1" style={{ borderRadius: "4px 16px 16px 16px" }}>
                                <Text size="sm" c="dimmed">
                                    {otherUser.name || otherUser.username} is typing...
                                </Text>
                            </Paper>
                        </Group>
                    )}
                </Stack>
            </ScrollArea>
        </Paper>
    )
}
