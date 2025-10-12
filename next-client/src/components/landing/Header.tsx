"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Sun, Moon, Menu, X } from 'lucide-react'

interface HeaderProps {
  onToggleTheme: () => void
  isDark: boolean
}

export default function Header({ onToggleTheme, isDark }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-blueish-black ${
        isScrolled 
          ? 'bg-primary-black/95 backdrop-blur-md shadow-lg border-b' 
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" role="navigation" aria-label="Hauptnavigation">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-2 text-creme-white font-bold text-xl"
            aria-label="KI-Mail-Agent für Immobilienmakler - Zur Startseite"
            title="KI-Mail-Agent - Automatische E-Mail-Verwaltung für Immobilienmakler"
          >
            <div className="w-8 h-8 bg-gray-blue rounded-lg flex items-center justify-center" aria-hidden="true">
              <span className="text-primary-black font-bold text-sm">KI</span>
            </div>
            <span>MailAgent</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="#features" 
              className="text-light-gray hover:text-creme-white transition-colors duration-200"
              title="KI-Features für Immobilienmakler"
            >
              Features
            </Link>
            <Link 
              href="#demo" 
              className="text-light-gray hover:text-creme-white transition-colors duration-200"
              title="Live Demo des KI-Mail-Agents"
            >
              Demo
            </Link>
            <Link 
              href="#pricing" 
              className="text-light-gray hover:text-creme-white transition-colors duration-200"
              title="Preise für KI-Mail-Agent"
            >
              Preise
            </Link>
            
            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-lg bg-blueish-black/50 hover:bg-blueish-black transition-colors duration-200"
              aria-label={isDark ? 'Zu hellem Modus wechseln' : 'Zu dunklem Modus wechseln'}
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-creme-white" />
              ) : (
                <Moon className="w-5 h-5 text-creme-white" />
              )}
            </button>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <Link 
                href="#pricing"
                className="px-4 py-2 text-light-gray hover:text-creme-white transition-colors duration-200"
              >
                Preise
              </Link>
              <Link 
                href="/demo"
                className="px-6 py-2 bg-gray-blue text-primary-black rounded-lg hover:bg-light-gray transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Demo starten
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-lg bg-blueish-black/50 hover:bg-blueish-black transition-colors duration-200"
              aria-label={isDark ? 'Zu hellem Modus wechseln' : 'Zu dunklem Modus wechseln'}
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-creme-white" />
              ) : (
                <Moon className="w-5 h-5 text-creme-white" />
              )}
            </button>
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg bg-blueish-black/50 hover:bg-blueish-black transition-colors duration-200"
              aria-label="Menü öffnen"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-creme-white" />
              ) : (
                <Menu className="w-5 h-5 text-creme-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: isMobileMenuOpen ? 1 : 0, 
            height: isMobileMenuOpen ? 'auto' : 0 
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="md:hidden overflow-hidden bg-blueish-black/20 backdrop-blur-md rounded-lg mt-2"
        >
          <div className="px-4 py-4 space-y-4">
            <Link 
              href="#features" 
              className="block text-light-gray hover:text-creme-white transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              href="#demo" 
              className="block text-light-gray hover:text-creme-white transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Demo
            </Link>
            <Link 
              href="#pricing" 
              className="block text-light-gray hover:text-creme-white transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Preise
            </Link>
            <div className="pt-4 border-t border-light-gray/20">
              <Link 
                href="/demo"
                className="block w-full text-center px-6 py-3 bg-gray-blue text-primary-black rounded-lg hover:bg-light-gray transition-all duration-200 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Demo starten
              </Link>
            </div>
          </div>
        </motion.div>
      </nav>
    </motion.header>
  )
}
