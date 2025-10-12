"use client"

import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import React, { useState, useRef, KeyboardEvent } from "react"
import { motion } from "framer-motion"

interface EmailMetadata {
  to: string
  subject: string
  from: string
}

export interface UserEmailReq {
  metadata:EmailMetadata
  content:string
}

interface ReplyData {
  to: string
  subject: string
  from: string
}

interface ChatInputProps {
  onSendMessage: (message:UserEmailReq) => void
  isLoading?: boolean
  placeholder?: string
  replyData?: ReplyData | null
  onClearReply?: () => void
}

export function ChatInput({ 
  onSendMessage, 
  isLoading = false, 
  placeholder = "Beschreibe, wie deine E-Mail aussehen soll...",
  replyData,
  onClearReply
}: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [metadata, setMetadata] = useState<EmailMetadata>({
    to: "",
    subject: "",
    from: "user@example.com"
  })
  const [isExpanded, setIsExpanded] = useState(false)
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null)
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [showEmailRequired, setShowEmailRequired] = useState(false)
  const [showEmailInvalid, setShowEmailInvalid] = useState(false)
  const [buttonShake, setButtonShake] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Pre-fill metadata when replyData is available
  React.useEffect(() => {
    if (replyData) {
      setMetadata({
        to: replyData.to,
        subject: replyData.subject.startsWith('Re: ') ? replyData.subject : `Re: ${replyData.subject}`,
        from: replyData.from
      })
      setIsExpanded(true)
      // Clear reply data after using it
      if (onClearReply) {
        onClearReply()
      }
    }
  }, [replyData, onClearReply])

  // Email validation function
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSend = () => {
    // Check if email is required and filled
    if (!metadata.to.trim()) {
      setShowEmailRequired(true)
      setButtonShake(true)
      setTimeout(() => {
        setShowEmailRequired(false)
        setButtonShake(false)
      }, 3000) // Hide after 3 seconds
      return
    }

    // Check if email is invalid
    if (metadata.to.trim() && !isValidEmail(metadata.to)) {
      setShowEmailInvalid(true)
      setButtonShake(true)
      setTimeout(() => {
        setShowEmailInvalid(false)
        setButtonShake(false)
      }, 3000) // Hide after 3 seconds
      return
    }

    if (message && !isLoading) {
      onSendMessage({
        content: message,
        metadata: metadata
      })
      setMessage("")
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
    
    // Auto-resize textarea
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 80) + 'px'
  }

  const handleMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
      setHoverTimeout(null)
    }
    setIsExpanded(true)
  }

  const handleMouseLeave = () => {
    // Nur schließen wenn kein Input-Feld aktiv ist
    if (!isInputFocused) {
      const timeout = setTimeout(() => {
        setIsExpanded(false)
      }, 1500) // Reduziert von 2500ms auf 1500ms
      setHoverTimeout(timeout)
    }
  }

  const handleInputFocus = () => {
    setIsInputFocused(true)
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
      setHoverTimeout(null)
    }
    setIsExpanded(true)
  }

  const handleInputBlur = () => {
    setIsInputFocused(false)
    // Nach 1.5 Sekunden schließen wenn nicht mehr gehovered wird
    const timeout = setTimeout(() => {
      setIsExpanded(false)
    }, 1500)
    setHoverTimeout(timeout)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value
    setMetadata(prev => ({ ...prev, to: email }))
    
    // Reset error states when user types
    setShowEmailInvalid(false)
    setShowEmailRequired(false)
    setButtonShake(false)
  }

  return (
    <div className="bg-primary-black border-t border-light-gray/30 w-full">
      <div className="max-w-3xl mx-auto px-4 py-3">
        <div className="relative">

          {/* Kompakter Metadata Header */}
          <motion.div
            className="mb-2"
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: isExpanded ? "auto" : 0, 
              opacity: isExpanded ? 1 : 0 
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{ overflow: "hidden" }}
          >
            <div className="bg-blueish-black/20 rounded-lg p-2">
              <div className="flex gap-2">
                {/* To Field */}
                <div className="flex-1">
                  <motion.div
                    animate={{
                      scale: (showEmailRequired || showEmailInvalid) ? [1, 1.02, 1] : 1,
                      borderColor: (showEmailRequired || showEmailInvalid) ? '#ef4444' : 'transparent'
                    }}
                    transition={{
                      scale: {
                        duration: 0.6,
                        times: [0, 0.5, 1],
                        repeat: (showEmailRequired || showEmailInvalid) ? 2 : 0,
                        ease: "easeInOut"
                      },
                      borderColor: {
                        duration: 0.3,
                        ease: "easeInOut"
                      }
                    }}
                    className={`w-full border rounded transition-all duration-200 ${
                      showEmailRequired || showEmailInvalid
                        ? 'border-red-500 bg-red-500/10' 
                        : 'border-transparent focus-within:border-gray-blue/70'
                    }`}
                  >
                    <input
                      type="email"
                      value={metadata.to}
                      onChange={handleEmailChange}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      className={`w-full px-2 py-1 text-xs focus:outline-none placeholder:text-light-gray/60 transition-colors duration-200 ${
                        showEmailRequired || showEmailInvalid
                          ? 'bg-red-500/10 text-red-200 placeholder:text-red-300/60'
                          : 'bg-transparent text-creme-white'
                      }`}
                      placeholder={
                        showEmailRequired 
                          ? "📧 E-Mail erforderlich..." 
                          : showEmailInvalid 
                            ? "❌ Ungültige E-Mail-Adresse..." 
                            : "An..."
                      }
                    />
                  </motion.div>
                  
                </div>

                {/* Subject Field */}
                <div className="flex-1">
                  <input
                    type="text"
                    value={metadata.subject}
                    onChange={(e) => setMetadata(prev => ({ ...prev, subject: e.target.value }))}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    className="w-full px-2 py-1 bg-transparent text-creme-white text-xs focus:outline-none placeholder:text-light-gray/60"
                    placeholder="Betreff..."
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <div 
            className="flex items-end gap-3"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Kompakteres Input-Feld */}
            <div className="flex-1 relative">
              <div className="relative bg-blueish-black/40 border border-light-gray/30 rounded-2xl overflow-hidden focus-within:border-light-gray/50 focus-within:bg-blueish-black/60 transition-all duration-200">
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={handleTextareaChange}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder}
                  disabled={isLoading}
                  className="w-full min-h-[40px] max-h-[80px] px-4 py-3 pr-12 bg-transparent text-creme-white placeholder:text-light-gray/60 resize-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  rows={1}
                  style={{ 
                    overflow: 'hidden',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word'
                  }}
                />
                
                {/* Send Button */}
                <motion.div
                  animate={{
                    x: (showEmailRequired || showEmailInvalid) ? [0, -3, 3, -3, 3, 0] : 0,
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: (showEmailRequired || showEmailInvalid) ? 1 : 0,
                    ease: "easeInOut"
                  }}
                  className="absolute right-2 bottom-2"
                >
                  <Button
                    onClick={handleSend}
                    disabled={!message.trim() || isLoading || !metadata.to.trim()}
                    size="icon"
                    className={`h-7 w-7 rounded-full transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed ${
                      showEmailRequired || showEmailInvalid
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-gray-blue hover:bg-light-gray text-primary-black'
                    }`}
                  >
                    <Send className="w-3 h-3" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Subtiler Helper text */}
          <div className="mt-1 text-xs text-light-gray/50 text-center">
            Enter zum Senden
          </div>
        </div>
      </div>
    </div>
  )
}