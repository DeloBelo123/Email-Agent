import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'KI-Mail-Agent für Immobilienmakler',
    short_name: 'MailAgent',
    description: 'Der erste KI-Agent für Immobilienmakler. E-Mails automatisch kategorisiert, priorisiert und beantwortet.',
    start_url: '/landing',
    display: 'standalone',
    background_color: '#0d1b2a',
    theme_color: '#64748b',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['business', 'productivity', 'utilities'],
    lang: 'de',
    orientation: 'portrait-primary',
  }
}



