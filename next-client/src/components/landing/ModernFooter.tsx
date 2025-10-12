"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function ModernFooter() {
  return (
    <footer className="bg-gradient-to-b from-primary-black to-blueish-black/40 border-t border-light-gray/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-blue to-light-gray rounded-xl flex items-center justify-center">
                <span className="text-primary-black font-bold text-lg">KI</span>
              </div>
              <span className="text-2xl font-bold text-creme-white">MailAgent</span>
            </div>
            
            <p className="text-light-gray mb-8 max-w-md leading-relaxed">
              Der intelligente KI-Mail-Agent für Immobilienmakler. Automatisiere dein E-Mail-Management, kategorisiere E-Mails automatisch und verliere keine Leads mehr. Spare 80% Zeit bei der E-Mail-Verwaltung.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center text-light-gray hover:text-gray-blue transition-colors duration-200">
                <Mail className="w-5 h-5 mr-3 text-gray-blue" />
                <span>support@ki-mail-agent.de</span>
              </div>
              <div className="flex items-center text-light-gray hover:text-gray-blue transition-colors duration-200">
                <Phone className="w-5 h-5 mr-3 text-gray-blue" />
                <span>+49 (0) 30 12345678</span>
              </div>
              <div className="flex items-center text-light-gray hover:text-gray-blue transition-colors duration-200">
                <MapPin className="w-5 h-5 mr-3 text-gray-blue" />
                <span>Berlin, Deutschland</span>
              </div>
            </div>

            {/* Newsletter */}
            <Card className="bg-blueish-black/40 backdrop-blur-sm border-light-gray/20">
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-creme-white mb-2">
                  Newsletter abonnieren
                </h4>
                <p className="text-light-gray text-sm mb-4">
                  Erhalte Updates zu neuen Features und Tipps für effizientes E-Mail-Management.
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="E-Mail-Adresse"
                    className="flex-1 px-4 py-2 bg-primary-black/50 border border-light-gray/20 rounded-lg text-creme-white placeholder-light-gray focus:outline-none focus:border-gray-blue transition-colors duration-200"
                  />
                  <Button className="bg-gray-blue hover:bg-light-gray text-primary-black">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold text-creme-white mb-6">Produkt</h3>
            <ul className="space-y-4">
              <li>
                <Link href="#features" className="text-light-gray hover:text-gray-blue transition-colors duration-200 flex items-center group">
                  Features
                  <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </Link>
              </li>
              <li>
                <Link href="#demo" className="text-light-gray hover:text-gray-blue transition-colors duration-200 flex items-center group">
                  Demo
                  <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-light-gray hover:text-gray-blue transition-colors duration-200 flex items-center group">
                  Preise
                  <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </Link>
              </li>
              <li>
                <Link href="/demo" className="text-light-gray hover:text-gray-blue transition-colors duration-200 flex items-center group">
                  Demo starten
                  <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Legal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold text-creme-white mb-6">Rechtliches</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/datenschutz" className="text-light-gray hover:text-gray-blue transition-colors duration-200 flex items-center group">
                  Datenschutz
                  <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </Link>
              </li>
              <li>
                <Link href="/agb" className="text-light-gray hover:text-gray-blue transition-colors duration-200 flex items-center group">
                  AGB
                  <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </Link>
              </li>
              <li>
                <Link href="/impressum" className="text-light-gray hover:text-gray-blue transition-colors duration-200 flex items-center group">
                  Impressum
                  <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </Link>
              </li>
              <li>
                <Link href="/widerruf" className="text-light-gray hover:text-gray-blue transition-colors duration-200 flex items-center group">
                  Widerrufsrecht
                  <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </Link>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Social Media & Copyright */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 pt-8 border-t border-light-gray/20"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-4 mb-6 md:mb-0">
              <motion.a
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                className="w-12 h-12 bg-blueish-black/50 rounded-xl flex items-center justify-center hover:bg-gray-blue hover:text-primary-black transition-all duration-200"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                className="w-12 h-12 bg-blueish-black/50 rounded-xl flex items-center justify-center hover:bg-gray-blue hover:text-primary-black transition-all duration-200"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                className="w-12 h-12 bg-blueish-black/50 rounded-xl flex items-center justify-center hover:bg-gray-blue hover:text-primary-black transition-all duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                className="w-12 h-12 bg-blueish-black/50 rounded-xl flex items-center justify-center hover:bg-gray-blue hover:text-primary-black transition-all duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </motion.a>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-light-gray text-sm">
                © 2024 MailAgent. Alle Rechte vorbehalten.
              </p>
            </div>
          </div>
        </motion.div>

        {/* DSGVO Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-8"
        >
          <Card className="bg-blueish-black/20 backdrop-blur-sm border-light-gray/20">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-creme-white mb-2">
                    DSGVO-Hinweis
                  </h4>
                  <p className="text-xs text-light-gray/80 leading-relaxed">
                    Diese Demo speichert keine echten Kundendaten. Alle gezeigten E-Mails sind Beispieldaten. 
                    Bei der Nutzung unseres Produkts werden Ihre Daten DSGVO-konform verarbeitet und verschlüsselt gespeichert.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </footer>
  )
}
