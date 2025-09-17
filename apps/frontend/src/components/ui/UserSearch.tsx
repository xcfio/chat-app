// src/components/ui/UserSearch.tsx
"use client"

import { useState, useEffect } from "react"
import { TextInput, Avatar, Group, Text, Button, Paper, Stack, ActionIcon, Modal, ScrollArea } from "@mantine/core"
import { IconSearch, IconPlus, IconX } from "@tabler/icons-react"
import { useDebouncedState, useDisclosure } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import { users, conversations } from "@/lib/api"
import { User } from "@/lib/types"

interface UserSearchProps {
    onConversationCreated: (conversationId: string) => void
}

export function UserSearch({ onConversationCreated }: UserSearchProps) {
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
                <IconPlus size={18} />
            </ActionIcon>

            <Modal opened={opened} onClose={close} title="Start New Conversation" size="md">
                <Stack>
                    <TextInput
                        leftSection={<IconSearch size={16} />}
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
                                    <IconX size={16} />
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
