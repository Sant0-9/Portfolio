import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'
import AnimatedBackground from '@/components/layout/AnimatedBackground'
import './globals.css'

const interTight = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter-tight',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Personal portfolio website',
  metadataBase: new URL('https://portfolio.example.com'),
  openGraph: {
    title: 'Portfolio',
    description: 'Personal portfolio website',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${GeistSans.variable} ${GeistMono.variable} ${interTight.variable} font-sans antialiased`}>
        <AnimatedBackground 
          intensity={0.8}
          speed={1.2}
          seed={42}
        />
        
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        
        <div className="relative">
          <SiteHeader />
          
          <main id="main">
            {children}
          </main>
          
          <SiteFooter />
        </div>
      </body>
    </html>
  )
}