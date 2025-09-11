import dynamic from 'next/dynamic'
import Navbar from '@/components/navbar/Navbar'
import Section from '@/components/common/Section'

// Dynamic import to prevent SSR issues with Three.js
const SolarHero = dynamic(() => import('@/components/hero/SolarHero'), {
  ssr: false,
  loading: () => <div className="h-screen bg-black flex items-center justify-center text-zinc-200">Loading Solar System...</div>
})

export default function Home() {
  return (
    <div className="h-full">
      <Navbar />
      
      {/* Hero Section with Solar System */}
      <SolarHero />
      
      
      {/* Contact Section */}
      <Section id="contact" fullHeight className="flex items-center justify-center bg-gradient-to-b from-zinc-900 to-black">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8">
            Get In Touch
          </h2>
          <p className="text-xl text-zinc-300 mb-8">
            Interested in working together? Let&apos;s connect and build something amazing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:hello@example.com"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors font-medium"
            >
              Send Email
            </a>
            <a
              href="/projects"
              className="bg-transparent border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white px-8 py-3 rounded-lg transition-colors font-medium"
            >
              View Projects
            </a>
          </div>
        </div>
      </Section>
    </div>
  )
}