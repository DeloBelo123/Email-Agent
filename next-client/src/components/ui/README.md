# Responsive Button Komponente

Eine responsive Button-Komponente basierend auf shadcn/ui, optimiert für deinen Email-Agent.

## Verwendung

```tsx
import { Button } from "@/components/ui/button"

// Grundlegende Verwendung
<Button>Klick mich</Button>

// Mit Varianten
<Button variant="email">Email Button</Button>
<Button variant="send">Send Button</Button>

// Mit responsiven Größen
<Button size="responsive">Responsive Button</Button>
<Button size="responsive-sm">Kleiner Responsive Button</Button>
```

## Verfügbare Varianten

- `default` - Standard Button
- `destructive` - Roter Button für Löschaktionen
- `outline` - Button mit Rahmen
- `secondary` - Sekundärer Button
- `ghost` - Transparenter Button
- `link` - Link-ähnlicher Button
- `email` - Spezieller Button für Email-Aktionen (verwendet deine Custom-Farben)
- `send` - Grüner Button für Send-Aktionen

## Verfügbare Größen

- `default` - Standard Größe (h-9)
- `sm` - Kleine Größe (h-8)
- `lg` - Große Größe (h-10)
- `xl` - Extra große Größe (h-12)
- `icon` - Quadratischer Icon-Button (h-9 w-9)
- `responsive` - Responsive Größe (passt sich automatisch an Bildschirmgröße an)
- `responsive-sm` - Kleine responsive Größe

## Responsive Features

Die `responsive` Größen passen sich automatisch an verschiedene Bildschirmgrößen an:

- **Mobile (sm)**: Kleinere Höhe und Schriftgröße
- **Tablet (md)**: Mittlere Größe
- **Desktop (lg)**: Größere Höhe und Schriftgröße

## Beispiele für Email-Agent

```tsx
// Email-Aktionen
<Button variant="email" size="responsive">
  <Mail className="w-4 h-4" />
  E-Mail lesen
</Button>

// Send-Aktionen
<Button variant="send" size="responsive">
  <Send className="w-4 h-4" />
  E-Mail senden
</Button>

// Mobile-optimiert (Vollbreite auf kleinen Bildschirmen)
<Button size="responsive" className="w-full sm:w-auto">
  Primäre Aktion
</Button>

// Icon-Buttons für kleine Bildschirme
<Button size="icon" variant="ghost">
  <Mail className="w-4 h-4" />
</Button>
```

## Anpassung

Die Button-Komponente verwendet deine bestehenden CSS-Variablen aus `globals.css`:

- `--primary-black`, `--blueish-black`, `--gray-blue` für Email-Buttons
- `--light-gray`, `--creme-white` für Text und Rahmen
- Standard shadcn/ui Variablen für andere Varianten

## Demo

Besuche `/button-test` um alle Button-Varianten in Aktion zu sehen.




