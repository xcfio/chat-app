// src/components/ui/AuthButtons.tsx
"use client"

import { Button, Group, Text, Card } from "@mantine/core"
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react"
import { useAuth } from "../providers/AuthProvider"

export function AuthButtons() {
    const { login } = useAuth()

    return (
        <Card shadow="sm" padding="xl" radius="md" withBorder className="max-w-md mx-auto">
            <Text size="xl" fw={600} ta="center" mb="md">
                Welcome to Chat App
            </Text>
            <Text size="sm" c="dimmed" ta="center" mb="xl">
                Sign in to start messaging with your friends
            </Text>

            <Group grow>
                <Button
                    leftSection={<IconBrandGithub size={20} />}
                    variant="outline"
                    color="dark"
                    onClick={() => login("github")}
                >
                    GitHub
                </Button>
                <Button
                    leftSection={<IconBrandGoogle size={20} />}
                    variant="outline"
                    color="red"
                    onClick={() => login("google")}
                >
                    Google
                </Button>
            </Group>
        </Card>
    )
}
