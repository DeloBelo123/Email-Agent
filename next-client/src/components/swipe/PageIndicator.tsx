"use client"

import { useState, useEffect } from "react"

interface PageIndicatorProps {
  currentPage: number
  totalPages: number
  isVisible: boolean
}

export function PageIndicator({ currentPage, totalPages, isVisible }: PageIndicatorProps) {
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true)
      // Auto-hide after 2 seconds
      const timer = setTimeout(() => {
        setShouldRender(false)
      }, 2000)
      return () => clearTimeout(timer)
    } else {
      setShouldRender(false)
    }
  }, [isVisible])

  if (!shouldRender) return null

  return (
    <div 
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}
    >
      <div className="flex items-center gap-1.5 bg-primary-black/60 dark:bg-primary-black/80 backdrop-blur-sm rounded-full px-2 py-1 border border-gray-300/20 dark:border-gray-600/30">
        {Array.from({ length: totalPages }, (_, index) => (
          <div
            key={index}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              index === currentPage
                ? 'bg-creme-white dark:bg-creme-white scale-125 shadow-sm'
                : 'bg-gray-400/60 dark:bg-gray-500/60 hover:bg-gray-500/80 dark:hover:bg-gray-400/80'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
