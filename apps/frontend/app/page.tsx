"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff } from "lucide-react"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { FormEvent, useRef, useState } from "react"

export default function Page() {
    const passwordRef = useRef<HTMLInputElement>(null)
    const passwordElement = useRef<HTMLDivElement>(null)
    const conformPasswordElement = useRef<HTMLDivElement>(null)
    const [isRegistration, setIsRegistration] = useState(false)
    const [show, setShow] = useState(false)

    function registrationSubmit(form: FormData) {
        console.log("Form submitted with data:")
        for (const [key, value] of form.entries()) {
            console.log(`${key}: ${value}`)
        }
    }

    function loginSubmit(form: FormData) {
        console.log("Form submitted with data:")
        for (const [key, value] of form.entries()) {
            console.log(`${key}: ${value}`)
        }
    }

    function registrationPasswordCheck(event: FormEvent<HTMLInputElement>) {
        if (event.currentTarget.value !== passwordRef.current?.value) {
            event.currentTarget.setCustomValidity("Passwords do not match")
            passwordElement.current?.setAttribute("data-invalid", "true")
            conformPasswordElement.current?.setAttribute("data-invalid", "true")
        } else {
            event.currentTarget.setCustomValidity("")
            passwordElement.current?.setAttribute("data-invalid", "false")
            conformPasswordElement.current?.setAttribute("data-invalid", "false")
        }
    }
    return (
        <>
            <ThemeSwitcher />
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-5">
                {isRegistration ? (
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle>Create Account</CardTitle>
                            <CardDescription>Please fill in your details below</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form action={registrationSubmit}>
                                <FieldGroup>
                                    <Field>
                                        <FieldLabel htmlFor="name">
                                            Name <span className="text-destructive">*</span>
                                        </FieldLabel>
                                        <Input
                                            id="name"
                                            placeholder="Enter your name"
                                            title="Enter your name"
                                            required
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="username">
                                            Username <span className="text-destructive">*</span>
                                        </FieldLabel>
                                        <Input
                                            id="username"
                                            placeholder="Enter your username"
                                            pattern="[a-zA-Z][a-zA-Z0-9-]{3,11}"
                                            title="Username must be 4-12 characters, start with a letter, and contain only letters, numbers, and hyphens"
                                            required
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="email">
                                            Email <span className="text-destructive">*</span>
                                        </FieldLabel>
                                        <Input id="email" placeholder="Enter your email" type="email" required />
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="gender">
                                            Gender <span className="text-destructive">*</span>
                                        </FieldLabel>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select your gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="male">Male</SelectItem>
                                                    <SelectItem value="female">Female</SelectItem>
                                                    <SelectItem value="other">Other</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </Field>
                                    <Field ref={passwordElement}>
                                        <FieldLabel htmlFor="password">
                                            Password <span className="text-destructive">*</span>
                                        </FieldLabel>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                ref={passwordRef}
                                                type={show ? "text" : "password"}
                                                placeholder="Enter your password"
                                                minLength={6}
                                                maxLength={30}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShow(!show)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                            >
                                                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </Field>
                                    <Field ref={conformPasswordElement}>
                                        <FieldLabel htmlFor="confirmPassword">
                                            Confirm Password <span className="text-destructive">*</span>
                                        </FieldLabel>
                                        <div className="relative">
                                            <Input
                                                id="confirmPassword"
                                                type={show ? "text" : "password"}
                                                placeholder="Confirm your password"
                                                minLength={6}
                                                maxLength={30}
                                                required
                                                onInput={registrationPasswordCheck}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShow(!show)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                            >
                                                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </Field>
                                    <Field orientation="horizontal" className="flex flex-row justify-between">
                                        <Button type="submit">Submit</Button>
                                        <Button type="button" variant="ghost" onClick={() => setIsRegistration(false)}>
                                            Already have an account? Login
                                        </Button>
                                    </Field>
                                </FieldGroup>
                            </form>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle>Login</CardTitle>
                            <CardDescription>Please enter your credentials to continue</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form action={loginSubmit}>
                                <FieldGroup>
                                    <Field>
                                        <FieldLabel htmlFor="email">
                                            Email <span className="text-destructive">*</span>
                                        </FieldLabel>
                                        <Input id="email" placeholder="Enter your email" type="email" required />
                                    </Field>
                                    <Field ref={passwordElement}>
                                        <div className="flex justify-between items-center">
                                            <FieldLabel htmlFor="password">
                                                Password <span className="text-destructive">*</span>
                                            </FieldLabel>
                                            <Button
                                                type="button"
                                                variant="link"
                                                className="text-muted-foreground text-xs p-0 h-auto"
                                            >
                                                Forgot password?
                                            </Button>
                                        </div>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                ref={passwordRef}
                                                type={show ? "text" : "password"}
                                                placeholder="Enter your password"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShow(!show)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                            >
                                                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </Field>
                                    <Field orientation="horizontal" className="flex flex-row justify-between">
                                        <Button type="submit">Submit</Button>
                                        <Button type="button" variant="ghost" onClick={() => setIsRegistration(true)}>
                                            Don't have an account? Register
                                        </Button>
                                    </Field>
                                </FieldGroup>
                            </form>
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    )
}
