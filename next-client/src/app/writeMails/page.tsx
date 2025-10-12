"use client"

import { useReply } from "../ReplyContext"
import ChatInterface from "@/components/chat/ChatInterface"

export default function WriteMails() {
    const { replyData, clearReplyData } = useReply()
    
    return <ChatInterface replyData={replyData} onClearReply={clearReplyData} />
}