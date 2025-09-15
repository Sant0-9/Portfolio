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

      {/* Let's Connect Section */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Let's Connect
            </h2>
            <div className="w-24 h-0.5 bg-gradient-to-r from-teal-400 to-purple-500 mx-auto" />
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-8">
              <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
                I'm always interested in new opportunities and exciting projects.
                Whether you want to collaborate or just say hello, feel free to reach out!
              </p>

              {/* Contact Links */}
              <div className="flex flex-wrap justify-center gap-6">
                <a
                  href="mailto:santo.rahman@example.com"
                  className="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 text-white group"
                >
                  <svg className="w-5 h-5 text-teal-400 group-hover:text-teal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Contact Me</span>
                </a>

                <a
                  href="https://github.com/santo-rahman"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 text-white group"
                >
                  <svg className="w-5 h-5 text-purple-400 group-hover:text-purple-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span>GitHub</span>
                </a>

                <a
                  href="https://linkedin.com/in/santo-rahman"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 text-white group"
                >
                  <svg className="w-5 h-5 text-blue-400 group-hover:text-blue-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <span>LinkedIn</span>
                </a>

                <a
                  href="https://twitter.com/santo_rahman"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 text-white group"
                >
                  <svg className="w-5 h-5 text-sky-400 group-hover:text-sky-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  <span>Twitter</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
