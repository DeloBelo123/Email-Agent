"use client"

import { useState, useCallback } from "react"
import { MessageList, type ChatMessage } from "./MessageList"

interface EmailMetadata {
  to: string
  subject: string
  from: string
}

interface ReplyData {
  to: string
  subject: string
  from: string
}

import { ChatInput, UserEmailReq } from "./ChatInput"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"

interface ChatInterfaceProps {
  replyData?: ReplyData | null
  onClearReply?: () => void
}

export default function ChatInterface({ replyData, onClearReply }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [improvingMessage, setImprovingMessage] = useState<string | null>(null)

  // Backend API Call mit useMutation
  const emailMutation = useMutation({
    mutationFn: async (userMessage: UserEmailReq) => {
      const response = await axios.post("/api/create_email/test3", {
        meta_data: {
          from_: userMessage.metadata.from,
          to: userMessage.metadata.to, 
          subject: userMessage.metadata.subject
        },
        content: userMessage.content
      })
      return response.data
    }
  })

  const handleImproveMessage = useCallback((messageId: string, content: string) => {
    // Set the message to improve and let user input their improvement request
    setImprovingMessage(content)
  }, [])

  const handleSendMessage = useCallback(async (message:UserEmailReq) => {
    // If we're improving a message, modify the content to include the original email
    const finalContent = improvingMessage 
      ? `Verbessere diese E-Mail: ${improvingMessage}\n\nVerbesserungswunsch: ${message.content}`
      : message.content

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: finalContent,
      metadata: message.metadata,
      isUser: true,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])

    // Clear improving message after sending
    if (improvingMessage) {
      setImprovingMessage(null)
    }

    try {
      // 2. Backend API Call with modified content
      const modifiedMessage = { ...message, content: finalContent }
      const response = await emailMutation.mutateAsync(modifiedMessage)
      
      // 3. AI Message erstellen und zu State hinzufügen
      // Email-Objekt zu String konvertieren
      const emailString = `From: ${response.email.from}
To: ${response.email.to}
Subject: ${response.email.subject}

${response.email.content}`
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: emailString,
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      
    } catch (error) {
      console.error('Error getting email from backend:', error)
      
      // 4. Error Message erstellen und zu State hinzufügen
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "Entschuldigung, es gab einen Fehler beim Generieren der E-Mail. Bitte versuche es erneut.",
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    }
  }, [emailMutation, improvingMessage])

  return (
    <div className="flex flex-col h-screen bg-primary-black">
      
      {/* Messages */}
      <MessageList 
        messages={messages} 
        isLoading={emailMutation.isPending}
        onImproveMessage={handleImproveMessage}
      />

      {/* Improvement Indicator */}
      {improvingMessage && (
        <div className="bg-blueish-black/60 border-t border-gray-blue/40 px-4 py-2">
          <div className="max-w-3xl mx-auto flex items-center gap-2 text-sm text-light-gray">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span>Verbessere diese E-Mail - gib deine Wünsche ein</span>
            <button 
              onClick={() => setImprovingMessage(null)}
              className="ml-auto text-xs text-gray-400 hover:text-light-gray transition-colors"
            >
              Abbrechen
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      <ChatInput 
        onSendMessage={handleSendMessage}
        isLoading={emailMutation.isPending}
        placeholder={improvingMessage ? "Wie soll die E-Mail verbessert werden?" : "Beschreibe, wie deine E-Mail aussehen soll..."}
        replyData={replyData}
        onClearReply={onClearReply}
      />
    </div>
  )
}