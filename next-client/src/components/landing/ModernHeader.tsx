"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Menu, X, ArrowRight } from 'lucide-react'

export default function ModernHeader() {
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-primary-black/95 backdrop-blur-md shadow-lg border-b border-light-gray/20' 
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" role="navigation" aria-label="Hauptnavigation">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-3 text-creme-white font-bold text-xl group"
            aria-label="KI-Mail-Agent für Immobilienmakler - Zur Startseite"
            title="KI-Mail-Agent - Automatische E-Mail-Verwaltung für Immobilienmakler"
          >
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
              className="w-10 h-10 bg-gradient-to-br from-gray-blue to-light-gray rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300"
              aria-hidden="true"
            >
              <span className="text-primary-black font-bold text-lg">KI</span>
            </motion.div>
            <span className="group-hover:text-gray-blue transition-colors duration-300">MailAgent</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="#features" 
              className="text-light-gray hover:text-creme-white transition-colors duration-200 font-medium"
              title="KI-Features für Immobilienmakler"
            >
              Features
            </Link>
            <Link 
              href="#pricing" 
              className="text-light-gray hover:text-creme-white transition-colors duration-200 font-medium"
              title="Preise für KI-Mail-Agent"
            >
              Preise
            </Link>
            <Link 
              href="#contact" 
              className="text-light-gray hover:text-creme-white transition-colors duration-200 font-medium"
              title="Kontakt aufnehmen"
            >
              Kontakt
            </Link>
            
            {/* CTA Button */}
            <Link 
              href="/demo" 
              className="flex items-center px-6 py-2 bg-gradient-to-r from-gray-blue to-light-gray text-primary-black hover:shadow-lg hover:shadow-gray-blue/20 transition-all duration-300 font-semibold rounded-lg"
            >
              Demo starten
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg bg-blueish-black/50 hover:bg-blueish-black transition-colors duration-200"
              aria-label="Menü öffnen"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-creme-white" />
              ) : (
                <Menu className="w-6 h-6 text-creme-white" />
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
          className="md:hidden overflow-hidden bg-blueish-black/40 backdrop-blur-md rounded-lg mt-2 border border-light-gray/20"
        >
          <div className="px-4 py-6 space-y-4">
            <Link 
              href="#features" 
              className="block text-light-gray hover:text-creme-white transition-colors duration-200 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              href="#pricing" 
              className="block text-light-gray hover:text-creme-white transition-colors duration-200 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Preise
            </Link>
            <Link 
              href="#contact" 
              className="block text-light-gray hover:text-creme-white transition-colors duration-200 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Kontakt
            </Link>
            <div className="pt-4 border-t border-light-gray/20">
              <Link 
                href="/demo"
                className="flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-gray-blue to-light-gray text-primary-black font-semibold rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Demo starten
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </nav>
    </motion.header>
  )
}
