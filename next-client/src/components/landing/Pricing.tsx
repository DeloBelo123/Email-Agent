"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, ArrowRight, Star } from 'lucide-react'
import PricingToggle from './PricingToggle'

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
}

const pricingPlans: PricingPlan[] = [
  {
    name: "Pilot (Beta)",
    description: "Für Einzelmakler",
    monthlyPrice: 19,
    yearlyPrice: 15,
    cta: "Pilot starten",
    ctaLink: "/demo",
    beta: true,
    features: [
      "KI-E-Mail-Kategorisierung",
      "6 intelligente Kategorien",
      "1 Mail-Inbox",
      "Basis-Support",
      "3 Monate Beta-Phase"
    ]
  },
  {
    name: "Einzelmakler",
    description: "Alle Kernfeatures",
    monthlyPrice: 49,
    yearlyPrice: 39,
    cta: "Jetzt testen",
    ctaLink: "/demo",
    popular: true,
    features: [
      "Alle Pilot-Features",
      "KI-E-Mail-Generator",
      "Chat-Interface",
      "1 Nutzer",
      "Demo-Support",
      "CRM-Integration"
    ]
  },
  {
    name: "Maklerbüro",
    description: "CRM-Add-on",
    monthlyPrice: 199,
    yearlyPrice: 159,
    cta: "Demo & Integration",
    ctaLink: "/contact",
    features: [
      "Alle Einzelmakler-Features",
      "Team-Accounts",
      "CRM-Sync (OnOffice/FlowFact)",
      "Priorisierung",
      "SLA-Support",
      "API-Zugang",
      "White-Label Option"
    ]
  }
]

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false)

  const handleToggle = (yearly: boolean) => {
    setIsYearly(yearly)
  }

  return (
    <section id="pricing" className="py-20 bg-blueish-black/20">
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
            Preise
          </h2>
          <p className="text-xl text-light-gray max-w-3xl mx-auto">
            Wähle den Plan, der zu deinem Maklerbüro passt. Alle Pläne enthalten eine kostenlose Demo-Phase.
          </p>
        </motion.div>

        {/* Pricing Toggle */}
        <PricingToggle isYearly={isYearly} onToggle={handleToggle} />

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative bg-primary-black/50 backdrop-blur-sm rounded-xl p-8 border transition-all duration-300 hover:shadow-lg hover:shadow-gray-blue/10 ${
                plan.popular
                  ? 'border-gray-blue shadow-lg shadow-gray-blue/20 scale-105'
                  : 'border-light-gray/20 hover:border-gray-blue/50'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gray-blue text-primary-black px-4 py-1 rounded-full text-sm font-medium flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Beliebt
                  </div>
                </div>
              )}

              {/* Beta Badge */}
              {plan.beta && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-green-500/20 text-green-400 px-4 py-1 rounded-full text-sm font-medium">
                    Beta
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-creme-white mb-2">{plan.name}</h3>
                <p className="text-light-gray mb-6">{plan.description}</p>
                
                <div className="flex items-center justify-center">
                  <span className="text-4xl font-bold text-creme-white">
                    {isYearly ? plan.yearlyPrice : plan.monthlyPrice}€
                  </span>
                  <span className="text-light-gray ml-2">
                    /{isYearly ? 'Jahr' : 'Monat'}
                  </span>
                </div>
                
                {isYearly && (
                  <p className="text-sm text-green-400 mt-2">
                    Spare {((plan.monthlyPrice * 12 - plan.yearlyPrice) / (plan.monthlyPrice * 12) * 100).toFixed(0)}% pro Jahr
                  </p>
                )}
              </div>

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
              <motion.a
                href={plan.ctaLink}
                className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gray-blue text-primary-black hover:bg-light-gray shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                    : 'border-2 border-gray-blue text-gray-blue hover:bg-gray-blue hover:text-primary-black'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {plan.cta}
                <ArrowRight className="inline w-4 h-4 ml-2" />
              </motion.a>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="bg-blueish-black/20 backdrop-blur-sm rounded-xl p-8 border border-light-gray/20">
            <h3 className="text-xl font-semibold text-creme-white mb-4">
              Alle Pläne enthalten
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-light-gray">
              <div className="flex items-center justify-center">
                <Check className="w-4 h-4 text-gray-blue mr-2" />
                Kostenlose Demo-Phase
              </div>
              <div className="flex items-center justify-center">
                <Check className="w-4 h-4 text-gray-blue mr-2" />
                DSGVO-konforme Datenverarbeitung
              </div>
              <div className="flex items-center justify-center">
                <Check className="w-4 h-4 text-gray-blue mr-2" />
                Keine Setup-Gebühren
              </div>
            </div>
            
            <p className="text-xs text-light-gray/60 mt-6">
              Kündigung jederzeit möglich. Keine versteckten Kosten. Alle Preise verstehen sich zzgl. MwSt.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
