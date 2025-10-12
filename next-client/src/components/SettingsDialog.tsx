"use client"

import { useState, useEffect } from "react"
import { Dialog } from "./ui/dialog"
import { Button } from "./ui/button"
import { Sun, Moon, LogIn, User } from "lucide-react"
import { supabase,OAuthLogin } from "../../myLibUI/Backend/supabase/supabase"

interface SettingsDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsDialog({ isOpen, onClose }: SettingsDialogProps) {
  const [isDarkMode, setIsDarkMode] = useState(true) // Default to dark mode

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    
    // Toggle the 'dark' class on the HTML element
    if (newMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', newMode.toString())
    console.log("Dark mode toggled:", newMode)
  }

  // Initialize dark mode on component mount
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode')
    if (savedMode !== null) {
      const isDark = savedMode === 'true'
      setIsDarkMode(isDark)
      if (isDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    } else {
      // Default to dark mode if no preference saved
      document.documentElement.classList.add('dark')
    }
  }, [])

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Einstellungen">
      <div className="space-y-6">

        {/* Dark Mode Toggle */}
        <div className="bg-blueish-black/30 dark:bg-blueish-black/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-blue/20 rounded-lg">
                {isDarkMode ? (
                  <Moon className="w-5 h-5 text-gray-blue" />
                ) : (
                  <Sun className="w-5 h-5 text-yellow-500" />
                )}
              </div>
              <div>
                <span className="text-light-gray dark:text-creme-white font-medium block">
                  {isDarkMode ? "Dark Mode" : "Light Mode"}
                </span>
                <span className="text-xs text-light-gray">
                  {isDarkMode ? "Dunkles Design aktiv" : "Helles Design aktiv"}
                </span>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                isDarkMode ? 'bg-gray-blue' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${
                  isDarkMode ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Login Section */}
        <div className="bg-blueish-black/30 dark:bg-blueish-black/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-blue/20 rounded-lg">
                <User className="w-5 h-5 text-gray-blue" />
              </div>
              <div>
                <span className="text-light-gray dark:text-creme-white font-medium block">
                  Anmelden
                </span>
                <span className="text-xs text-light-gray">
                  Login to your account
                </span>
              </div>
            </div>
            <Button
              onClick={async () => await OAuthLogin({provider:"google",scopes:["https://mail.google.com/"],redirectTo:window.location.origin})}
              className="bg-gray-blue hover:bg-gray-blue/80 text-creme-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 hover:scale-105"
            >
              <LogIn className="w-4 h-4" />
              Anmelden
            </Button>
          </div>
        </div>

        {/* CRM Integration Section */}
        <div className="bg-blueish-black/30 dark:bg-blueish-black/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-blue/20 rounded-lg">
                <svg className="w-5 h-5 text-gray-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <span className="text-light-gray dark:text-creme-white font-medium block">
                  CRM-Integration
                </span>
                <span className="text-xs text-light-gray">
                  connect to your CRM
                </span>
              </div>
            </div>
            <Button
              onClick={() => {
                // Hier würde normalerweise zu den Docs navigiert werden
                console.log("Navigate to CRM integration docs")
              }}
              className="bg-gray-blue hover:bg-gray-blue/80 text-creme-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 hover:scale-105"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Documents
            </Button>
          </div>
        </div>
        
        <div className="text-xs text-center text-gray-blue dark:text-light-gray text-light-gray/60">
          Version 1.0.0 • Email Agent
        </div>
      </div>
    </Dialog>
  )
}
