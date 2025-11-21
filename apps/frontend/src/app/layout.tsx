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
    description: "Real-time chat application with Next.js and Socket.IO",
    icons: { icon: "/favicon.svg" }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
                <meta name="msapplication-TileColor" content="#4285f4" />
                <meta name="theme-color" content="#4285f4" />
            </head>
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
