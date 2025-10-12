"use client"

import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Mail, Clock, TrendingUp, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useState, useEffect } from 'react'

export default function ModernHero() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 300], [0, -50])
  const opacity = useTransform(scrollY, [0, 300], [1, 0.8])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-black via-blueish-black/30 to-primary-black"
      aria-label="KI-Mail-Agent für Immobilienmakler - Hauptbereich"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Email Icons */}
        {isClient && [...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 1200,
              y: Math.random() * 800,
              opacity: 0.1
            }}
            animate={{ 
              y: [null, -100],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "easeInOut"
            }}
            className="absolute"
          >
            <Mail className="w-8 h-8 text-gray-blue/20" />
          </motion.div>
        ))}
      </div>

      <motion.div 
        style={{ y, opacity }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20"
      >
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
                <Zap className="w-4 h-4 mr-2" />
                KI-Revolution für Makler
              </Badge>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-creme-white leading-tight mb-6"
            >
              <span className="block">80% weniger Zeit</span>
              <span className="block text-gray-blue">für E-Mails</span>
              <span className="block">mehr Zeit für</span>
              <motion.span 
                className="text-gray-blue"
                animate={{ 
                  backgroundPosition: ["0%", "100%", "0%"]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  background: "linear-gradient(90deg, #64748b, #e0e1dd, #64748b)",
                  backgroundSize: "200% 100%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}
              >
                Abschlüsse
              </motion.span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl sm:text-2xl text-light-gray mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              Der erste KI-Agent für Immobilienmakler, der deine E-Mails automatisch kategorisiert, priorisiert und beantwortet. Spare 80% Zeit bei der E-Mail-Verwaltung und gewinne mehr Immobilien-Kunden.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
            >
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 bg-gray-blue hover:bg-light-gray text-primary-black font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                title="Kostenlose Demo des KI-Mail-Agents für Immobilienmakler"
              >
                Demo starten
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="text-lg px-8 py-6 border-2 border-gray-blue text-gray-blue hover:bg-gray-blue hover:text-primary-black font-semibold"
                title="Mehr über KI-Mail-Agent für Immobilienmakler erfahren"
              >
                Mehr erfahren
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-3 gap-8"
            >
              <div className="text-center lg:text-left">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                  className="flex items-center justify-center lg:justify-start mb-2"
                >
                  <Clock className="w-6 h-6 text-gray-blue mr-2" />
                  <span className="text-3xl font-bold text-creme-white">80%</span>
                </motion.div>
                <p className="text-light-gray text-sm">Zeitersparnis</p>
              </div>
              
              <div className="text-center lg:text-left">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  className="flex items-center justify-center lg:justify-start mb-2"
                >
                  <TrendingUp className="w-6 h-6 text-gray-blue mr-2" />
                  <span className="text-3xl font-bold text-creme-white">0</span>
                </motion.div>
                <p className="text-light-gray text-sm">verlorene Leads</p>
              </div>
              
              <div className="text-center lg:text-left">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.4 }}
                  className="flex items-center justify-center lg:justify-start mb-2"
                >
                  <Mail className="w-6 h-6 text-gray-blue mr-2" />
                  <span className="text-3xl font-bold text-creme-white">24/7</span>
                </motion.div>
                <p className="text-light-gray text-sm">KI-Monitoring</p>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            {/* Main Dashboard Mockup */}
            <div className="relative">
              <motion.div
                animate={{ 
                  rotateY: [0, 5, 0],
                  scale: [1, 1.02, 1]
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="bg-blueish-black/40 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-light-gray/20"
              >
                {/* Browser Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Live Demo
                  </Badge>
                </div>

                {/* Email List Animation */}
                <div className="space-y-3">
                  {[
                    { from: "Max Mustermann", subject: "Besichtigung gewünscht", urgent: true, category: "Leads" },
                    { from: "ImmobilienScout24", subject: "Neue Anfrage", urgent: false, category: "Portal" },
                    { from: "Maria Weber", subject: "Kaufpreis-Anfrage", urgent: true, category: "Customers" },
                    { from: "Fotograf Schmidt", subject: "Terminvereinbarung", urgent: false, category: "Cooperations" },
                  ].map((email, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 1.5 + index * 0.2 }}
                      className="bg-primary-black/50 rounded-xl p-4 border border-light-gray/10 hover:border-gray-blue/50 transition-all duration-200 group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm font-medium text-creme-white">{email.from}</span>
                            {email.urgent && (
                              <Badge variant="destructive" className="text-xs px-2 py-0.5">
                                Dringend
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-light-gray group-hover:text-creme-white transition-colors">
                            {email.subject}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {email.category}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                animate={{ 
                  y: [-10, 10, -10],
                  rotate: [-2, 2, -2]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-4 -right-4 bg-gray-blue text-primary-black p-3 rounded-full shadow-lg"
              >
                <Zap className="w-6 h-6" />
              </motion.div>

              <motion.div
                animate={{ 
                  y: [10, -10, 10],
                  rotate: [2, -2, 2]
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute -bottom-4 -left-4 bg-green-500 text-white p-3 rounded-full shadow-lg"
              >
                <TrendingUp className="w-6 h-6" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-light-gray/30 rounded-full flex justify-center"
        >
          <div className="w-1 h-3 bg-gray-blue rounded-full mt-2" />
        </motion.div>
      </motion.div>
    </section>
  )
}
