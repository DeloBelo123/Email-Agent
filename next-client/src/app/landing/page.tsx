import { Metadata } from 'next'
import LandingPageClient from './LandingPageClient'

export const metadata: Metadata = {
  title: 'KI-Mail-Agent für Immobilienmakler | Automatische E-Mail-Verwaltung',
  description: 'Der erste KI-Agent für Immobilienmakler, der deine E-Mails automatisch kategorisiert, priorisiert und beantwortet. Verliere keine Leads mehr!',
  keywords: 'KI, E-Mail, Immobilienmakler, Automatisierung, Lead-Management, Kundenbetreuung',
  authors: [{ name: 'KI-Mail-Agent' }],
  creator: 'KI-Mail-Agent',
  publisher: 'KI-Mail-Agent',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: 'https://your-domain.com',
    title: 'KI-Mail-Agent für Immobilienmakler | Automatische E-Mail-Verwaltung',
    description: 'Der erste KI-Agent für Immobilienmakler, der deine E-Mails automatisch kategorisiert, priorisiert und beantwortet.',
    siteName: 'KI-Mail-Agent',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'KI-Mail-Agent für Immobilienmakler',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KI-Mail-Agent für Immobilienmakler | Automatische E-Mail-Verwaltung',
    description: 'Der erste KI-Agent für Immobilienmakler, der deine E-Mails automatisch kategorisiert, priorisiert und beantwortet.',
    images: ['/twitter-image.jpg'],
  },
  alternates: {
    canonical: 'https://your-domain.com',
  },
}

export default function LandingPage() {
  return (
    <>
      <LandingPageClient />
    </>
  )
}
