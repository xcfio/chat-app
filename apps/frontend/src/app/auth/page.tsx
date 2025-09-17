// src/app/auth/page.tsx
"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Container, Center, Loader, Text, Alert } from "@mantine/core"
import { IconX } from "@tabler/icons-react"
import { useAuth } from "@/components/providers/AuthProvider"

export default function AuthPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { refreshUser, user } = useAuth()
    const error = searchParams.get("error")

    useEffect(() => {
        if (error) {
            setTimeout(() => {
                router.push("/")
            }, 3000)
        } else if (!user) {
            refreshUser()
                .then(() => {
                    router.push("/chat")
                })
                .catch(() => {
                    router.push("/")
                })
        } else {
            router.push("/chat")
        }
    }, [error, user, router, refreshUser])

    if (error) {
        return (
            <Container size="sm" h="100vh">
                <Center h="100%">
                    <Alert icon={<IconX size={16} />} title="Authentication Error" color="red">
                        {error === "access_denied"
                            ? "Authentication was cancelled or denied"
                            : "An error occurred during authentication"}
                        <Text size="sm" mt="xs">
                            Redirecting to home page...
                        </Text>
                    </Alert>
                </Center>
            </Container>
        )
    }

    return (
        <Container size="sm" h="100vh">
            <Center h="100%">
                <div className="text-center">
                    <Loader size="xl" mb="md" />
                    <Text>Completing authentication...</Text>
                </div>
            </Center>
        </Container>
    )
}
