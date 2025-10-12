"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-blueish-black/40 backdrop-blur-sm border-t border-light-gray/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gray-blue rounded-lg flex items-center justify-center">
                <span className="text-primary-black font-bold text-sm">KI</span>
              </div>
              <span className="text-xl font-bold text-creme-white">MailAgent</span>
            </div>
            
            <p className="text-light-gray mb-6 max-w-md">
              Der intelligente E-Mail-Agent für Immobilienmakler. Automatisiere dein E-Mail-Management und verliere keine Leads mehr.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center text-light-gray">
                <Mail className="w-4 h-4 mr-3 text-gray-blue" />
                <span>support@ki-mail-agent.de</span>
              </div>
              <div className="flex items-center text-light-gray">
                <Phone className="w-4 h-4 mr-3 text-gray-blue" />
                <span>+49 (0) 30 12345678</span>
              </div>
              <div className="flex items-center text-light-gray">
                <MapPin className="w-4 h-4 mr-3 text-gray-blue" />
                <span>Berlin, Deutschland</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold text-creme-white mb-4">Produkt</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#features" className="text-light-gray hover:text-gray-blue transition-colors duration-200">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#demo" className="text-light-gray hover:text-gray-blue transition-colors duration-200">
                  Demo
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-light-gray hover:text-gray-blue transition-colors duration-200">
                  Preise
                </Link>
              </li>
              <li>
                <Link href="/demo" className="text-light-gray hover:text-gray-blue transition-colors duration-200">
                  Demo starten
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
            <h3 className="text-lg font-semibold text-creme-white mb-4">Rechtliches</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/datenschutz" className="text-light-gray hover:text-gray-blue transition-colors duration-200">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link href="/agb" className="text-light-gray hover:text-gray-blue transition-colors duration-200">
                  AGB
                </Link>
              </li>
              <li>
                <Link href="/impressum" className="text-light-gray hover:text-gray-blue transition-colors duration-200">
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="/widerruf" className="text-light-gray hover:text-gray-blue transition-colors duration-200">
                  Widerrufsrecht
                </Link>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Social Media */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-8 pt-8 border-t border-light-gray/20"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-4 mb-4 md:mb-0">
              <a
                href="#"
                className="w-10 h-10 bg-blueish-black/50 rounded-lg flex items-center justify-center hover:bg-gray-blue hover:text-primary-black transition-all duration-200"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-blueish-black/50 rounded-lg flex items-center justify-center hover:bg-gray-blue hover:text-primary-black transition-all duration-200"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-blueish-black/50 rounded-lg flex items-center justify-center hover:bg-gray-blue hover:text-primary-black transition-all duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-blueish-black/50 rounded-lg flex items-center justify-center hover:bg-gray-blue hover:text-primary-black transition-all duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
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
          className="mt-6 pt-6 border-t border-light-gray/20"
        >
          <div className="bg-blueish-black/20 rounded-lg p-4">
            <p className="text-xs text-light-gray/80 text-center">
              <strong>DSGVO-Hinweis:</strong> Diese Demo speichert keine echten Kundendaten. 
              Alle gezeigten E-Mails sind Beispieldaten. Bei der Nutzung unseres Produkts 
              werden Ihre Daten DSGVO-konform verarbeitet und verschlüsselt gespeichert.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
