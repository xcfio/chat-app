import { cn } from "@/lib/utils"
import { ThemeSwitcher } from "./theme-switcher"
import Footer from "./footer"

export function Page({
    children,
    className,
    footer = true,
    ...prop
}: React.ComponentProps<"div"> & { footer?: boolean }) {
    return (
        <>
            <main>
                <ThemeSwitcher />
                <div className={cn("min-h-full min-w-full", className)} {...prop}>
                    {children}
                </div>
            </main>
            {footer && <Footer />}
        </>
    )
}
