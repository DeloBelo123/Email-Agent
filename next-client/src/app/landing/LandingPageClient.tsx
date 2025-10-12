"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/landing/Header'
import ModernHero from '@/components/landing/ModernHero'
import ModernFeatures from '@/components/landing/ModernFeatures'
import ModernDemo from '@/components/landing/ModernDemo'
import ModernPricing from '@/components/landing/ModernPricing'
import ModernFooter from '@/components/landing/ModernFooter'
import StructuredData from '@/components/landing/StructuredData'

export default function LandingPageClient() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check for saved theme preference or default to dark mode
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    } else {
      setIsDark(false)
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    
    if (newTheme) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <>
      <StructuredData />
      <div className="min-h-screen bg-primary-black text-creme-white">
        <Header onToggleTheme={toggleTheme} isDark={isDark} />
        
        <main>
          <ModernHero />
          <ModernFeatures />
          <ModernDemo />
          <ModernPricing />
        </main>
        
        <ModernFooter />
      </div>
    </>
  )
}
