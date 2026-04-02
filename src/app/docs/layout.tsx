import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API Documentation | Neural Architect DM Intelligence',
  description: 'Scalable neural models for Instagram intent detection, profile analysis, and automated lead scoring. Built for high-ticket agencies and SaaS developers.',
  keywords: ['Instagram API', 'DM Automation', 'Intent Detection', 'Lead Scoring', 'Neural Architect', 'symm.digital', 'AI Agent API'],
  openGraph: {
    title: 'Neural Architect API | Scale Your DM Intelligence',
    description: 'The professional intelligence layer for Instagram automation. Start building with our neural intent detection models today.',
    url: 'https://symm.digital/docs',
    siteName: 'Neural Architect',
    images: [
      {
        url: '/assets/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Neural Architect API Documentation',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Neural Architect API | AI-Powered DM Intel',
    description: 'Transform raw DMs into high-ticket sales intelligence. Professional API for agencies.',
    images: ['/assets/og-image.png'],
  },
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
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="antialiased">
      {children}
    </div>
  );
}
