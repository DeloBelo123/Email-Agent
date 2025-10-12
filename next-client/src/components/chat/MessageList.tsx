"use client"

import Message from "./Message"
import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export interface ChatMessage {
  id: string
  content: string
  metadata?: any
  isUser: boolean
  timestamp: Date
}

interface MessageListProps {
  messages: ChatMessage[]
  isLoading?: boolean
  onImproveMessage?: (messageId: string, content: string) => void
}

export function MessageList({ messages, isLoading, onImproveMessage }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-primary-black w-full">
        <div className="text-center space-y-6 max-w-2xl">
          {/* Modern Email Icon mit einmaliger Animation */}
          <motion.div 
            className="w-24 h-24 mx-auto bg-gradient-to-br from-blueish-black to-gray-blue rounded-2xl flex items-center justify-center shadow-2xl"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 15,
              delay: 0.2 
            }}
          >
            <span className="text-4xl">
              ✉️
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-creme-white mb-4">
              Email Agent
            </h1>
            <p className="text-light-gray text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto">
              Beschreibe mir, wie deine E-Mail aussehen soll. Ich helfe dir dabei, 
              eine professionelle E-Mail zu erstellen.
            </p>
          </motion.div>

          {/* Moderne Beispiel-Karten mit Animationen */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            {[
              { title: "Geschäftlich", desc: "Schreibe eine E-Mail an meinen Chef über das Projekt", icon: "💼" },
              { title: "Bewerbung", desc: "Erstelle eine formelle Bewerbung für eine Stelle", icon: "📝" },
              { title: "Kundenservice", desc: "Schreibe eine Entschuldigung an einen Kunden", icon: "🤝" }
            ].map((example, index) => (
              <motion.div 
                key={index}
                className="bg-gradient-to-br from-blueish-black/60 to-gray-blue/40 rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
              >
                <div className="text-2xl mb-3">
                  {example.icon}
                </div>
                <h3 className="text-creme-white font-semibold mb-2 text-sm">
                  {example.title}
                </h3>
                <p className="text-light-gray text-xs leading-relaxed">
                  {example.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto bg-primary-black w-full relative mt-10">
      {/* Zentrierter Container mit 60% Breite und Padding */}
      <div className="max-w-[65%] mx-auto min-h-full relative px-6 py-4 border-gray-500/30 border-x ">
        
        <div className="space-y-1 w-full relative z-10">
          {messages.map((message, index) => (
            <Message
              key={message.id}
              content={message.content}
              isUser={message.isUser}
              timestamp={message.timestamp}
              index={index}
              metadata={message.metadata}
              onImproveMessage={onImproveMessage}
            />
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="bg-blueish-black w-full">
              <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-blue text-creme-white flex items-center justify-center text-sm font-semibold">
                    AI
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-semibold text-creme-white">
                        Email Agent
                      </span>
                      <span className="text-xs text-light-gray">
                        schreibt...
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-light-gray rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-light-gray rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-light-gray rounded-full animate-bounce"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div ref={messagesEndRef} />
    </div>
  )
}