// src/app/chat/[id]/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import {
    Container,
    Grid,
    Paper,
    Group,
    Avatar,
    Text,
    ActionIcon,
    Menu,
    Stack,
    ScrollArea,
    Badge,
    TextInput,
    Modal,
    Button
} from "@mantine/core"
import { LogOut, Settings, Plus, MoreHorizontal, Trash2, Search, X } from "lucide-react"
import { useDebouncedState, useDisclosure } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import { useAuth } from "@/components/providers/AuthProvider"
import { ChatWindow } from "@/components/ui/ChatWindow"
import { conversations, users, messages } from "@/lib/api"
import { Conversation, User, Message } from "@/lib/types"

interface ConversationWithUser extends Conversation {
    otherUser: User
    unreadCount?: number
    lastMessage?: Message
}

// UserSearch Component
function UserSearch({ onConversationCreated }: { onConversationCreated: (conversationId: string) => void }) {
    const [opened, { open, close }] = useDisclosure(false)
    const [searchQuery, setSearchQuery] = useDebouncedState("", 300)
    const [searchResults, setSearchResults] = useState<User[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (searchQuery.trim()) {
            searchUsers()
        } else {
            setSearchResults([])
        }
    }, [searchQuery])

    const searchUsers = async () => {
        setLoading(true)
        try {
            const response = await users.search(searchQuery.trim())
            setSearchResults(response.data)
        } catch (error) {
            notifications.show({
                title: "Error",
                message: "Failed to search users",
                color: "red"
            })
        } finally {
            setLoading(false)
        }
    }

    const startConversation = async (userId: string) => {
        try {
            const response = await conversations.create(userId)
            onConversationCreated(response.data.id)
            close()
            notifications.show({
                title: "Success",
                message: "Conversation created!",
                color: "green"
            })
        } catch (error: any) {
            const message =
                error.response?.status === 400 ? "Conversation already exists" : "Failed to create conversation"
            notifications.show({
                title: "Error",
                message,
                color: "red"
            })
        }
    }

    return (
        <>
            <ActionIcon size="lg" variant="light" onClick={open} title="Start new conversation">
                <Plus size={18} />
            </ActionIcon>

            <Modal opened={opened} onClose={close} title="Start New Conversation" size="md">
                <Stack>
                    <TextInput
                        leftSection={<Search size={16} />}
                        placeholder="Search users..."
                        defaultValue=""
                        onChange={(event) => setSearchQuery(event.currentTarget.value)}
                        rightSection={
                            searchQuery && (
                                <ActionIcon
                                    variant="subtle"
                                    onClick={() => {
                                        setSearchQuery("")
                                        setSearchResults([])
                                    }}
                                >
                                    <X size={16} />
                                </ActionIcon>
                            )
                        }
                    />

                    <ScrollArea h={300}>
                        <Stack gap="xs">
                            {searchResults.map((user) => (
                                <Paper key={user.id} p="sm" withBorder>
                                    <Group justify="space-between">
                                        <Group>
                                            <Avatar src={user.avatar} alt={user.name || user.username} size="sm" />
                                            <div>
                                                <Text fw={500}>{user.name || user.username}</Text>
                                                <Text size="xs" c="dimmed">
                                                    @{user.username}
                                                </Text>
                                            </div>
                                        </Group>
                                        <Button size="xs" variant="light" onClick={() => startConversation(user.id)}>
                                            Chat
                                        </Button>
                                    </Group>
                                </Paper>
                            ))}

                            {searchQuery && !loading && searchResults.length === 0 && (
                                <Text ta="center" c="dimmed" py="xl">
                                    No users found
                                </Text>
                            )}
                        </Stack>
                    </ScrollArea>
                </Stack>
            </Modal>
        </>
    )
}

