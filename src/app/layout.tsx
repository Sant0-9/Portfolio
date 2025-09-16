import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { LoadingProvider } from './context/LoadingContext'
import ClientLayout from './components/ClientLayout'
import './globals.css'

export const metadata: Metadata = {
  title: "OneKnight - Shifat Islam Santo",
  description: 'CS student at UT Dallas and full-stack developer with expertise in modern web applications and AI technologies.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  icons: {
    icon: '/icon.svg',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: "OneKnight - Shifat Islam Santo",
    description: 'CS student at UT Dallas and full-stack developer with expertise in modern web applications and AI technologies.',
    type: 'website',
    images: ['/icon.svg'],
  },
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="overflow-x-hidden bg-black text-zinc-200 antialiased">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans overflow-x-hidden text-zinc-200 antialiased`}>
        <LoadingProvider minDurationMs={1200} maxDurationMs={8000}>
          <ClientLayout>
            {children}
          </ClientLayout>
        </LoadingProvider>
      </body>
    </html>
  )
}
