// src/app/chat/[id]/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Container, Grid, Paper, Group, Avatar, Text, ActionIcon, Menu } from "@mantine/core"
import { IconLogout, IconSettings } from "@tabler/icons-react"
import { useAuth } from "@/components/providers/AuthProvider"
import { ChatList } from "@/components/ui/ChatList"
import { ChatWindow } from "@/components/ui/ChatWindow"
import { UserSearch } from "@/components/ui/UserSearch"
import { conversations } from "@/lib/api"
import { Conversation } from "@/lib/types"

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
                                                <IconSettings size={18} />
                                            </ActionIcon>
                                        </Menu.Target>

                                        <Menu.Dropdown>
                                            <Menu.Item
                                                leftSection={<IconLogout size={14} />}
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
