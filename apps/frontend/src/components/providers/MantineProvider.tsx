// src/components/providers/MantineProvider.tsx
"use client"

import { MantineProvider, createTheme } from "@mantine/core"
import { Notifications } from "@mantine/notifications"
import "@mantine/core/styles.css"
import "@mantine/notifications/styles.css"

const theme = createTheme({
    primaryColor: "blue",
    fontFamily: "Inter, sans-serif"
})

export function CustomMantineProvider({ children }: { children: React.ReactNode }) {
    return (
        <MantineProvider theme={theme}>
            <Notifications position="top-right" />
            {children}
        </MantineProvider>
    )
}
