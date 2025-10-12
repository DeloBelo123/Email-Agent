"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

const faqItems: FAQItem[] = [
  {
    question: "Wie sicher sind meine Daten?",
    answer: "Alle Daten werden DSGVO-konform verarbeitet und erst nach Ihrer ausdrücklichen Zustimmung verwendet. Wir bieten deutsche Datenhosting-Optionen und verschlüsseln alle Daten mit modernsten Standards. Ihre E-Mails werden niemals an Dritte weitergegeben."
  },
  {
    question: "Funktioniert das mit OnOffice?",
    answer: "Ja, wir bieten eine API-Integration mit OnOffice und anderen führenden CRM-Systemen. Unser Pilotprogramm ermöglicht es Ihnen, die Integration kostenlos zu testen. Wir unterstützen auch FlowFact, Immobilienscout24 und andere gängige Makler-Tools."
  },
  {
    question: "Wie lange dauert die Einrichtung?",
    answer: "Die Einrichtung dauert weniger als 10 Minuten. Sie verbinden einfach Ihre E-Mail-Adresse, wählen Ihre Kategorien aus und können sofort loslegen. Unser KI-System lernt automatisch aus Ihren E-Mails und wird mit der Zeit immer besser."
  },
  {
    question: "Kann ich die KI-Antworten anpassen?",
    answer: "Ja, Sie können die KI-Antworten vollständig anpassen. Unser System lernt Ihren Schreibstil und passt sich an Ihre Kommunikationsgewohnheiten an. Sie können auch Vorlagen erstellen und Antworten vor dem Versand überarbeiten."
  },
  {
    question: "Was passiert mit meinen alten E-Mails?",
    answer: "Ihre bestehenden E-Mails bleiben unverändert in Ihrem E-Mail-System. Unser KI-System arbeitet nur mit neuen eingehenden E-Mails. Sie können jedoch auch historische E-Mails zur Analyse hochladen, um bessere Kategorisierungen zu erhalten."
  },
  {
    question: "Gibt es eine kostenlose Testversion?",
    answer: "Ja, alle Pläne enthalten eine kostenlose Demo-Phase. Sie können das System 14 Tage lang ohne Verpflichtungen testen. In der Beta-Phase bieten wir sogar 3 Monate kostenlosen Zugang für Feedback und Verbesserungen."
  },
  {
    question: "Wie funktioniert die Kategorisierung?",
    answer: "Unser KI-System analysiert den Inhalt, Absender und Kontext jeder E-Mail und ordnet sie automatisch in 6 Hauptkategorien ein: Leads, Customers, Landlord, Government, Cooperations und Spam. Die Kategorisierung wird mit der Zeit immer präziser."
  },
  {
    question: "Kann ich das System im Team nutzen?",
    answer: "Ja, unser Maklerbüro-Plan unterstützt Team-Accounts mit individuellen Benutzerrechten. Jedes Teammitglied kann eigene Einstellungen haben, während die Verwaltung zentral erfolgt. Ideal für größere Maklerbüros mit mehreren Mitarbeitern."
  }
]

export default function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    )
  }

  return (
    <section className="py-20 bg-primary-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-creme-white mb-6">
            Häufige Fragen
          </h2>
          <p className="text-xl text-light-gray max-w-3xl mx-auto">
            Hier findest du Antworten auf die wichtigsten Fragen zu unserem KI-Mail-Agent.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-blueish-black/40 backdrop-blur-sm rounded-xl border border-light-gray/20 overflow-hidden"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-blueish-black/20 transition-colors duration-200"
                aria-expanded={openItems.includes(index)}
              >
                <h3 className="text-lg font-semibold text-creme-white pr-4">
                  {item.question}
                </h3>
                <div className="flex-shrink-0">
                  {openItems.includes(index) ? (
                    <ChevronUp className="w-5 h-5 text-gray-blue" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-blue" />
                  )}
                </div>
              </button>
              
              <AnimatePresence>
                {openItems.includes(index) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4">
                      <p className="text-light-gray leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="bg-blueish-black/20 backdrop-blur-sm rounded-xl p-8 border border-light-gray/20">
            <h3 className="text-xl font-semibold text-creme-white mb-4">
              Weitere Fragen?
            </h3>
            <p className="text-light-gray mb-6">
              Unser Support-Team hilft Ihnen gerne weiter. Kontaktieren Sie uns für eine persönliche Beratung.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@ki-mail-agent.de"
                className="inline-flex items-center justify-center px-6 py-3 bg-gray-blue text-primary-black rounded-lg font-semibold hover:bg-light-gray transition-all duration-300"
              >
                E-Mail schreiben
              </a>
              <a
                href="/demo"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-blue text-gray-blue rounded-lg font-semibold hover:bg-gray-blue hover:text-primary-black transition-all duration-300"
              >
                Demo buchen
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
