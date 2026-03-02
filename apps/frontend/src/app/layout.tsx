import type { Metadata } from "next"
import { Comfortaa } from "next/font/google"
import "./globals.css"
import clsx from "clsx"

export const metadata: Metadata = {
    title: "Chat App",
    description: "Real-time chat application with Next.js and Socket.IO",
    icons: { icon: "/favicon.svg" }
}

const comfortaa = Comfortaa({
    subsets: ["latin"],
    variable: "--font-sans"
})

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" suppressHydrationWarning className={comfortaa.variable}>
            <head>
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
                <meta name="msapplication-TileColor" content="#4285f4" />
                <meta name="theme-color" content="#4285f4" />
            </head>
            <body className={clsx("antialiased", comfortaa.variable)}>{children}</body>
        </html>
    )
}
