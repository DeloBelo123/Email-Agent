"use client"

import { motion } from 'framer-motion'
import { 
  Brain, 
  Users, 
  Building, 
  FileText, 
  Handshake, 
  Shield, 
  MessageSquare,
  Workflow,
  Zap,
  CheckCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const features = [
  {
    icon: Brain,
    title: "Intelligente Kategorisierung",
    description: "Automatische Zuordnung in 6 Kategorien: Leads, Besichtigungsanfragen, Kauf-/Mietinteresse, Portal-Anfragen, Website-Kontakte.",
    highlight: "KI-gestützt"
  },
  {
    icon: Users,
    title: "Customer Management",
    description: "Nachfragen, Preisverhandlungen, Dokumentenanforderungen und Vertragsabschlüsse perfekt organisiert.",
    highlight: "Kundenfokus"
  },
  {
    icon: Building,
    title: "Landlord Services",
    description: "Verkaufsanfragen, Vermietungen und Marktwert-Einschätzungen automatisch priorisiert.",
    highlight: "Eigentümer"
  },
  {
    icon: FileText,
    title: "Government Relations",
    description: "Behördenkorrespondenz, Notartermine und Banken-Kommunikation strukturiert verwaltet.",
    highlight: "Behörden"
  },
  {
    icon: Handshake,
    title: "Cooperation Hub",
    description: "Fotografen, Handwerker und Home-Staging Partner nahtlos integriert.",
    highlight: "Partner"
  },
  {
    icon: Shield,
    title: "Smart Spam Filter",
    description: "Newsletter und Werbung werden intelligent aussortiert, nur relevante E-Mails erreichen dich.",
    highlight: "Sicher"
  },
  {
    icon: MessageSquare,
    title: "KI-Mail-Generator",
    description: "Chat-Interface mit natürlicher Spracheingabe, intelligente Vorschläge und Direktversand.",
    highlight: "Automatisch"
  },
  {
    icon: Workflow,
    title: "Workflow Automation",
    description: "Prompt → KI generiert → Vorschau → Versand. Dein kompletter E-Mail-Workflow automatisiert.",
    highlight: "Effizient"
  }
]

const workflowSteps = [
  {
    step: "1",
    title: "E-Mail rein",
    description: "Deine E-Mails werden automatisch importiert und in Echtzeit analysiert",
    icon: MessageSquare
  },
  {
    step: "2", 
    title: "KI klassifiziert",
    description: "Intelligente Kategorisierung nach Wichtigkeit, Absender und Inhalt",
    icon: Brain
  },
  {
    step: "3",
    title: "Vorschlag erzeugt",
    description: "KI-generierte Antwortvorschläge für sofortige Bearbeitung",
    icon: Zap
  },
  {
    step: "4",
    title: "Senden & Speichern",
    description: "Direktversand oder Speicherung im CRM-System",
    icon: CheckCircle
  }
]

export default function ModernFeatures() {
  return (
    <section 
      className="py-24 bg-gradient-to-b from-primary-black to-blueish-black/20"
      id="features"
      aria-label="KI-Features für Immobilienmakler"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <Badge variant="secondary" className="mb-6 px-4 py-2">
            <Brain className="w-4 h-4 mr-2" />
            Kernfunktionen
          </Badge>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-creme-white mb-6">
            <span className="block">KI-Features für</span>
            <span className="text-gray-blue">Immobilienmakler</span>
          </h2>
          
          <p className="text-xl text-light-gray max-w-3xl mx-auto leading-relaxed">
            Unser KI-System automatisiert dein komplettes E-Mail-Management für Immobilienmakler. Intelligente Kategorisierung, automatische Antworten und Lead-Management in einem Tool.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-blueish-black/40 backdrop-blur-sm border-light-gray/20 hover:border-gray-blue/50 transition-all duration-300 group hover:shadow-lg hover:shadow-gray-blue/10">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                      className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-blue/20 to-blueish-black/40 flex items-center justify-center group-hover:shadow-lg transition-all duration-300"
                    >
                      <feature.icon className="w-6 h-6 text-gray-blue" />
                    </motion.div>
                    
                    <Badge variant="outline" className="text-xs">
                      {feature.highlight}
                    </Badge>
                  </div>
                  
                  <CardTitle className="text-lg text-creme-white group-hover:text-gray-blue transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-light-gray text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* How it Works Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="secondary" className="mb-6 px-4 py-2">
            <Workflow className="w-4 h-4 mr-2" />
            So funktioniert's
          </Badge>
          
          <h3 className="text-3xl sm:text-4xl font-bold text-creme-white mb-4">
            In 4 einfachen Schritten zu mehr Effizienz
          </h3>
          
          <p className="text-lg text-light-gray max-w-2xl mx-auto">
            Von der eingehenden E-Mail bis zur automatischen Antwort – alles läuft reibungslos.
          </p>
        </motion.div>

        {/* Workflow Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {workflowSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Card className="h-full bg-gradient-to-br from-blueish-black/40 to-primary-black/40 backdrop-blur-sm border-light-gray/20 text-center group hover:border-gray-blue/50 transition-all duration-300">
                <CardContent className="p-8">
                  {/* Step Number */}
                  <div className="relative mb-6">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                      className="w-16 h-16 bg-gradient-to-br from-gray-blue to-light-gray text-primary-black rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto shadow-lg"
                    >
                      {step.step}
                    </motion.div>
                    
                    {/* Connecting Line */}
                    {index < workflowSteps.length - 1 && (
                      <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-gray-blue/50 to-transparent transform translate-x-4" />
                    )}
                  </div>

                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                    className="w-12 h-12 bg-gradient-to-br from-gray-blue/20 to-blueish-black/40 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-all duration-300"
                  >
                    <step.icon className="w-6 h-6 text-gray-blue" />
                  </motion.div>
                  
                  <h4 className="text-xl font-semibold text-creme-white mb-3">
                    {step.title}
                  </h4>
                  
                  <p className="text-light-gray text-sm leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <Card className="bg-gradient-to-r from-blueish-black/60 to-primary-black/60 backdrop-blur-sm border-gray-blue/30 max-w-4xl mx-auto">
            <CardContent className="p-12">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-blue/20 to-blueish-black/40 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-gray-blue" />
              </div>
              
              <h3 className="text-2xl font-bold text-creme-white mb-4">
                Bereit für die Revolution?
              </h3>
              
              <p className="text-light-gray text-lg mb-8 max-w-2xl mx-auto">
                Erlebe, wie KI dein E-Mail-Management transformiert. Mehr Zeit für das, was wirklich zählt.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-gray-blue to-light-gray text-primary-black rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Demo starten
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border-2 border-gray-blue text-gray-blue rounded-xl font-semibold text-lg hover:bg-gray-blue hover:text-primary-black transition-all duration-300"
                >
                  Preise ansehen
                </motion.button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