// ChatList Component
function ChatList({
    selectedChatId,
    onChatSelect,
    refreshTrigger
}: {
    selectedChatId?: string
    onChatSelect: (chatId: string) => void
    refreshTrigger?: number
}) {
    const [conv, setConversations] = useState<ConversationWithUser[]>([])
    const [loading, setLoading] = useState(true)
    const { user: currentUser } = useAuth()

    const loadConversations = async () => {
        if (!currentUser) return

        try {
            const response = await conversations.getAll()
            const conversationsData = response.data

            // Get other user data and last message for each conversation
            const conversationsWithUsers = await Promise.all(
                conversationsData.map(async (conv) => {
                    const otherUserId = conv.p1 === currentUser.id ? conv.p2 : conv.p1
                    try {
                        // Get other user data
                        const userResponse = await users.getById(otherUserId)

                        // Get last message for this conversation
                        let lastMessage = null
                        try {
                            const messagesResponse = await messages.getByConversation(conv.id, 1, 1)
                            if (messagesResponse.data && messagesResponse.data.length > 0) {
                                lastMessage = messagesResponse.data[0]
                            }
                        } catch (msgError) {
                            console.error("Error loading last message:", msgError)
                        }

                        return {
                            ...conv,
                            otherUser: userResponse.data,
                            lastMessage,
                            unreadCount: 0 // TODO: Implement unread count from API
                        }
                    } catch (error) {
                        console.error("Error loading user:", error)
                        return null
                    }
                })
            )

            // Sort conversations by last message time (most recent first)
            const validConversations = conversationsWithUsers.filter(Boolean) as ConversationWithUser[]
            validConversations.sort((a, b) => {
                const aTime = a.lastMessage?.createdAt || a.updatedAt
                const bTime = b.lastMessage?.createdAt || b.updatedAt
                return new Date(bTime).getTime() - new Date(aTime).getTime()
            })

            setConversations(validConversations)
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

    const formatMessagePreview = (message: Message | undefined, isOwnMessage: boolean) => {
        if (!message) return "No messages yet"

        const prefix = isOwnMessage ? "You: " : ""
        const content = message.content || "" // Handle different message content fields

        // Truncate long messages
        if (content.length > 50) {
            return prefix + content.substring(0, 50) + "..."
        }

        return prefix + content
    }

    return (
        <Paper h="100%" p="md">
            <ScrollArea h="calc(100vh - 140px)">
                <Stack gap="xs">
                    {conv.map((conversation) => {
                        const isOwnMessage = conversation.lastMessage?.sender === currentUser?.id
                        const hasUnread = conversation.unreadCount && conversation.unreadCount > 0

                        return (
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
                                                <Text fw={hasUnread ? 600 : 500} truncate>
                                                    {conversation.otherUser.name || conversation.otherUser.username}
                                                </Text>
                                                <Text size="xs" c="dimmed">
                                                    {formatTime(
                                                        conversation.lastMessage?.createdAt || conversation.updatedAt
                                                    )}
                                                </Text>
                                            </Group>
                                            <Text
                                                size="sm"
                                                c={hasUnread ? "dark" : "dimmed"}
                                                fw={hasUnread ? 500 : 400}
                                                truncate
                                            >
                                                {formatMessagePreview(conversation.lastMessage, isOwnMessage)}
                                            </Text>
                                        </div>
                                        {hasUnread && (
                                            <Badge size="sm" color="blue">
                                                {conversation.unreadCount}
                                            </Badge>
                                        )}
                                    </Group>

                                    <Menu shadow="md" width={200}>
                                        <Menu.Target>
                                            <ActionIcon variant="subtle" size="sm" onClick={(e) => e.stopPropagation()}>
                                                <MoreHorizontal size={16} />
                                            </ActionIcon>
                                        </Menu.Target>

                                        <Menu.Dropdown>
                                            <Menu.Item
                                                leftSection={<Trash2 size={14} />}
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
                        )
                    })}

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

// Main Chat Conversation Page Component
export default function ChatConversationPage() {
    const { user, logout, loading } = useAuth()
    const router = useRouter()
    const params = useParams()
    const conversationId = params.id as string
    const [conversation, setConversation] = useState<Conversation | null>(null)
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    useEffect(() => {
        if (!loading && !user) {
            router.push("/")
        }
    }, [user, loading, router])

    useEffect(() => {
        if (conversationId && user) {
            loadConversation()
        }
    }, [conversationId, user])

    const loadConversation = async () => {
        try {
            const response = await conversations.getById(conversationId)
            setConversation(response.data)
        } catch (error) {
            console.error("Error loading conversation:", error)
            router.push("/chat")
        }
    }

    const handleLogout = async () => {
        await logout()
        router.push("/")
    }

    const handleConversationCreated = (newConversationId: string) => {
        setRefreshTrigger((prev) => prev + 1)
        router.push(`/chat/${newConversationId}`)
    }

    if (loading || !user || !conversation) {
        return null
    }

    const otherUserId = conversation.p1 === user.id ? conversation.p2 : conversation.p1

    return (
        <Container size="xl" h="100vh" p={0}>
            <Grid h="100%" gutter={0}>
                {/* Sidebar */}
                <Grid.Col span={4} style={{ borderRight: "1px solid #e9ecef" }}>
                    <div className="h-full flex flex-col">
                        {/* User Header */}
                        <Paper p="md" shadow="sm" style={{ borderBottom: "1px solid #e9ecef" }}>
                            <Group justify="space-between">
                                <Group>
                                    <Avatar src={user.avatar} alt={user.name || user.username} size="md" />
                                    <div>
                                        <Text fw={600}>{user.name || user.username}</Text>
                                        <Text size="sm" c="dimmed">
                                            @{user.username}
                                        </Text>
                                    </div>
                                </Group>

                                <Group gap="xs">
                                    <UserSearch onConversationCreated={handleConversationCreated} />

                                    <Menu shadow="md" width={180}>
                                        <Menu.Target>
                                            <ActionIcon variant="subtle" size="lg">
                                                <Settings size={18} />
                                            </ActionIcon>
                                        </Menu.Target>

                                        <Menu.Dropdown>
                                            <Menu.Item
                                                leftSection={<LogOut size={14} />}
                                                color="red"
                                                onClick={handleLogout}
                                            >
                                                Logout
                                            </Menu.Item>
                                        </Menu.Dropdown>
                                    </Menu>
                                </Group>
                            </Group>
                        </Paper>

                        {/* Chat List */}
                        <div style={{ flex: 1 }}>
                            <ChatList
                                selectedChatId={conversationId}
                                onChatSelect={(chatId) => router.push(`/chat/${chatId}`)}
                                refreshTrigger={refreshTrigger}
                            />
                        </div>
                    </div>
                </Grid.Col>

                {/* Chat Window */}
                <Grid.Col span={8}>
                    <ChatWindow conversationId={conversationId} otherUserId={otherUserId} />
                </Grid.Col>
            </Grid>
        </Container>
    )
}
