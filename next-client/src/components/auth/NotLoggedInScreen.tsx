"use client"

import { Mail, Lock, ArrowRight, UserPlus, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase,OAuthLogin } from '../../../myLibUI/Backend/supabase/supabase'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function NotLoggedInScreen() {
  const [isLockHovered, setIsLockHovered] = useState(false)

  // Container variants for stagger animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  }

  // Child variants for individual elements
  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1
    }
  }

  // Icon variants with special animation
  const iconVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0,
      rotate: -180
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.5,
        ease: "backOut",
        delay: 0.05
      }
    }
  }
  return (
    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary-black via-blueish-black/30 to-primary-black p-8">
      <motion.div 
        className="text-center max-w-2xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Icon with hover animation */}
        <div 
          className="w-24 h-24 bg-gray-blue/20 rounded-full flex items-center justify-center mx-auto mb-8 cursor-pointer"
          onMouseEnter={() => setIsLockHovered(true)}
          onMouseLeave={() => setIsLockHovered(false)}
        >
          <motion.div
            whileHover={{ 
              scale: 1.1,
              rotate: [0, -10, 10, -10, 0],
              transition: { duration: 0.5 }
            }}
            whileTap={{ scale: 0.95 }}
            animate={isLockHovered ? {
              y: [0, -1, 0],
              transition: { duration: 0.3, repeat: 2 }
            } : {}}
          >
            <Lock className="w-12 h-12 text-gray-blue" />
          </motion.div>
        </div>

        {/* Title */}
        <motion.h1 
          className="text-4xl font-bold text-creme-white mb-4"
          variants={itemVariants}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          Anmeldung erforderlich
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          className="text-xl text-light-gray mb-8 leading-relaxed"
          variants={itemVariants}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          Um deine E-Mails zu verwalten und die KI-Features zu nutzen, musst du dich anmelden.
        </motion.p>

        {/* Action Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          variants={itemVariants}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              size="lg"
              className="text-lg px-8 py-6 bg-gray-blue hover:bg-light-gray text-primary-black font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
              onClick={async () => await OAuthLogin({provider:"google",scopes:["https://mail.google.com/"],redirectTo:window.location.origin})}
            >
              <LogIn className="w-5 h-5 mr-2" />
              Anmelden
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 border-2 border-gray-blue text-gray-blue hover:bg-gray-blue hover:text-primary-black font-semibold"
              onClick={() => {
                // Hier würde normalerweise der Registrierungsprozess starten
                console.log("Register clicked")
              }}
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Kostenlos registrieren
            </Button>
          </motion.div>
        </motion.div>

        {/* Security Note */}
        <motion.div 
          className="mt-6 flex items-center justify-center gap-2 text-xs text-light-gray"
          variants={itemVariants}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Lock className="w-4 h-4" />
          <span>DSGVO-konform • Deutsche Server • Verschlüsselt</span>
        </motion.div>
      </motion.div>
    </div>
  )
}



