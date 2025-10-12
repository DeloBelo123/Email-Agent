"use client"

import { Button } from "@/components/ui/button"
import { Copy, Check, Send, Edit } from "lucide-react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"

interface MessageProps {
  content: string
  isUser: boolean
  timestamp?: Date
  index?: number
  metadata?: any
  onImproveMessage?: (messageId: string, content: string) => void
}

export default function Message({ content, isUser, index = 0, metadata, onImproveMessage }: MessageProps) {
  const [copied, setCopied] = useState(false)
  const [displayedContent, setDisplayedContent] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  
  // Typewriter Animation für AI Messages
  useEffect(() => {
    if (!isUser && content) {
      setIsTyping(true)
      setDisplayedContent("")
      
      // Parse Email Content für bessere Formatierung
      const lines = content.split('\n')
      let formattedContent = ""
      
      lines.forEach(line => {
        if (line.startsWith('Subject:')) {
          formattedContent += line + '\n\n'
        } else if (line.startsWith('From:') || line.startsWith('To:') || line.startsWith('Content-Type:') || line.startsWith('Content-Transfer-Encoding:') || line.startsWith('MIME-Version:')) {
          // Skip metadata lines - do nothing
        } else if (line.trim() === '') {
          formattedContent += '\n'
        } else {
          // Word wrap nach ca. 12 Wörtern
          const words = line.split(' ')
          let currentLine = ''
          
          words.forEach((word, index) => {
            if (currentLine.split(' ').length >= 12 && currentLine.trim() !== '') {
              formattedContent += currentLine.trim() + '\n'
              currentLine = word + ' '
            } else {
              currentLine += word + ' '
            }
          })
          
          if (currentLine.trim() !== '') {
            formattedContent += currentLine.trim() + '\n'
          }
        }
      })
      
      let currentIndex = 0
      const typeInterval = setInterval(() => {
        if (currentIndex < formattedContent.length) {
          setDisplayedContent(formattedContent.slice(0, currentIndex + 1))
          currentIndex++
        } else {
          setIsTyping(false)
          clearInterval(typeInterval)
        }
      }, 20) // 20ms zwischen jedem Buchstaben
      
      return () => clearInterval(typeInterval)
    } else {
      setDisplayedContent(content)
    }
  }, [content, isUser])

  const { mutate, isPending } = useMutation({
    mutationFn: async() => {
      const respo = await axios.post("/api/send_email/test3",{
        email: content
      })
      return respo.data
    },
    onError: (error) => {
      console.error("Error beim Senden der Email:", error)
    }
  })

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleImprove = () => {
    if (onImproveMessage) {
      // Generate a unique message ID for this message
      const messageId = `message-${Date.now()}-${index}`
      onImproveMessage(messageId, content)
    }
  }

  return (
    <motion.div 
      className={`flex w-full px-4 py-1 ${isUser ? 'justify-end' : 'justify-start'}`}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      <div className={`max-w-[85%] ${isUser ? 'text-right' : 'text-left'}`}>
        {isUser ? (
          // User Message - Modernes Design ohne Hintergrund
          <div className="text-sm leading-relaxed text-light-gray whitespace-pre-wrap">
            {displayedContent}
          </div>
        ) : (
          // AI Message - Modernes Design ohne Sprechblase
          <div className="relative group">
            {/* Email Content mit schönen Abschnitten */}
            <div className="text-sm leading-relaxed text-creme-white pr-20">
              {displayedContent.split('\n').map((line, lineIndex) => {
                if (line.startsWith('Subject:')) {
                  return (
                    <div key={lineIndex} className="text-lg font-semibold text-light-gray mb-2">
                      {line.replace('Subject:', '').trim()}
                    </div>
                  )
                } else if (line.startsWith('From:') || line.startsWith('To:') || line.startsWith('Content-Type:') || line.startsWith('Content-Transfer-Encoding:') || line.startsWith('MIME-Version:')) {
                  // Skip metadata lines - don't render
                  return null
                } else if (line.trim() === '') {
                  return <div key={lineIndex} className="h-2" />
                } else {
                  return (
                    <div key={lineIndex} className="mb-1">
                      {line}
                      {isTyping && lineIndex === displayedContent.split('\n').length - 1 && (
                        <motion.span
                          className="inline-block w-2 h-4 bg-creme-white ml-1"
                          animate={{ opacity: [1, 0, 1] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                        />
                      )}
                    </div>
                  )
                }
              })}
            </div>

            {/* Copy Button - absolut positioniert, nur bei Hover sichtbar */}
            {!isTyping && (
              <div className="absolute bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCopy}
                  className="h-4 px-2 text-[9px] bg-gray-blue/20 hover:bg-gray-blue/40 text-light-gray hover:text-creme-white rounded-full"
                >
                  {copied ? (
                    <>
                      <Check className="w-2.5 h-2.5 mr-0.5" />
                      Kopiert!
                    </>
                  ) : (
                    <>
                      <Copy className="w-2.5 h-2.5 mr-0.5" />
                      Kopieren
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Action Buttons - Senden und Verbessern */}
            {!isTyping && (
              <motion.div 
                className="mt-3 flex justify-start gap-2"
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: 0.3,
                  duration: 0.4,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              >
                {/* Senden Button */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.1, ease: "easeOut" }}
                >
                  <Button
                    className="h-5 px-2.5 text-[10px] bg-light-gray hover:bg-light-gray/80 text-primary-black rounded-full font-medium transition-all duration-150 shadow-sm"
                    onClick={() => mutate()}
                    disabled={isPending}
                  >
                    <Send className="w-2.5 h-2.5 mr-1" />
                    Senden
                  </Button>
                </motion.div>

                {/* Verbessern Button */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.1, ease: "easeOut" }}
                >
                  <Button
                    className="h-5 px-2.5 text-[10px] bg-gray-blue hover:bg-gray-blue/80 text-creme-white rounded-full font-medium transition-all duration-150 shadow-sm"
                    onClick={handleImprove}
                  >
                    <Edit className="w-2.5 h-2.5 mr-1" />
                    Verbessern
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}