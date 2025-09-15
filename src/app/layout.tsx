import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import Background from './_ui/Background'
import './globals.css'

export const metadata: Metadata = {
  title: "Santo's Digital Universe",
  description: 'Full-stack developer crafting exceptional digital experiences with modern web technologies.',
  metadataBase: new URL('https://portfolio.example.com'),
  openGraph: {
    title: "Santo's Digital Universe",
    description: 'Full-stack developer crafting exceptional digital experiences with modern web technologies.',
    type: 'website',
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
        {/* Three.js Stars Background */}
        <Background />

        <div style={{position: 'relative', zIndex: 1000}}>
          <a href="#main" className="skip-link">
            Skip to main content
          </a>

          <main id="main" style={{position: 'relative', zIndex: 1000}}>
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
