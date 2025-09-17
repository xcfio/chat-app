// src/app/layout.tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { CustomMantineProvider } from "@/components/providers/MantineProvider"
import { AuthProvider } from "@/components/providers/AuthProvider"
import { SocketProvider } from "@/components/providers/SocketProvider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Chat App",
    description: "Real-time chat application with Next.js and Socket.IO"
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <CustomMantineProvider>
                    <AuthProvider>
                        <SocketProvider>{children}</SocketProvider>
                    </AuthProvider>
                </CustomMantineProvider>
            </body>
        </html>
    )
}
