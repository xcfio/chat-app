// src/components/ui/ChatWindow.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import {
    Paper,
    Group,
    Avatar,
    Text,
    ActionIcon,
    Divider,
    Stack,
    ScrollArea,
    Loader,
    TextInput,
    Menu
} from "@mantine/core"
import { Phone, Video, MoreHorizontal, Send, X, Edit, Trash2, Check, CheckCheck } from "lucide-react"
import { notifications } from "@mantine/notifications"
import { users, messages } from "@/lib/api"
import { User, Message } from "@/lib/types"
import { useAuth } from "../providers/AuthProvider"
import { useSocket } from "../providers/SocketProvider"

interface ChatWindowProps {
    conversationId: string
    otherUserId: string
}

export function ChatWindow({ conversationId, otherUserId }: ChatWindowProps) {
    // Chat window state
    const [otherUser, setOtherUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    // Message list state
    const [messageList, setMessageList] = useState<Message[]>([])
    const [messagesLoading, setMessagesLoading] = useState(true)
    const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())

    // Message input state
    const [message, setMessage] = useState("")
    const [sending, setSending] = useState(false)
    const [editingMessage, setEditingMessage] = useState<Message | null>(null)

    // Refs and hooks
    const { user: currentUser } = useAuth()
    const { socket, startTyping, stopTyping } = useSocket()
    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Load other user data
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

    // Load messages
    const loadMessages = async () => {
        try {
            const response = await messages.getByConversation(conversationId)
            setMessageList(response.data.reverse())
            scrollToBottom()
        } catch (error) {
            notifications.show({
                title: "Error",
                message: "Failed to load messages",
                color: "red"
            })
        } finally {
            setMessagesLoading(false)
        }
    }

    // Delete message
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

    // Scroll to bottom
    const scrollToBottom = () => {
        setTimeout(() => {
            scrollAreaRef.current?.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: "smooth"
            })
        }, 100)
    }

    // Handle typing indicator
    const handleTyping = () => {
        startTyping(conversationId)

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }

        typingTimeoutRef.current = setTimeout(() => {
            stopTyping(conversationId)
        }, 1000)
    }

    // Handle message submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!message.trim()) return

        setSending(true)
        stopTyping(conversationId)

        try {
            if (editingMessage) {
                const {
                    data: { data }
                } = await messages.edit(editingMessage.id, message.trim())
                setMessageList((list) => list.map((msg) => (msg.id === data.id ? { ...msg, ...data } : msg)))
                setEditingMessage(null)

                notifications.show({
                    title: "Success",
                    message: "Message edited",
                    color: "green"
                })
            } else {
                const response = await messages.send(conversationId, message.trim())
                setMessageList(() => [...messageList, response.data])
                console.log(response.data)
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

    // Format time
    const formatTime = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }

    // Get message status icon
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

    // Handle edit message
    const handleEditMessage = (msg: Message) => {
        setEditingMessage(msg)
        setMessage(msg.content)
        inputRef.current?.focus()
    }

    // Cancel edit
    const handleCancelEdit = () => {
        setEditingMessage(null)
        setMessage("")
    }

    // Load data on mount
    useEffect(() => {
        if (otherUserId) {
            loadOtherUser()
        }
    }, [otherUserId])

    useEffect(() => {
        if (conversationId) {
            setMessagesLoading(true)
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
                            <Phone size={20} />
                        </ActionIcon>
                        <ActionIcon variant="subtle" size="lg">
                            <Video size={20} />
                        </ActionIcon>
                        <ActionIcon variant="subtle" size="lg">
                            <MoreHorizontal size={20} />
                        </ActionIcon>
                    </Group>
                </Group>
            </Paper>

            {/* Messages */}
            <Paper h="100%" style={{ backgroundColor: "#f8fafc", flex: 1 }}>
                {messagesLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader color="blue" />
                    </div>
                ) : (
                    <ScrollArea h="calc(100vh - 200px)" p="md" ref={scrollAreaRef}>
                        <Stack gap="sm">
                            {messageList.map((msg) => {
                                const isOwn = msg.sender === currentUser?.id
                                const showAvatar = !isOwn

                                return (
                                    <Group
                                        key={msg.id}
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
                                                {msg.content}
                                            </Text>

                                            <Group justify="space-between" align="center" mt={6} gap="xs">
                                                <Text
                                                    size="xs"
                                                    style={{
                                                        color: isOwn ? "rgba(255,255,255,0.8)" : "#6b7280",
                                                        fontSize: "11px"
                                                    }}
                                                >
                                                    {formatTime(msg.createdAt)}
                                                    {msg.editedAt && " (edited)"}
                                                </Text>

                                                <Group gap={4} align="center">
                                                    {isOwn && getMessageStatus(msg)}

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
                                                                    onClick={() => handleEditMessage(msg)}
                                                                    style={{ color: "#374151" }}
                                                                >
                                                                    Edit
                                                                </Menu.Item>
                                                                <Menu.Item
                                                                    leftSection={<Trash2 size={14} />}
                                                                    color="red"
                                                                    onClick={() => deleteMessage(msg.id)}
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
                                    <Avatar
                                        src={otherUser.avatar}
                                        alt={otherUser.name || otherUser.username}
                                        size="sm"
                                    />
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
                )}
            </Paper>

            {/* Message Input */}
            <Paper p="md" shadow="sm">
                {editingMessage && (
                    <Group mb="sm" justify="space-between">
                        <span className="text-sm text-gray-600">Editing message</span>
                        <ActionIcon variant="subtle" size="sm" onClick={handleCancelEdit}>
                            <X size={16} />
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
                            <Send size={18} />
                        </ActionIcon>
                    </Group>
                </form>
            </Paper>

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
        </Stack>
    )
}
