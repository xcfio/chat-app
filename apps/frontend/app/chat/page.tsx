"use client"

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Page } from "@/components/page"
import { useState } from "react"

export default () => {
    return (
        <>
            <MinWidth768 />
            <MaxWidth768 />
        </>
    )
}

function MinWidth768() {
    return (
        <Page footer={false} className="hidden md:block h-screen w-screen">
            <ResizablePanelGroup orientation="horizontal" className="border">
                <ResizablePanel defaultSize="35%" minSize="20%">
                    <UserArea />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize="65%" minSize="30%">
                    <ChatArea />
                </ResizablePanel>
            </ResizablePanelGroup>
        </Page>
    )
}

function MaxWidth768() {
    const [isChat, setIsChat] = useState(true)

    return (
        <Page footer={false} className="block md:hidden h-screen w-screen">
            {isChat ? <ChatArea /> : <UserArea />}
        </Page>
    )
}

function ChatArea() {
    return (
        <>
            <h4 className="mb-4 text-sm leading-none font-medium">Chat area</h4>
            <ScrollArea className="rounded-md">
                <>
                    <div className="text-sm">Message: 1</div>
                    <Separator className="my-2" />
                </>
                <>
                    <div className="text-sm">Message: 2</div>
                    <Separator className="my-2" />
                </>
            </ScrollArea>
        </>
    )
}
function ChatHeader() {}
function ChatMessages() {}
function ChatInput() {}

function UserArea() {
    return (
        <>
            <h4 className="mb-4 text-sm leading-none font-medium">User area</h4>
            <ScrollArea className="rounded-md">
                <>
                    <div className="text-sm">User: 1</div>
                    <Separator className="my-2" />
                </>
                <>
                    <div className="text-sm">User: 2</div>
                    <Separator className="my-2" />
                </>
            </ScrollArea>
        </>
    )
}
function UserHeader() {}
function UserList() {}
function UserProfile() {}
