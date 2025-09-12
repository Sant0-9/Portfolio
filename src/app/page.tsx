import Navbar from '@/components/navbar/Navbar'
import Section from '@/components/common/Section'
import ProjectsSection from '@/components/projects/ProjectsSection'
import SimpleHero from '@/components/hero/SimpleHero'

export default function Home() {
  return (
    <div>
      <Navbar />
      
      {/* Hero Section with Simple Background */}
      <SimpleHero />
      {/* Projects Section (cards for SEO/scan) */}
      <ProjectsSection />
      
      {/* About Section */}
      <Section className="py-24 bg-gradient-to-b from-zinc-900 to-zinc-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8">About</h2>
          <p className="text-xl text-zinc-300 mb-8">Learn more about my background and experience</p>
        </div>
      </Section>
      
      {/* Skills Section */}
      <Section className="py-24 bg-gradient-to-b from-zinc-800 to-zinc-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8">Skills</h2>
          <p className="text-xl text-zinc-300 mb-8">Technologies and tools I work with</p>
        </div>
      </Section>
      
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
