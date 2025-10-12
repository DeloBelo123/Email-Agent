"use client"

import { useState, ReactNode, useEffect } from "react"
import { motion, AnimatePresence, PanInfo } from "framer-motion"
import { PageIndicator } from "./PageIndicator"

interface SwipeContainerProps {
  children: ReactNode[]
  currentPage?: number
  onPageChange?: (page: number) => void
}

export function SwipeContainer({ children, currentPage: externalCurrentPage, onPageChange }: SwipeContainerProps) {
  const [internalCurrentPage, setInternalCurrentPage] = useState(0)
  const currentPage = externalCurrentPage !== undefined ? externalCurrentPage : internalCurrentPage
  const [direction, setDirection] = useState(0)
  const [showIndicator, setShowIndicator] = useState(false)

  const totalPages = children.length

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        // Pfeil links = vorherige Page (wie Swipe rechts)
        if (currentPage > 0) {
          const newPage = currentPage - 1
          const newDirection = -1
          if (onPageChange) {
            onPageChange(newPage)
          } else {
            setInternalCurrentPage(newPage)
          }
          setDirection(newDirection)
          setShowIndicator(true)
          console.log(`⌨️ Arrow Left: Page ${currentPage} → ${newPage}`)
          
          setTimeout(() => setShowIndicator(false), 2000)
        } else {
          console.log(`🚫 Already at first page (${currentPage}), cannot go left`)
        }
      } else if (event.key === 'ArrowRight') {
        // Pfeil rechts = nächste Page (wie Swipe links)
        if (currentPage < totalPages - 1) {
          const newPage = currentPage + 1
          const newDirection = 1
          if (onPageChange) {
            onPageChange(newPage)
          } else {
            setInternalCurrentPage(newPage)
          }
          setDirection(newDirection)
          setShowIndicator(true)
          console.log(`⌨️ Arrow Right: Page ${currentPage} → ${newPage}`)
          
          setTimeout(() => setShowIndicator(false), 2000)
        } else {
          console.log(`🚫 Already at last page (${currentPage}), cannot go right`)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentPage, totalPages])

  const handleDragEnd = (event: any, info: PanInfo) => {
    const { offset, velocity } = info
    const swipeThreshold = 50
    const velocityThreshold = 500

    console.log(`🎯 Drag End - Offset: ${offset.x}, Velocity: ${velocity.x}`)
    console.log(`📊 Current Page: ${currentPage}/${totalPages - 1}`)

    let newPage = currentPage
    let newDirection = 0

    // Swipe nach links (drag von rechts nach links) = nächste Page (+1)
    if (offset.x < -swipeThreshold || velocity.x < -velocityThreshold) {
      if (currentPage < totalPages - 1) {
        newPage = currentPage + 1
        newDirection = 1
        console.log(`⬅️ Swipe Left: Page ${currentPage} → ${newPage}`)
      } else {
        console.log(`🚫 Already at last page (${currentPage}), cannot swipe left`)
      }
    }
    // Swipe nach rechts (drag von links nach rechts) = vorherige Page (-1)
    else if (offset.x > swipeThreshold || velocity.x > velocityThreshold) {
      if (currentPage > 0) {
        newPage = currentPage - 1
        newDirection = -1
        console.log(`➡️ Swipe Right: Page ${currentPage} → ${newPage}`)
      } else {
        console.log(`🚫 Already at first page (${currentPage}), cannot swipe right`)
      }
    } else {
      console.log(`❌ Swipe not strong enough - Offset: ${offset.x}, Velocity: ${velocity.x}`)
    }

    // Page-Wechsel nur wenn sich etwas geändert hat
    if (newPage !== currentPage) {
      if (onPageChange) {
        onPageChange(newPage)
      } else {
        setInternalCurrentPage(newPage)
      }
      setDirection(newDirection)
      setShowIndicator(true)
      
      console.log(`✅ Page transition: ${currentPage} → ${newPage} (direction: ${newDirection})`)
      
      // Indicator nach 2 Sekunden ausblenden
      setTimeout(() => {
        setShowIndicator(false)
      }, 2000)
    } else {
      console.log(`🔄 No page change needed`)
    }
  }

  // Animation-Varianten für Page-Transitions
  const pageVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  }

  const pageTransition = {
    x: { type: "spring" as const, stiffness: 300, damping: 30 },
    opacity: { duration: 0.2 }
  }

  console.log(`📊 Current State: Page ${currentPage}/${totalPages - 1}, Direction: ${direction}`)

  return (
    <div className="relative w-full h-full overflow-hidden bg-primary-black">
      {/* Page Indicator */}
      <PageIndicator 
        currentPage={currentPage} 
        totalPages={totalPages} 
        isVisible={showIndicator} 
      />
      
      
      {/* Swipe Container mit AnimatePresence */}
      <motion.div
        className="relative w-full h-full"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        dragMomentum={false}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentPage}
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={pageTransition}
            className="absolute inset-0 w-full h-full"
          >
            <div className="w-full h-full bg-primary-black">
              {children[currentPage]}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
      
      {/* Swipe Hint */}
      {currentPage === 0 && !showIndicator && (
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-40"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center gap-2 text-light-gray/70 dark:text-white text-sm animate-pulse">
            <span>←</span>
            <span>Swipe to navigate</span>
            <span>→</span>
          </div>
        </motion.div>
      )}
    </div>
  )
}