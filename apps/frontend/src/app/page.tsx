// src/app/page.tsx
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Container, Center, Loader } from "@mantine/core"
import { useAuth } from "@/components/providers/AuthProvider"
import { AuthButtons } from "@/components/ui/AuthButtons"

export default function HomePage() {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (user) {
            router.push("/chat")
        }
    }, [user, router])

    if (loading) {
        return (
            <Container size="sm" h="100vh">
                <Center h="100%">
                    <Loader size="xl" />
                </Center>
            </Container>
        )
    }

    if (user) {
        return null // Will redirect to chat
    }

    return (
        <Container size="sm" h="100vh">
            <Center h="100%">
                <AuthButtons />
            </Center>
        </Container>
    )
}
