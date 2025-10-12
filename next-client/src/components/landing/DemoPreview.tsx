"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Clock, User, ArrowRight, Save } from 'lucide-react'

interface DemoEmail {
  id: string
  from: string
  subject: string
  snippet: string
  category: string
  receivedAt: string
  fullBody: string
  urgent: boolean
}

export default function DemoPreview() {
  const [emails, setEmails] = useState<DemoEmail[]>([])
  const [selectedEmail, setSelectedEmail] = useState<DemoEmail | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load demo data
    const loadDemoData = async () => {
      try {
        const response = await fetch('/demo-data.json')
        const data = await response.json()
        setEmails(data.emails)
        setIsLoading(false)
      } catch (error) {
        console.error('Error loading demo data:', error)
        setIsLoading(false)
      }
    }

    loadDemoData()
  }, [])

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Leads': 'bg-green-500/20 text-green-400',
      'Customers': 'bg-blue-500/20 text-blue-400',
      'Landlord': 'bg-purple-500/20 text-purple-400',
      'Government': 'bg-orange-500/20 text-orange-400',
      'Cooperations': 'bg-pink-500/20 text-pink-400',
      'Portal': 'bg-cyan-500/20 text-cyan-400',
      'Spam': 'bg-gray-500/20 text-gray-400'
    }
    return colors[category] || 'bg-gray-500/20 text-gray-400'
  }

  const generateAIResponse = (email: DemoEmail) => {
    const responses: { [key: string]: string } = {
      'Leads': `Sehr geehrte/r ${email.from.split(' ')[0]},\n\nvielen Dank für Ihr Interesse an unserer Immobilie. Gerne können wir einen Besichtigungstermin vereinbaren. Bitte teilen Sie mir Ihre bevorzugten Zeiten mit.\n\nMit freundlichen Grüßen\nIhr Makler`,
      'Customers': `Hallo ${email.from.split(' ')[0]},\n\nvielen Dank für Ihre Nachfrage. Ich prüfe die Details und melde mich zeitnah bei Ihnen zurück.\n\nBeste Grüße`,
      'Landlord': `Sehr geehrte/r ${email.from.split(' ')[0]},\n\nvielen Dank für Ihre Anfrage. Ich analysiere die Marktsituation und erstelle Ihnen ein detailliertes Angebot.\n\nMit freundlichen Grüßen`,
      'Government': `Sehr geehrte Damen und Herren,\n\nvielen Dank für Ihre Mitteilung. Ich werde die erforderlichen Unterlagen zeitnah einreichen.\n\nMit freundlichen Grüßen`,
      'Cooperations': `Hallo ${email.from.split(' ')[0]},\n\ngerne können wir einen Termin vereinbaren. Bitte lassen Sie mir Ihre Verfügbarkeit zukommen.\n\nBeste Grüße`
    }
    return responses[email.category] || 'Vielen Dank für Ihre Nachricht. Ich melde mich zeitnah bei Ihnen.'
  }

  if (isLoading) {
    return (
      <section id="demo" className="py-20 bg-primary-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-blue mx-auto"></div>
            <p className="mt-4 text-light-gray">Demo wird geladen...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="demo" className="py-20 bg-primary-black">
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
            Live Demo
          </h2>
          <p className="text-xl text-light-gray max-w-3xl mx-auto mb-8">
            Erlebe unser KI-System in Aktion. Klicke auf eine E-Mail, um die automatische Antwortgenerierung zu sehen.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Email List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-blueish-black/40 backdrop-blur-sm rounded-xl p-6 border border-light-gray/20"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-creme-white">Posteingang</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-light-gray">Live</span>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {emails.map((email, index) => (
                <motion.div
                  key={email.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                    selectedEmail?.id === email.id
                      ? 'border-gray-blue bg-gray-blue/10'
                      : 'border-light-gray/20 bg-primary-black/30 hover:border-gray-blue/50 hover:bg-primary-black/50'
                  }`}
                  onClick={() => setSelectedEmail(email)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-light-gray" />
                      <span className="text-sm font-medium text-creme-white">{email.from}</span>
                      {email.urgent && (
                        <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">
                          Dringend
                        </span>
                      )}
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(email.category)}`}>
                      {email.category}
                    </span>
                  </div>
                  
                  <h4 className="text-sm font-medium text-creme-white mb-1">{email.subject}</h4>
                  <p className="text-xs text-light-gray line-clamp-2">{email.snippet}</p>
                  
                  <div className="flex items-center mt-2 text-xs text-light-gray">
                    <Clock className="w-3 h-3 mr-1" />
                    {email.receivedAt}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* AI Response Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-blueish-black/40 backdrop-blur-sm rounded-xl p-6 border border-light-gray/20"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-creme-white">KI-Antwortvorschau</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-light-gray">KI aktiv</span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {selectedEmail ? (
                <motion.div
                  key={selectedEmail.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Original Email */}
                  <div className="bg-primary-black/50 rounded-lg p-4 border border-light-gray/20">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-creme-white">Original E-Mail</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(selectedEmail.category)}`}>
                        {selectedEmail.category}
                      </span>
                    </div>
                    <h4 className="text-sm font-medium text-gray-blue mb-2">{selectedEmail.subject}</h4>
                    <p className="text-xs text-light-gray">{selectedEmail.fullBody}</p>
                  </div>

                  {/* AI Response */}
                  <div className="bg-gray-blue/10 rounded-lg p-4 border border-gray-blue/30">
                    <div className="flex items-center mb-3">
                      <div className="w-6 h-6 bg-gray-blue rounded-full flex items-center justify-center mr-2">
                        <span className="text-xs font-bold text-primary-black">KI</span>
                      </div>
                      <span className="text-sm font-medium text-creme-white">KI-Antwortvorschlag</span>
                    </div>
                    <div className="bg-primary-black/30 rounded p-3 mb-4">
                      <pre className="text-xs text-light-gray whitespace-pre-wrap font-sans">
                        {generateAIResponse(selectedEmail)}
                      </pre>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-blue text-primary-black rounded-lg hover:bg-light-gray transition-colors duration-200 text-sm font-medium">
                        <Mail className="w-4 h-4 mr-2" />
                        Senden
                      </button>
                      <button className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-blue text-gray-blue rounded-lg hover:bg-gray-blue hover:text-primary-black transition-colors duration-200 text-sm font-medium">
                        <Save className="w-4 h-4 mr-2" />
                        Speichern
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12"
                >
                  <Mail className="w-12 h-12 text-light-gray/50 mx-auto mb-4" />
                  <p className="text-light-gray">Wähle eine E-Mail aus, um die KI-Antwort zu sehen</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="bg-blueish-black/20 backdrop-blur-sm rounded-xl p-8 border border-light-gray/20">
            <h3 className="text-2xl font-bold text-creme-white mb-4">
              Bereit für die echte Demo?
            </h3>
            <p className="text-light-gray mb-6 max-w-2xl mx-auto">
              Teste unser KI-System mit deinen eigenen E-Mails. Keine Installation, keine Verpflichtungen.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/demo"
                className="group inline-flex items-center justify-center px-8 py-4 bg-gray-blue text-primary-black rounded-lg font-semibold hover:bg-light-gray transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Zur Demo
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </a>
            </div>
            
            <p className="text-xs text-light-gray/60 mt-4">
              Demo-Daten sind Beispielinhalte und speichern keine echten Kundendaten.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
