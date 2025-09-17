import { Suspense } from "react"
import { Container, Center, Loader, Text } from "@mantine/core"
import AuthPageContent from "./AuthPageContent"

export const dynamic = "force-dynamic"

export default function AuthPage() {
    return (
        <Suspense
            fallback={
                <Container size="sm" h="100vh">
                    <Center h="100%">
                        <div className="text-center">
                            <Loader size="xl" mb="md" />
                            <Text>Loading...</Text>
                        </div>
                    </Center>
                </Container>
            }
        >
            <AuthPageContent />
        </Suspense>
    )
}
