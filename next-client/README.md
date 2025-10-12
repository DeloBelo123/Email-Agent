# KI-Mail-Agent Landingpage

Eine vollständige, responsive Next.js Landingpage für eine SaaS: KI-gestützte E-Mail-Verwaltung für Immobilienmakler.

## 🚀 Schnellstart

```bash
# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev
```

Öffne [http://localhost:3000/landing](http://localhost:3000/landing) in deinem Browser.

## 📁 Projektstruktur

```
src/
├── app/
│   └── landing/
│       └── page.tsx          # Haupt-Landingpage
├── components/
│   └── landing/
│       ├── Header.tsx        # Navigation & Header
│       ├── Hero.tsx          # Hero Section mit CTA
│       ├── Features.tsx      # Features Grid
│       ├── DemoPreview.tsx   # Interaktive Demo
│       ├── Pricing.tsx       # Preise mit Toggle
│       ├── PricingToggle.tsx # Monatlich/Jährlich Toggle
│       ├── FAQ.tsx           # Häufige Fragen
│       └── Footer.tsx        # Footer mit Links
└── styles/
    └── globals.css           # CSS-Variablen & Styles

public/
└── demo-data.json           # Demo-E-Mail-Daten
```

## 🎨 Design System

Die Landingpage nutzt ein konsistentes Design-System basierend auf CSS-Variablen:

- **Farben**: `--primary-black`, `--blueish-black`, `--gray-blue`, `--light-gray`, `--creme-white`
- **Dark Mode**: Automatischer Toggle mit `.dark` Klasse
- **Animationen**: Framer Motion für smooth Transitions
- **Responsive**: Mobile-first Design mit TailwindCSS

## 🔧 Demo-Daten anpassen

Die Demo-Preview lädt Daten aus `/public/demo-data.json`. Du kannst diese Datei bearbeiten, um:

- E-Mail-Inhalte zu ändern
- Kategorien anzupassen
- Neue E-Mails hinzuzufügen

**Beispiel-Struktur:**
```json
{
  "emails": [
    {
      "id": "1",
      "from": "Max Mustermann",
      "subject": "Besichtigungstermin gewünscht",
      "snippet": "Kurzer Text...",
      "category": "Leads",
      "receivedAt": "Heute, 14:30",
      "urgent": true,
      "fullBody": "Vollständiger E-Mail-Text..."
    }
  ]
}
```

## 📱 Features

- ✅ **Responsive Design** - Funktioniert auf allen Geräten
- ✅ **Dark/Light Mode** - Automatischer Theme-Toggle
- ✅ **Smooth Animationen** - Framer Motion Integration
- ✅ **Accessibility** - ARIA-Labels, Keyboard-Navigation
- ✅ **SEO-Optimiert** - Meta-Tags, Semantic HTML
- ✅ **Performance** - Lazy Loading, optimierte Bilder
- ✅ **TypeScript** - Vollständig typisiert
- ✅ **Demo-Integration** - Interaktive E-Mail-Vorschau

## 🎯 Sections

1. **Header** - Navigation mit Logo, Links und Theme-Toggle
2. **Hero** - Hauptbotschaft mit CTA und Live-Demo
3. **Features** - 8 Kernfunktionen mit Icons
4. **Demo Preview** - Interaktive E-Mail-Vorschau
5. **Pricing** - 3 Pläne mit Monatlich/Jährlich Toggle
6. **FAQ** - 8 häufige Fragen mit Accordion
7. **Footer** - Links, Kontakt, DSGVO-Hinweis

## 🔗 Links & CTAs

- **Demo starten** → `/demo` (zu implementieren)
- **Preise** → `#pricing` (Scroll zu Pricing Section)
- **Features** → `#features` (Scroll zu Features Section)
- **Kontakt** → `mailto:support@ki-mail-agent.de`

## 🛠️ Technologie-Stack

- **Next.js 14** - React Framework
- **TypeScript** - Typsicherheit
- **TailwindCSS** - Utility-First CSS
- **Framer Motion** - Animationen
- **Lucide React** - Icons

## 📄 Lizenz

Dieses Projekt ist für Demonstrationszwecke erstellt.

## 🤝 Support

Bei Fragen oder Problemen:
- E-Mail: support@ki-mail-agent.de
- Demo: [http://localhost:3000/landing](http://localhost:3000/landing)

---

**Hinweis**: Dies ist eine Demo-Landingpage. Alle gezeigten Daten sind Beispieldaten und speichern keine echten Kundendaten.
