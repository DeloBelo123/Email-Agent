"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface ReplyData {
  to: string
  subject: string
  from: string
}

interface ReplyContextType {
  replyData: ReplyData | null
  setReplyData: (data: ReplyData | null) => void
  clearReplyData: () => void
}

const ReplyContext = createContext<ReplyContextType | undefined>(undefined)

export function ReplyProvider({ children }: { children: ReactNode }) {
  const [replyData, setReplyData] = useState<ReplyData | null>(null)

  const clearReplyData = () => {
    setReplyData(null)
  }

  return (
    <ReplyContext.Provider value={{ replyData, setReplyData, clearReplyData }}>
      {children}
    </ReplyContext.Provider>
  )
}

export function useReply() {
  const context = useContext(ReplyContext)
  if (context === undefined) {
    throw new Error('useReply must be used within a ReplyProvider')
  }
  return context
}
