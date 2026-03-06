"use client"

import { Github, MessageCircle, HelpCircle, Star, SunIcon, MoonIcon, MonitorIcon, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import Link from "next/link"

export default function Footer() {
    const { theme, setTheme } = useTheme()

    return (
        <footer className="bg-card border-t border-border mt-16 relative z-10">
            <div className="max-w-6xl mx-auto px-8 pt-12 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-8">
                    {/* Brand */}
                    <div className="max-w-sm">
                        <h3 className="text-2xl font-bold mb-2">
                            <Link
                                href="/"
                                className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent max-w-36"
                            >
                                Chatio
                            </Link>
                        </h3>
                        <p className="text-muted-foreground leading-relaxed text-sm">
                            A modern real-time chat app built for simplicity. Connect with anyone, anywhere.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-base font-semibold text-foreground mb-2">Quick Links</h4>
                        <div className="flex flex-col">
                            <Button
                                variant="ghost"
                                className="justify-start gap-3 p-2 h-auto text-muted-foreground hover:text-foreground max-w-36"
                                asChild
                            >
                                <Link href="/support" aria-label="Get Support">
                                    <HelpCircle className="h-5 w-5 shrink-0" /> Support
                                </Link>
                            </Button>
                            <Button
                                variant="ghost"
                                className="justify-start gap-3 p-2 h-auto text-muted-foreground hover:text-foreground max-w-36"
                                asChild
                            >
                                <Link href="/credits" aria-label="View Credits">
                                    <Star className="h-5 w-5 shrink-0" /> Credits
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Connect */}
                    <div>
                        <h4 className="text-base font-semibold text-foreground mb-2">Connect</h4>
                        <div className="flex flex-col">
                            <Button
                                variant="ghost"
                                className="justify-start gap-3 p-2 h-auto text-muted-foreground hover:text-foreground max-w-36"
                                asChild
                            >
                                <Link
                                    href="https://github.com/xcfio/chat-app"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="GitHub Repository"
                                >
                                    <Github className="h-5 w-5 shrink-0" /> GitHub
                                </Link>
                            </Button>
                            <Button
                                variant="ghost"
                                className="justify-start gap-3 p-2 h-auto text-muted-foreground hover:text-foreground max-w-36"
                                asChild
                            >
                                <Link
                                    href="https://discord.com/invite/FaCCaFM74Q"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Discord Server"
                                >
                                    <MessageCircle className="h-5 w-5 shrink-0" /> Discord
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Appearance */}
                    <div suppressHydrationWarning>
                        <h4 className="text-base font-semibold text-foreground mb-4">Appearance</h4>
                        <div className="flex flex-col">
                            {[
                                { value: "light", label: "Light", icon: SunIcon },
                                { value: "dark", label: "Dark", icon: MoonIcon },
                                { value: "system", label: "System", icon: MonitorIcon }
                            ].map(({ value, label, icon: Icon }) => (
                                <Button
                                    key={value}
                                    variant="ghost"
                                    onClick={() => setTheme(value)}
                                    className="justify-start gap-3 p-2 h-auto text-muted-foreground hover:text-foreground max-w-36"
                                >
                                    <Icon className="h-4 w-4" />
                                    <span className="flex-1 text-left">{label}</span>
                                    {theme === value && <Check className="h-4 w-4" />}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-border pt-6 text-center">
                    <p className="text-muted-foreground text-sm">
                        © {new Date().getFullYear()} Omar Faruk. See{" "}
                        <Link
                            href="/credits"
                            className="underline underline-offset-4 hover:text-foreground transition-colors"
                        >
                            Credits
                        </Link>
                        {" for more information"}
                    </p>
                </div>
            </div>
        </footer>
    )
}
