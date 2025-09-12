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
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans overflow-x-hidden bg-black text-zinc-200 antialiased`}>
        <Background />
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        
        <main id="main">
          {children}
        </main>
      </body>
    </html>
  )
}
