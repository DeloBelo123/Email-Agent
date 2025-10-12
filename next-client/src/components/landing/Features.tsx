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
  Workflow
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: "Intelligente E-Mail-Kategorisierung",
    description: "Automatische Zuordnung in 6 Kategorien: Leads, Besichtigungsanfragen, Kauf-/Mietinteresse, Portal-Anfragen, Website-Kontakte, Sofortige Benachrichtigung."
  },
  {
    icon: Users,
    title: "Customers (Bestehende Kunden)",
    description: "Nachfragen, Preisverhandlungen, Dokumentenanforderungen, Vertragsabschlüsse."
  },
  {
    icon: Building,
    title: "Landlord (Eigentümer)",
    description: "Verkaufsanfragen, Vermietungen, Marktwert-Einschätzungen."
  },
  {
    icon: FileText,
    title: "Government",
    description: "Behördenkorrespondenz, Notartermine, Banken."
  },
  {
    icon: Handshake,
    title: "Cooperations",
    description: "Fotografen, Handwerker, Home-Staging."
  },
  {
    icon: Shield,
    title: "Spam-Filterung",
    description: "Newsletter, Werbung klar aussortiert."
  },
  {
    icon: MessageSquare,
    title: "KI-E-Mail-Generator",
    description: "Chat-Interface, natürliche Spracheingabe, Vorschläge & Direktversand."
  },
  {
    icon: Workflow,
    title: "Workflow",
    description: "Prompt → KI generiert → Vorschau → Versand."
  }
]

export default function Features() {
  return (
    <section id="features" className="py-20 bg-blueish-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-creme-white mb-6">
            Kernfunktionen
          </h2>
          <p className="text-xl text-light-gray max-w-3xl mx-auto">
            Unser KI-System automatisiert dein komplettes E-Mail-Management und macht dich zum effizientesten Makler der Stadt.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-primary-black/50 backdrop-blur-sm rounded-xl p-6 border border-light-gray/10 hover:border-gray-blue/50 transition-all duration-300 h-full hover:shadow-lg hover:shadow-gray-blue/10">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-gray-blue/20 rounded-lg group-hover:bg-gray-blue/30 transition-colors duration-300">
                    <feature.icon className="w-6 h-6 text-gray-blue" />
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-creme-white mb-3 group-hover:text-gray-blue transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-light-gray text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* How it Works Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-creme-white mb-4">
              So funktioniert's
            </h3>
            <p className="text-light-gray max-w-2xl mx-auto">
              In 4 einfachen Schritten zu einem automatisierten E-Mail-Management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "E-Mail rein",
                description: "Deine E-Mails werden automatisch importiert und analysiert"
              },
              {
                step: "2", 
                title: "KI klassifiziert",
                description: "Intelligente Kategorisierung nach Wichtigkeit und Typ"
              },
              {
                step: "3",
                title: "Vorschlag erzeugt",
                description: "KI-generierte Antwortvorschläge für sofortige Bearbeitung"
              },
              {
                step: "4",
                title: "Senden / Speichern",
                description: "Direktversand oder Speicherung im CRM-System"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="relative">
                  <div className="w-16 h-16 bg-gray-blue text-primary-black rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {step.step}
                  </div>
                  {index < 3 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gray-blue/30 transform translate-x-4" />
                  )}
                </div>
                
                <h4 className="text-lg font-semibold text-creme-white mb-2">
                  {step.title}
                </h4>
                
                <p className="text-light-gray text-sm">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
