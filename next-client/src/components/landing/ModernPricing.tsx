"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, ArrowRight, Star, Zap, Crown, Building } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface PricingPlan {
  name: string
  description: string
  monthlyPrice: number
  yearlyPrice: number
  cta: string
  ctaLink: string
  features: string[]
  popular?: boolean
  beta?: boolean
  icon: any
  color: string
}

const pricingPlans: PricingPlan[] = [
  {
    name: "Pilot",
    description: "Für Einzelmakler",
    monthlyPrice: 19,
    yearlyPrice: 15,
    cta: "Pilot starten",
    ctaLink: "/demo",
    beta: true,
    icon: Zap,
    color: "from-green-500 to-emerald-500",
    features: [
      "KI-E-Mail-Kategorisierung",
      "6 intelligente Kategorien",
      "1 Mail-Inbox",
      "Basis-Support",
      "3 Monate Beta-Phase",
      "DSGVO-konform"
    ]
  },
  {
    name: "Professional",
    description: "Alle Kernfeatures",
    monthlyPrice: 49,
    yearlyPrice: 39,
    cta: "Jetzt testen",
    ctaLink: "/demo",
    popular: true,
    icon: Star,
    color: "from-blue-500 to-cyan-500",
    features: [
      "Alle Pilot-Features",
      "KI-E-Mail-Generator",
      "Chat-Interface",
      "1 Nutzer",
      "Demo-Support",
      "CRM-Integration",
      "API-Zugang",
      "Priorisierung"
    ]
  },
  {
    name: "Enterprise",
    description: "CRM-Add-on",
    monthlyPrice: 199,
    yearlyPrice: 159,
    cta: "Demo & Integration",
    ctaLink: "/contact",
    icon: Building,
    color: "from-purple-500 to-pink-500",
    features: [
      "Alle Professional-Features",
      "Team-Accounts",
      "CRM-Sync (OnOffice/FlowFact)",
      "SLA-Support",
      "White-Label Option",
      "Dedicated Support",
      "Custom Integration",
      "Advanced Analytics"
    ]
  }
]

export default function ModernPricing() {
  const [isYearly, setIsYearly] = useState(false)

  return (
    <section 
      className="py-24 bg-gradient-to-b from-blueish-black/20 to-primary-black"
      id="pricing"
      aria-label="Preise für KI-Mail-Agent Immobilienmakler"
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
            <Star className="w-4 h-4 mr-2" />
            Preise
          </Badge>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-creme-white mb-6">
            <span className="block">Preise für</span>
            <span className="text-gray-blue">KI-Mail-Agent</span>
          </h2>
          
          <p className="text-xl text-light-gray max-w-3xl mx-auto leading-relaxed mb-12">
            Wähle den perfekten Plan für dein Maklerbüro. Alle Pläne enthalten eine kostenlose Demo-Phase. Keine Setup-Gebühren, keine versteckten Kosten.
          </p>

          {/* Pricing Toggle */}
          <div className="flex items-center justify-center mb-16">
            <div className="flex items-center bg-blueish-black/40 rounded-xl p-1">
              <button
                onClick={() => setIsYearly(false)}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  !isYearly
                    ? 'bg-gray-blue text-primary-black shadow-sm'
                    : 'text-light-gray hover:text-creme-white'
                }`}
              >
                Monatlich
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                  isYearly
                    ? 'bg-gray-blue text-primary-black shadow-sm'
                    : 'text-light-gray hover:text-creme-white'
                }`}
              >
                Jährlich
                <Badge variant="secondary" className="ml-2 px-2 py-0.5 text-xs bg-green-500/20 text-green-400 border-green-500/30">
                  -20%
                </Badge>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Popular Badge */}
              {plan.popular && (
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10"
                >
                  <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 text-sm font-medium shadow-lg">
                    <Crown className="w-4 h-4 mr-2" />
                    Meistgenutzt
                  </Badge>
                </motion.div>
              )}

              {/* Beta Badge */}
              {plan.beta && (
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10"
                >
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2 text-sm font-medium">
                    <Zap className="w-4 h-4 mr-2" />
                    Beta
                  </Badge>
                </motion.div>
              )}

              <Card className={`h-full transition-all duration-300 hover:shadow-xl ${
                plan.popular
                  ? 'bg-gradient-to-br from-blueish-black/60 to-primary-black/40 border-gray-blue/50 shadow-lg shadow-gray-blue/10 scale-105'
                  : 'bg-blueish-black/40 backdrop-blur-sm border-light-gray/20 hover:border-gray-blue/50'
              }`}>
                <CardHeader className="text-center pb-4">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                    className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center shadow-lg`}
                  >
                    <plan.icon className="w-8 h-8 text-white" />
                  </motion.div>

                  <CardTitle className="text-2xl font-bold text-creme-white mb-2">
                    {plan.name}
                  </CardTitle>
                  
                  <CardDescription className="text-light-gray mb-6">
                    {plan.description}
                  </CardDescription>
                  
                  <div className="flex items-center justify-center mb-4">
                    <span className="text-5xl font-bold text-creme-white">
                      {isYearly ? plan.yearlyPrice : plan.monthlyPrice}€
                    </span>
                    <span className="text-light-gray ml-2 text-lg">
                      /{isYearly ? 'Jahr' : 'Monat'}
                    </span>
                  </div>
                  
                  {isYearly && (
                    <Badge variant="outline" className="text-green-400 border-green-500/30 mb-4">
                      Spare {((plan.monthlyPrice * 12 - plan.yearlyPrice) / (plan.monthlyPrice * 12) * 100).toFixed(0)}% pro Jahr
                    </Badge>
                  )}
                </CardHeader>
                
                <CardContent className="pt-0">
                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start">
                        <Check className="w-5 h-5 text-gray-blue mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-light-gray text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      className={`w-full py-6 text-lg font-semibold transition-all duration-300 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-gray-blue to-light-gray text-primary-black hover:shadow-xl shadow-lg'
                          : 'bg-gray-blue hover:bg-light-gray text-primary-black'
                      }`}
                    >
                      {plan.cta}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-blueish-black/60 to-primary-black/60 backdrop-blur-sm border-gray-blue/30 max-w-4xl mx-auto">
            <CardContent className="p-12">
              <h3 className="text-2xl font-bold text-creme-white mb-6">
                Alle Pläne enthalten
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="flex items-center justify-center">
                  <Check className="w-5 h-5 text-gray-blue mr-2" />
                  <span className="text-light-gray">Kostenlose Demo-Phase</span>
                </div>
                <div className="flex items-center justify-center">
                  <Check className="w-5 h-5 text-gray-blue mr-2" />
                  <span className="text-light-gray">DSGVO-konforme Datenverarbeitung</span>
                </div>
                <div className="flex items-center justify-center">
                  <Check className="w-5 h-5 text-gray-blue mr-2" />
                  <span className="text-light-gray">Keine Setup-Gebühren</span>
                </div>
              </div>
              
              <p className="text-sm text-light-gray/60 mb-8">
                Kündigung jederzeit möglich. Keine versteckten Kosten. Alle Preise verstehen sich zzgl. MwSt.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" className="border-gray-blue text-gray-blue hover:bg-gray-blue hover:text-primary-black">
                  Häufige Fragen
                </Button>
                <Button className="bg-gray-blue hover:bg-light-gray text-primary-black">
                  Kontakt aufnehmen
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
