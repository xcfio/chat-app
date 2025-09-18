// src/components/ui/MessageList.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import { Paper, Group, Avatar, Text, Stack, ActionIcon, Menu, ScrollArea, Loader, Badge } from "@mantine/core"
import { MoreHorizontal, Edit, Trash2, Check, CheckCheck } from "lucide-react"
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
                setMessageList((prev) => {
                    // Check if message already exists to avoid duplicates
                    const exists = prev.some((m) => m.id === message.id)
                    if (exists) return prev
                    return [...prev, message]
                })
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
                return <Check size={14} color="rgba(255,255,255,0.8)" />
            case "delivered":
                return <CheckCheck size={14} color="rgba(255,255,255,0.8)" />
            case "read":
                return <CheckCheck size={14} color="#22c55e" />
            default:
                return null
        }
    }

    if (loading) {
        return (
            <Paper h="100%" p="md" className="flex items-center justify-center bg-gray-900">
                <Loader color="blue" />
            </Paper>
        )
    }

    return (
        <Paper h="100%" style={{ backgroundColor: "#f8fafc" }}>
            <ScrollArea h="calc(100vh - 200px)" p="md" ref={scrollAreaRef}>
                <Stack gap="sm">
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
                                    style={{
                                        background: isOwn
                                            ? "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)"
                                            : "#ffffff",
                                        color: isOwn ? "white" : "#374151",
                                        borderRadius: "18px",
                                        borderBottomRightRadius: isOwn ? "4px" : "18px",
                                        borderBottomLeftRadius: isOwn ? "18px" : "4px",
                                        boxShadow: isOwn
                                            ? "0 4px 12px rgba(59, 130, 246, 0.2)"
                                            : "0 2px 8px rgba(0, 0, 0, 0.1)",
                                        border: isOwn ? "none" : "1px solid #e5e7eb"
                                    }}
                                >
                                    <Text size="sm" style={{ wordBreak: "break-word", lineHeight: 1.4 }}>
                                        {message.content}
                                    </Text>

                                    <Group justify="space-between" align="center" mt={6} gap="xs">
                                        <Text
                                            size="xs"
                                            style={{
                                                color: isOwn ? "rgba(255,255,255,0.8)" : "#6b7280",
                                                fontSize: "11px"
                                            }}
                                        >
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
                                                            style={{ color: "rgba(255,255,255,0.8)" }}
                                                        >
                                                            <MoreHorizontal size={12} />
                                                        </ActionIcon>
                                                    </Menu.Target>

                                                    <Menu.Dropdown
                                                        style={{
                                                            backgroundColor: "#ffffff",
                                                            border: "1px solid #e5e7eb",
                                                            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)"
                                                        }}
                                                    >
                                                        <Menu.Item
                                                            leftSection={<Edit size={14} />}
                                                            onClick={() => onEditMessage(message)}
                                                            style={{ color: "#374151" }}
                                                        >
                                                            Edit
                                                        </Menu.Item>
                                                        <Menu.Item
                                                            leftSection={<Trash2 size={14} />}
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
                            <Paper
                                p="sm"
                                style={{
                                    backgroundColor: "#ffffff",
                                    color: "#6b7280",
                                    borderRadius: "18px",
                                    borderBottomLeftRadius: "4px",
                                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                                    border: "1px solid #e5e7eb"
                                }}
                            >
                                <Text size="sm" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    {otherUser.name || otherUser.username} is typing
                                    <span style={{ display: "flex", gap: "2px" }}>
                                        <span
                                            style={{
                                                width: "4px",
                                                height: "4px",
                                                backgroundColor: "#9ca3af",
                                                borderRadius: "50%",
                                                animation: "bounce 1.4s infinite ease-in-out",
                                                animationDelay: "0s"
                                            }}
                                        ></span>
                                        <span
                                            style={{
                                                width: "4px",
                                                height: "4px",
                                                backgroundColor: "#9ca3af",
                                                borderRadius: "50%",
                                                animation: "bounce 1.4s infinite ease-in-out",
                                                animationDelay: "0.2s"
                                            }}
                                        ></span>
                                        <span
                                            style={{
                                                width: "4px",
                                                height: "4px",
                                                backgroundColor: "#9ca3af",
                                                borderRadius: "50%",
                                                animation: "bounce 1.4s infinite ease-in-out",
                                                animationDelay: "0.4s"
                                            }}
                                        ></span>
                                    </span>
                                </Text>
                            </Paper>
                        </Group>
                    )}
                </Stack>
            </ScrollArea>

            <style jsx>{`
                @keyframes bounce {
                    0%,
                    60%,
                    100% {
                        transform: translateY(0);
                    }
                    30% {
                        transform: translateY(-10px);
                    }
                }
            `}</style>
        </Paper>
    )
}
