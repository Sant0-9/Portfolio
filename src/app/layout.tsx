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
        {/* Aurora + Starfield Background */}
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
          {/* Base dark gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-zinc-900 to-black" />
          
          {/* Aurora layers */}
          <div className="absolute inset-0">
            <div 
              className="absolute inset-0 animate-pulse"
              style={{
                background: `radial-gradient(ellipse 800px 600px at 20% 40%, rgba(0,240,255,0.08) 0%, transparent 60%),
                             radial-gradient(ellipse 600px 450px at 80% 70%, rgba(168,85,247,0.06) 0%, transparent 60%)`,
                animationDuration: '8s'
              }}
            />
            <div 
              className="absolute inset-0 animate-pulse"
              style={{
                background: `radial-gradient(ellipse 700px 400px at 70% 30%, rgba(59,130,246,0.05) 0%, transparent 60%),
                             radial-gradient(ellipse 500px 350px at 30% 80%, rgba(0,240,255,0.04) 0%, transparent 60%)`,
                animationDuration: '12s',
                animationDelay: '4s'
              }}
            />
          </div>

          {/* Starfield */}
          <div className="absolute inset-0">
            <div className="absolute top-[20%] left-[15%] w-0.5 h-0.5 bg-white rounded-full opacity-60 animate-pulse" />
            <div className="absolute top-[10%] left-[30%] w-1 h-1 bg-cyan-300 rounded-full opacity-70" />
            <div className="absolute top-[25%] left-[70%] w-0.5 h-0.5 bg-white rounded-full opacity-50 animate-pulse" style={{animationDelay: '2s'}} />
            <div className="absolute top-[45%] left-[25%] w-1 h-1 bg-purple-300 rounded-full opacity-40" />
            <div className="absolute top-[60%] left-[80%] w-0.5 h-0.5 bg-white rounded-full opacity-70 animate-pulse" style={{animationDelay: '4s'}} />
            <div className="absolute top-[35%] left-[60%] w-1 h-1 bg-cyan-200 rounded-full opacity-60" />
            <div className="absolute top-[75%] left-[45%] w-0.5 h-0.5 bg-white rounded-full opacity-50 animate-pulse" style={{animationDelay: '6s'}} />
            <div className="absolute top-[15%] left-[85%] w-0.5 h-0.5 bg-yellow-200 rounded-full opacity-80" />
            <div className="absolute top-[55%] left-[10%] w-1 h-1 bg-white rounded-full opacity-60 animate-pulse" style={{animationDelay: '3s'}} />
            <div className="absolute top-[85%] left-[65%] w-0.5 h-0.5 bg-cyan-300 rounded-full opacity-50" />
          </div>
        </div>

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
