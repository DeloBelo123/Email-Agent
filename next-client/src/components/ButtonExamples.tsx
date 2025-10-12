import { Button } from "@/components/ui/button"
import { Mail, Send, Plus, Trash2 } from "lucide-react"

export function ButtonExamples() {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">Responsive Button Beispiele</h2>
      
      {/* Einfache responsive Buttons */}
      <section>
        <h3 className="text-lg font-semibold mb-3">Grundlegende responsive Buttons</h3>
        <div className="flex flex-wrap gap-3">
          <Button size="responsive" variant="default">
            Standard Button
          </Button>
          <Button size="responsive" variant="email">
            Email Button
          </Button>
          <Button size="responsive" variant="send">
            Send Button
          </Button>
        </div>
      </section>

      {/* Buttons mit Icons */}
      <section>
        <h3 className="text-lg font-semibold mb-3">Buttons mit Icons</h3>
        <div className="flex flex-wrap gap-3">
          <Button size="responsive" variant="email">
            <Mail className="w-4 h-4" />
            E-Mail lesen
          </Button>
          <Button size="responsive" variant="send">
            <Send className="w-4 h-4" />
            E-Mail senden
          </Button>
          <Button size="responsive" variant="outline">
            <Plus className="w-4 h-4" />
            Neue E-Mail
          </Button>
          <Button size="responsive" variant="destructive">
            <Trash2 className="w-4 h-4" />
            Löschen
          </Button>
        </div>
      </section>

      {/* Mobile-optimierte Buttons */}
      <section>
        <h3 className="text-lg font-semibold mb-3">Mobile-optimiert (Vollbreite auf kleinen Bildschirmen)</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button size="responsive" variant="default" className="w-full sm:w-auto">
            Primäre Aktion
          </Button>
          <Button size="responsive" variant="outline" className="w-full sm:w-auto">
            Sekundäre Aktion
          </Button>
        </div>
      </section>

      {/* Icon-only Buttons für kleine Bildschirme */}
      <section>
        <h3 className="text-lg font-semibold mb-3">Icon-Buttons für kleine Bildschirme</h3>
        <div className="flex gap-2 sm:gap-4 justify-center sm:justify-start">
          <Button size="icon" variant="ghost">
            <Mail className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="ghost">
            <Send className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="ghost">
            <Plus className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="ghost">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Verschiedene Größen */}
      <section>
        <h3 className="text-lg font-semibold mb-3">Verschiedene Größen</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm" variant="outline">Klein</Button>
          <Button size="default" variant="default">Standard</Button>
          <Button size="lg" variant="secondary">Groß</Button>
          <Button size="xl" variant="email">Extra Groß</Button>
        </div>
      </section>

      {/* Responsive Größen */}
      <section>
        <h3 className="text-lg font-semibold mb-3">Responsive Größen</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="responsive-sm" variant="outline">
            Responsive Klein
          </Button>
          <Button size="responsive" variant="default">
            Responsive Standard
          </Button>
          <Button size="responsive" variant="send">
            Responsive Groß
          </Button>
        </div>
      </section>
    </div>
  )
}
