import { Button } from "@/components/ui/button"
import { Mail, Send, Trash2, Plus, Search } from "lucide-react"

export function ResponsiveButtonDemo() {
  return (
    <div className="space-y-8 p-6 bg-background min-h-screen">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Responsive Button Demo</h1>
        <p className="text-muted-foreground">
          Verschiedene Button-Varianten für deinen Email-Agent
        </p>
      </div>

      {/* Responsive Größen */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Responsive Größen</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button size="responsive" variant="default">
            Responsive Button
          </Button>
          <Button size="responsive-sm" variant="outline">
            Kleiner Responsive
          </Button>
          <Button size="responsive" variant="email">
            Email Button
          </Button>
        </div>
      </section>

      {/* Email-Agent spezifische Buttons */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Email-Agent Buttons</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button variant="email" size="responsive" className="w-full">
            <Mail className="w-4 h-4" />
            E-Mail lesen
          </Button>
          
          <Button variant="send" size="responsive" className="w-full">
            <Send className="w-4 h-4" />
            E-Mail senden
          </Button>
          
          <Button variant="outline" size="responsive" className="w-full">
            <Search className="w-4 h-4" />
            E-Mails suchen
          </Button>
          
          <Button variant="secondary" size="responsive" className="w-full">
            <Plus className="w-4 h-4" />
            Neue E-Mail
          </Button>
          
          <Button variant="destructive" size="responsive" className="w-full">
            <Trash2 className="w-4 h-4" />
            Löschen
          </Button>
          
          <Button variant="ghost" size="responsive" className="w-full">
            Mehr Optionen
          </Button>
        </div>
      </section>

      {/* Mobile-optimierte Buttons */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Mobile-optimierte Buttons</h2>
        <div className="space-y-3">
          {/* Vollbreite Buttons für Mobile */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="default" className="w-full sm:w-auto">
              Primäre Aktion
            </Button>
            <Button variant="outline" className="w-full sm:w-auto">
              Sekundäre Aktion
            </Button>
          </div>
          
          {/* Icon-Buttons für kleine Bildschirme */}
          <div className="flex gap-2 sm:gap-4 justify-center sm:justify-start">
            <Button size="icon" variant="ghost">
              <Mail className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="ghost">
              <Send className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="ghost">
              <Search className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="ghost">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Adaptive Button-Größen basierend auf Bildschirmgröße */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Adaptive Größen</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          <Button 
            size="sm" 
            variant="outline" 
            className="text-xs sm:text-sm lg:text-base"
          >
            Klein
          </Button>
          <Button 
            size="default" 
            variant="default"
            className="text-xs sm:text-sm lg:text-base"
          >
            Standard
          </Button>
          <Button 
            size="lg" 
            variant="secondary"
            className="text-xs sm:text-sm lg:text-base"
          >
            Groß
          </Button>
          <Button 
            size="xl" 
            variant="email"
            className="text-xs sm:text-sm lg:text-base"
          >
            Extra Groß
          </Button>
          <Button 
            size="responsive" 
            variant="send"
            className="col-span-2 sm:col-span-1"
          >
            Responsive
          </Button>
          <Button 
            size="responsive-sm" 
            variant="ghost"
            className="col-span-2 sm:col-span-1"
          >
            Responsive Klein
          </Button>
        </div>
      </section>

      {/* Dark Mode Toggle Demo */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Dark Mode Support</h2>
        <div className="flex gap-4">
          <Button variant="default" size="responsive">
            Light/Dark Theme
          </Button>
          <Button variant="outline" size="responsive">
            Adaptiv
          </Button>
          <Button variant="secondary" size="responsive">
            Theme-aware
          </Button>
        </div>
      </section>
    </div>
  )
}
