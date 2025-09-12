import HeroTitle from './_ui/HeroTitle'
import Section from './_ui/Section'
import ProjectsSection from '@/components/projects/ProjectsSection'

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <Section 
        id="Hero" 
        className="min-h-screen flex items-center justify-center" 
        padding="xl"
        maxWidth="2xl"
      >
        <HeroTitle
          eyebrow="Welcome to my portfolio"
          title="Santo&apos;s Digital Universe"
          subtitle="Full-stack developer crafting exceptional digital experiences with modern web technologies."
        />
      </Section>

      {/* About Section */}
      <Section 
        id="About" 
        heading="About Me" 
        subheading="Passionate about creating meaningful digital experiences"
        maxWidth="lg"
      >
        <div className="prose prose-lg prose-invert mx-auto">
          <p>I&apos;m a full-stack developer with a passion for creating beautiful, functional, and user-centered digital experiences. With expertise in modern web technologies, I help bring ideas to life through code.</p>
        </div>
      </Section>

      {/* Projects Section */}
      <Section 
        id="Projects" 
        heading="Featured Projects" 
        subheading="A showcase of my recent work and contributions"
        maxWidth="xl"
      >
        <ProjectsSection />
      </Section>

      {/* Experience Section */}
      <Section 
        id="Experience" 
        heading="Experience" 
        subheading="My professional journey and key milestones"
        maxWidth="lg"
      >
        <div className="space-y-8">
          <div className="border border-zinc-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-2">Full-Stack Developer</h3>
            <p className="text-zinc-400 mb-4">Building modern web applications</p>
            <p className="text-zinc-300">Specialized in React, Node.js, and cloud technologies.</p>
          </div>
        </div>
      </Section>

      {/* Contact Section */}
      <Section 
        id="Contact" 
        heading="Get In Touch" 
        subheading="Let&apos;s collaborate on your next project"
        maxWidth="md"
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="mailto:hello@example.com"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors font-medium text-center"
          >
            Send Email
          </a>
          <a
            href="#Projects"
            className="bg-transparent border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white px-8 py-3 rounded-lg transition-colors font-medium text-center"
          >
            View Projects
          </a>
        </div>
      </Section>
    </div>
  )
}
