"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, ArrowRight, Mail, Clock, User, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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

export default function ModernDemo() {
  const [emails, setEmails] = useState<DemoEmail[]>([])
  const [selectedEmail, setSelectedEmail] = useState<DemoEmail | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadDemoData = async () => {
      try {
        const response = await fetch('/demo-data.json')
        const data = await response.json()
        setEmails(data.emails.slice(0, 4)) // Show only 4 emails for cleaner look
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
      'Leads': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Customers': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Landlord': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'Government': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'Cooperations': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      'Portal': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      'Spam': 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
    return colors[category] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'
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
      <section className="py-24 bg-primary-black">
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
    <section 
      className="py-24 bg-gradient-to-b from-blueish-black/20 to-primary-black"
      id="demo"
      aria-label="Live Demo des KI-Mail-Agents für Immobilienmakler"
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
            <Play className="w-4 h-4 mr-2" />
            Live Demo
          </Badge>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-creme-white mb-6">
            <span className="block">Live Demo</span>
            <span className="text-gray-blue">KI-Mail-Agent</span>
          </h2>
          
          <p className="text-xl text-light-gray max-w-3xl mx-auto leading-relaxed mb-8">
            Erlebe live, wie unser KI-Agent für Immobilienmakler E-Mails automatisch kategorisiert und beantwortet. Teste die intelligente E-Mail-Verwaltung kostenlos.
          </p>

          <Button 
            size="lg" 
            className="text-lg px-8 py-6 bg-gray-blue hover:bg-light-gray text-primary-black font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <Play className="w-5 h-5 mr-2" />
            Demo starten
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </Button>
        </motion.div>

        {/* Demo Interface */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Email List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="bg-blueish-black/40 backdrop-blur-sm border-light-gray/20">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-5 h-5 text-gray-blue" />
                    <h3 className="text-lg font-semibold text-creme-white">Posteingang</h3>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    Live
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {emails.map((email, index) => (
                  <motion.div
                    key={email.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                        selectedEmail?.id === email.id
                          ? 'bg-gray-blue/10 border-gray-blue/50 shadow-lg shadow-gray-blue/10'
                          : 'bg-primary-black/30 border-light-gray/20 hover:border-gray-blue/50 hover:bg-primary-black/50'
                      }`}
                      onClick={() => setSelectedEmail(email)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-light-gray" />
                            <span className="text-sm font-medium text-creme-white">{email.from}</span>
                            {email.urgent && (
                              <Badge variant="destructive" className="text-xs px-2 py-0.5">
                                Dringend
                              </Badge>
                            )}
                          </div>
                          <Badge 
                            variant="outline" 
                            className={`text-xs border ${getCategoryColor(email.category)}`}
                          >
                            {email.category}
                          </Badge>
                        </div>
                        
                        <h4 className="text-sm font-medium text-creme-white mb-2">{email.subject}</h4>
                        <p className="text-xs text-light-gray line-clamp-2 mb-2">{email.snippet}</p>
                        
                        <div className="flex items-center text-xs text-light-gray">
                          <Clock className="w-3 h-3 mr-1" />
                          {email.receivedAt}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* AI Response Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="bg-blueish-black/40 backdrop-blur-sm border-light-gray/20 h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-gray-blue" />
                    <h3 className="text-lg font-semibold text-creme-white">KI-Antwort</h3>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                    Aktiv
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <AnimatePresence mode="wait">
                  {selectedEmail ? (
                    <motion.div
                      key={selectedEmail.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      {/* Original Email */}
                      <Card className="bg-primary-black/50 border-light-gray/20">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-creme-white">Original E-Mail</span>
                            <Badge 
                              variant="outline" 
                              className={`text-xs border ${getCategoryColor(selectedEmail.category)}`}
                            >
                              {selectedEmail.category}
                            </Badge>
                          </div>
                          <h4 className="text-sm font-medium text-gray-blue mb-2">{selectedEmail.subject}</h4>
                          <p className="text-xs text-light-gray leading-relaxed">{selectedEmail.fullBody}</p>
                        </CardContent>
                      </Card>

                      {/* AI Response */}
                      <Card className="bg-gradient-to-br from-gray-blue/10 to-blueish-black/30 border-gray-blue/30">
                        <CardContent className="p-4">
                          <div className="flex items-center mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-gray-blue to-light-gray rounded-full flex items-center justify-center mr-3">
                              <Zap className="w-4 h-4 text-primary-black" />
                            </div>
                            <span className="text-sm font-medium text-creme-white">KI-Antwortvorschlag</span>
                          </div>
                          
                          <div className="bg-primary-black/30 rounded-lg p-4 mb-4">
                            <pre className="text-xs text-light-gray whitespace-pre-wrap font-sans leading-relaxed">
                              {generateAIResponse(selectedEmail)}
                            </pre>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <Button className="bg-gray-blue hover:bg-light-gray text-primary-black text-sm">
                              <Mail className="w-4 h-4 mr-2" />
                              Senden
                            </Button>
                            <Button variant="outline" className="text-sm border-gray-blue text-gray-blue hover:bg-gray-blue hover:text-primary-black">
                              Speichern
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-12"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-blue/20 to-blueish-black/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8 text-light-gray/50" />
                      </div>
                      <p className="text-light-gray">Wähle eine E-Mail aus, um die KI-Antwort zu sehen</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Card className="bg-gradient-to-r from-blueish-black/60 to-primary-black/60 backdrop-blur-sm border-gray-blue/30 max-w-4xl mx-auto">
            <CardContent className="p-12">
              <h3 className="text-2xl font-bold text-creme-white mb-4">
                Bereit für die echte Demo?
              </h3>
              <p className="text-light-gray text-lg mb-8 max-w-2xl mx-auto">
                Teste unser KI-System mit deinen eigenen E-Mails. Keine Installation, keine Verpflichtungen.
              </p>
              
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 bg-gray-blue hover:bg-light-gray text-primary-black font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                Jetzt Demo starten
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
              
              <p className="text-xs text-light-gray/60 mt-6">
                Demo-Daten sind Beispielinhalte und speichern keine echten Kundendaten.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
