"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Mail, Clock, TrendingUp } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blueish-black/20 via-primary-black to-blueish-black/30" />
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-creme-white leading-tight"
            >
              KI-Mail-Agent für{' '}
              <span className="text-gray-blue">Immobilienmakler</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-6 text-xl text-light-gray max-w-2xl mx-auto lg:mx-0"
            >
              E-Mails automatisch kategorisiert, priorisiert und beantwortet — verliere keine Leads mehr.
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-4 text-lg text-light-gray/80 max-w-2xl mx-auto lg:mx-0"
            >
              Automatisiere dein E-Mail-Management: schneller antworten, bessere Nachverfolgung, weniger Chaos.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link
                href="/demo"
                className="group inline-flex items-center justify-center px-8 py-4 bg-gray-blue text-primary-black rounded-lg font-semibold text-lg hover:bg-light-gray transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Demo starten
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              
              <Link
                href="#features"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-blue text-gray-blue rounded-lg font-semibold text-lg hover:bg-gray-blue hover:text-primary-black transition-all duration-300"
              >
                Mehr erfahren
              </Link>
            </motion.div>

            {/* Stats / Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8"
            >
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start mb-2">
                  <Clock className="w-6 h-6 text-gray-blue mr-2" />
                  <span className="text-2xl font-bold text-creme-white">80%</span>
                </div>
                <p className="text-light-gray">weniger Zeit im Mail-Handling</p>
              </div>
              
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start mb-2">
                  <TrendingUp className="w-6 h-6 text-gray-blue mr-2" />
                  <span className="text-2xl font-bold text-creme-white">0</span>
                </div>
                <p className="text-light-gray">verlorene Leads</p>
              </div>
              
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start mb-2">
                  <Mail className="w-6 h-6 text-gray-blue mr-2" />
                  <span className="text-2xl font-bold text-creme-white">6</span>
                </div>
                <p className="text-light-gray">intelligente Kategorien</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Demo Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="bg-blueish-black/40 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-light-gray/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-creme-white">Live Demo</h3>
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
              
              {/* Mock Email List */}
              <div className="space-y-3">
                {[
                  { from: "Max Mustermann", subject: "Besichtigungstermin gewünscht", category: "Leads", urgent: true },
                  { from: "ImmobilienScout24", subject: "Neue Anfrage für Wohnung", category: "Portal", urgent: false },
                  { from: "Fotograf Schmidt", subject: "Termin für Maklerfotos", category: "Cooperations", urgent: false },
                  { from: "Maria Weber", subject: "Nachfrage zu Kaufpreis", category: "Customers", urgent: true },
                ].map((email, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                    className="bg-primary-black/50 rounded-lg p-3 border border-light-gray/10 hover:border-gray-blue/50 transition-colors duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-creme-white">{email.from}</span>
                          {email.urgent && (
                            <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">
                              Dringend
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-light-gray">{email.subject}</p>
                      </div>
                      <span className="px-2 py-1 bg-gray-blue/20 text-gray-blue text-xs rounded-full">
                        {email.category}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-light-gray/20">
                <p className="text-xs text-light-gray/60 text-center">
                  Demo-Daten • Keine echten Kundendaten
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-light-gray/30 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-3 bg-gray-blue rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  )
}
