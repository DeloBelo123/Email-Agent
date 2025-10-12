export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "KI-Mail-Agent für Immobilienmakler",
    "description": "Der erste KI-Agent für Immobilienmakler. E-Mails automatisch kategorisiert, priorisiert und beantwortet. 80% weniger Zeit für E-Mails, mehr Zeit für Abschlüsse.",
    "url": "https://ki-mail-agent.de/landing",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "19",
      "priceCurrency": "EUR",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": "19",
        "priceCurrency": "EUR",
        "unitText": "MONTH"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    },
    "author": {
      "@type": "Organization",
      "name": "MailAgent",
      "url": "https://ki-mail-agent.de"
    },
    "publisher": {
      "@type": "Organization",
      "name": "MailAgent",
      "logo": {
        "@type": "ImageObject",
        "url": "https://ki-mail-agent.de/logo.png"
      }
    },
    "featureList": [
      "KI-E-Mail-Kategorisierung",
      "Automatische E-Mail-Antworten",
      "Lead-Management für Immobilienmakler",
      "CRM-Integration",
      "DSGVO-konforme Datenverarbeitung",
      "6 intelligente Kategorien",
      "24/7 KI-Monitoring",
      "Team-Accounts für Maklerbüros"
    ],
    "screenshot": "https://ki-mail-agent.de/screenshot.jpg",
    "softwareVersion": "1.0",
    "releaseNotes": "Erste Version des KI-Mail-Agents für Immobilienmakler",
    "datePublished": "2024-01-01",
    "dateModified": new Date().toISOString().split('T')[0]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}



