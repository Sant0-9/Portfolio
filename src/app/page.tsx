// 3D ready
import HeroTitle from './_ui/HeroTitle'
import Section from './_ui/Section'
import SectionAbout from './_ui/about/SectionAbout'
import SectionProjects from './_ui/projects/SectionProjects'
import SplineScene from './_ui/SplineScene'

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <Section
        id="Hero"
        className="min-h-screen flex items-center relative z-50"
        padding="xl"
        maxWidth="full"
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-screen">
            {/* Left Side - Title */}
            <div className="relative z-50">
              <HeroTitle
                eyebrow="Full-Stack Developer & AI Enthusiast"
                title="OneKnight"
                typewriterLines={[
                  "Hi",
                  "Welcome to my universe",
                  "dive in",
                  "projects, ideas, and a little chaos"
                ]}
              />
            </div>

            {/* Right Side - Spline 3D Model */}
            <div className="relative z-40 h-full min-h-[400px] lg:min-h-[500px] flex items-center justify-center">
              <div
                id="spline-container"
                className="w-4/5 h-4/5 max-w-[400px] max-h-[400px] overflow-hidden"
              >
                {/* Your local Spline scene */}
                <SplineScene
                  scene="/scene.splinecode"
                  className="w-full h-full"
                  scale={0.75}
                  position={{ x: 0, y: 20, z: 0 }}
                />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* About Section with Scroll-Triggered Sticky Bio */}
      <SectionAbout />

      {/* Projects Section with Horizontal Scroll */}
      <SectionProjects />

      {/* Normal scrolling resumes here */}
      <div className="relative z-10 -mt-60">
        {/* Experience Section */}
        <Section
          id="Experience"
          heading="Professional Experience"
          subheading="Driving innovation through full-stack development and AI integration"
          maxWidth="lg"
          padding="md"
        >
          <div className="space-y-8">
            <div className="border border-zinc-800 rounded-lg p-6 bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 backdrop-blur-sm">
              <h3 
                className="text-xl font-semibold text-white mb-2"
                style={{ 
                  fontFamily: 'Orbitron, monospace',
                  textShadow: '0 0 10px rgba(0,240,255,0.3)'
                }}
              >
                Full-Stack Developer & AI Engineer
              </h3>
              <p 
                className="text-zinc-400 mb-4"
                style={{ 
                  fontFamily: 'Exo 2, sans-serif',
                  textShadow: '0 0 5px rgba(116,185,255,0.2)'
                }}
              >
                Independent Projects • 2023 - Present
              </p>
              <p 
                className="text-zinc-300"
                style={{ 
                  fontFamily: 'Exo 2, sans-serif',
                  textShadow: '0 0 5px rgba(116,185,255,0.2)'
                }}
              >
                Architected and deployed 10+ production applications using React, Node.js, and AI technologies. 
                Delivered solutions serving 1000+ users with 99.5% uptime and sub-200ms response times.
              </p>
            </div>
          </div>
        </Section>

        {/* Contact Section */}
        <Section
          id="Contact"
          heading="Let&apos;s Build Something Amazing"
          subheading="Ready to transform your vision into scalable, intelligent solutions"
          maxWidth="md"
          padding="md"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:santo.rahman@example.com"
              aria-label="Send email to Santo Rahman"
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-3 rounded-lg transition-all duration-300 font-medium text-center transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
              style={{ 
                fontFamily: 'Exo 2, sans-serif',
                textShadow: '0 0 10px rgba(255,255,255,0.3)'
              }}
            >
              Start a Conversation
            </a>
            <a
              href="#projects"
              aria-label="View featured projects section"
              className="bg-transparent border border-zinc-700 hover:border-cyan-400 text-zinc-300 hover:text-cyan-300 px-8 py-3 rounded-lg transition-all duration-300 font-medium text-center transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-400/20"
              style={{ 
                fontFamily: 'Exo 2, sans-serif',
                textShadow: '0 0 8px rgba(116,185,255,0.3)'
              }}
            >
              Explore My Work
            </a>
          </div>
        </Section>
      </div>
    </div>
  )
}
