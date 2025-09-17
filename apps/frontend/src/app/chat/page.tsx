// src/app/chat/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Container, Grid, Paper, Group, Avatar, Text, ActionIcon, Menu, Button, Center } from "@mantine/core"
import { IconLogout, IconSettings, IconPlus } from "@tabler/icons-react"
import { useAuth } from "@/components/providers/AuthProvider"
import { ChatList } from "@/components/ui/ChatList"
import { UserSearch } from "@/components/ui/UserSearch"

export default function ChatPage() {
    const { user, logout, loading } = useAuth()
    const router = useRouter()
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    useEffect(() => {
        if (!loading && !user) {
            router.push("/")
        }
    }, [user, loading, router])

    const handleLogout = async () => {
        await logout()
        router.push("/")
    }

    const handleConversationCreated = (conversationId: string) => {
        setRefreshTrigger((prev) => prev + 1)
        router.push(`/chat/${conversationId}`)
    }

    if (loading || !user) {
        return null
    }

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
                                onChatSelect={(chatId) => router.push(`/chat/${chatId}`)}
                                refreshTrigger={refreshTrigger}
                            />
                        </div>
                    </div>
                </Grid.Col>

                {/* Main Content */}
                <Grid.Col span={8}>
                    <Center h="100%">
                        <div className="text-center">
                            <Text size="xl" fw={600} c="dimmed" mb="sm">
                                Welcome to Chat App
                            </Text>
                            <Text c="dimmed" mb="lg">
                                Select a conversation to start chatting or create a new one
                            </Text>
                            <UserSearch onConversationCreated={handleConversationCreated} />
                        </div>
                    </Center>
                </Grid.Col>
            </Grid>
        </Container>
    )
}
