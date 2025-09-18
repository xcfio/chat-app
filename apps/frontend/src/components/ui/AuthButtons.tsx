// src/components/ui/AuthButtons.tsx
"use client"

import { Button, Text, Card, Stack, Box, Badge } from "@mantine/core"
import { Github } from "lucide-react"
import { useAuth } from "../providers/AuthProvider"

export function AuthButtons() {
    const { login } = useAuth()

    return (
        <Box
            style={{
                minHeight: "100vh",
                width: "100vw",
                background: "linear-gradient(135deg, #1e293b 0%, #6b46c1 50%, #1e293b 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px",
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }}
        >
            <Card
                shadow="xl"
                padding="48px"
                radius="xl"
                style={{
                    maxWidth: "400px",
                    width: "100%",
                    background: "linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(51, 65, 85, 0.8) 100%)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(148, 163, 184, 0.2)"
                }}
            >
                <Stack gap="xl" align="center">
                    {/* Header */}
                    <Box ta="center">
                        <Text size="32px" fw={700} c="white" mb={8} lh={1.2}>
                            Welcome Back
                        </Text>
                        <Text size="sm" c="#cbd5e1">
                            Sign in to your account to continue
                        </Text>
                    </Box>

                    {/* Buttons */}
                    <Stack gap="md" w="100%">
                        {/* GitHub Button with Recommended Badge */}
                        <Box style={{ position: "relative" }}>
                            <Button
                                leftSection={<Github size={20} />}
                                size="lg"
                                radius="xl"
                                h={56}
                                c="white"
                                style={{
                                    background: "linear-gradient(135deg, #24292e 0%, #1a1e22 100%)",
                                    border: "1px solid #444d56",
                                    fontSize: "16px",
                                    fontWeight: 500,
                                    transition: "all 0.3s ease",
                                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)"
                                }}
                                styles={{
                                    root: {
                                        "&:hover": {
                                            background: "linear-gradient(135deg, #2f363d 0%, #24292e 100%)",
                                            transform: "translateY(-2px)",
                                            boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)"
                                        }
                                    }
                                }}
                                onClick={() => login("github")}
                                fullWidth
                            >
                                <Box
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        width: "100%"
                                    }}
                                >
                                    <span>Sign in with GitHub</span>
                                    <Badge
                                        size="xs"
                                        color="green"
                                        variant="filled"
                                        style={{
                                            fontSize: "10px",
                                            marginLeft: "8px"
                                        }}
                                    >
                                        Recommended
                                    </Badge>
                                </Box>
                            </Button>
                        </Box>

                        {/* Google Button */}
                        <Button
                            leftSection={
                                <svg viewBox="0 0 24 24" width="20" height="20">
                                    <path
                                        fill="#4285f4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34a853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#fbbc05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="#ea4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                            }
                            size="lg"
                            radius="xl"
                            h={56}
                            c="white"
                            style={{
                                background:
                                    "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
                                border: "1px solid rgba(255, 255, 255, 0.2)",
                                fontSize: "16px",
                                fontWeight: 500,
                                transition: "all 0.3s ease",
                                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)"
                            }}
                            styles={{
                                root: {
                                    "&:hover": {
                                        background:
                                            "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.1) 100%)",
                                        borderColor: "rgba(255, 255, 255, 0.3)",
                                        transform: "translateY(-2px)",
                                        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)"
                                    }
                                }
                            }}
                            onClick={() => login("google")}
                            fullWidth
                        >
                            Sign in with Google
                        </Button>
                    </Stack>
                </Stack>
            </Card>
        </Box>
    )
}
