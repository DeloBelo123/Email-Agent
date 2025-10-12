"use client"

import { motion } from 'framer-motion'
import { Clock, Target, Users, TrendingUp, Shield, Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const benefits = [
  {
    icon: Clock,
    title: "Zeitersparnis",
    description: "80% weniger Zeit für E-Mail-Management",
    metric: "80%",
    color: "text-blue-500"
  },
  {
    icon: Target,
    title: "Keine verlorenen Leads",
    description: "Sofortige Benachrichtigung bei wichtigen E-Mails",
    metric: "0",
    color: "text-green-500"
  },
  {
    icon: Users,
    title: "Bessere Kundenbetreuung",
    description: "Professionelle, schnelle Antworten",
    metric: "24/7",
    color: "text-purple-500"
  },
  {
    icon: TrendingUp,
    title: "Mehr Abschlüsse",
    description: "Mehr Zeit für Verkaufsgespräche",
    metric: "+40%",
    color: "text-orange-500"
  }
]

export default function ModernInfo() {
  return (
    <section className="py-24 bg-gradient-to-b from-primary-black to-blueish-black/20">
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
            <Zap className="w-4 h-4 mr-2" />
            Warum Makler uns lieben
          </Badge>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-creme-white mb-6">
            <span className="block">Mehr Zeit für das</span>
            <span className="text-gray-blue">Wichtige</span>
          </h2>
          
          <p className="text-xl text-light-gray max-w-3xl mx-auto leading-relaxed">
            Unser KI-Agent übernimmt das komplette E-Mail-Management, damit du dich auf Verkaufen und Beraten konzentrieren kannst.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-blueish-black/40 backdrop-blur-sm border-light-gray/20 hover:border-gray-blue/50 transition-all duration-300 group hover:shadow-lg hover:shadow-gray-blue/10">
                <CardContent className="p-8 text-center">
                  {/* Icon with Animation */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                    className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-blue/20 to-blueish-black/40 flex items-center justify-center group-hover:shadow-lg transition-all duration-300`}
                  >
                    <benefit.icon className={`w-8 h-8 ${benefit.color}`} />
                  </motion.div>

                  {/* Metric */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-4xl font-bold text-creme-white mb-2"
                  >
                    {benefit.metric}
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-creme-white mb-3 group-hover:text-gray-blue transition-colors duration-300">
                    {benefit.title}
                  </h3>

                  {/* Description */}
                  <p className="text-light-gray leading-relaxed">
                    {benefit.description}
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
          className="text-center mt-16"
        >
          <Card className="bg-gradient-to-r from-blueish-black/60 to-primary-black/60 backdrop-blur-sm border-gray-blue/30 max-w-4xl mx-auto">
            <CardContent className="p-12">
              <Shield className="w-12 h-12 text-gray-blue mx-auto mb-6" />
              
              <h3 className="text-2xl font-bold text-creme-white mb-4">
                DSGVO-konform & sicher
              </h3>
              
              <p className="text-light-gray text-lg mb-8 max-w-2xl mx-auto">
                Alle Daten werden verschlüsselt verarbeitet und in Deutschland gehostet. 
                Keine Weitergabe an Dritte, volle Kontrolle über deine Kundendaten.
              </p>

              <div className="flex flex-wrap justify-center gap-4 text-sm text-light-gray">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  End-to-End Verschlüsselung
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Deutsche Server
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  DSGVO-konform
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Keine Datenweitergabe
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
