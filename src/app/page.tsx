// 3D ready
'use client';
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Header from './components/Header'
import Section from './_ui/Section'
import SectionAbout from './_ui/about/SectionAbout'
import SectionProjects from './_ui/projects/SectionProjects'
import ContactForm from './components/ContactForm'

export default function Home() {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      {/* Header Navigation */}
      <Header />

      <div className="min-h-screen">
      {/* Hero Section */}
      <Section
        id="Hero"
        className="min-h-screen flex items-center relative z-10 overflow-hidden pt-20"
        padding="xl"
        maxWidth="full"
      >
        {/* Central Hero Content */}
        <div className="w-full h-full flex items-center justify-center relative">
          <div className="text-center space-y-8 max-w-4xl mx-auto px-4">
            {/* Main Hero Title - Static first to avoid hydration issues */}
            <div className="space-y-4">
              <h1
                className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-bold text-white"
                style={{
                  fontFamily: 'Orbitron, monospace',
                  textShadow: '0 0 20px rgba(0,240,255,0.6), 0 0 40px rgba(0,240,255,0.4)'
                }}
              >
                OneKnight
              </h1>

              <div className="text-sm sm:text-lg lg:text-xl text-zinc-400 uppercase tracking-wider">
                Full-Stack Developer & AI Enthusiast
              </div>
            </div>

            {/* Animated description */}
            {isMounted && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="space-y-6"
              >
                <p className="text-lg sm:text-xl lg:text-2xl text-white/80 leading-relaxed max-w-3xl mx-auto px-4">
                  Crafting innovative web applications with cutting-edge technology
                </p>

                {/* Tech stack badges */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.4, duration: 0.6 }}
                  className="flex flex-wrap justify-center gap-3 mt-8"
                >
                  {['React', 'Next.js', 'TypeScript', 'Node.js', 'AI/ML', 'Cloud'].map((tech, index) => (
                    <motion.span
                      key={tech}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.6 + index * 0.1, duration: 0.5 }}
                      className="px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm font-medium text-white/90 hover:bg-white/10 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* Call to action */}
            {isMounted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12"
              >
                <motion.a
                  href="#projects"
                  className="px-8 py-4 bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-400 hover:to-purple-400 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View My Work
                </motion.a>
                <motion.button
                  onClick={() => setIsContactFormOpen(true)}
                  className="px-8 py-4 border-2 border-white/20 hover:border-white/40 text-white font-semibold rounded-xl transition-all duration-300 backdrop-blur-sm hover:bg-white/5"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get In Touch
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Floating geometric elements - only on desktop for performance */}
        {isMounted && !isMobile && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-teal-400/30 to-purple-400/30 rounded-full"
                style={{
                  left: `${25 + (i * 25)}%`,
                  top: `${30 + Math.sin(i * 2) * 20}%`
                }}
                animate={{
                  y: [-10, 10, -10],
                  opacity: [0.4, 0.7, 0.4]
                }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5
                }}
              />
            ))}
          </div>
        )}

        {/* Corner accent - moved to bottom left */}
        {isMounted && (
          <div className="absolute bottom-8 left-8 text-left z-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2.5, duration: 0.8 }}
              className="text-white/60 text-sm"
            >
              CS Student at UT Dallas
            </motion.div>
          </div>
        )}

      </Section>

      {/* About Section with Scroll-Triggered Sticky Bio */}
      <SectionAbout />

      {/* Projects Section with Horizontal Scroll */}
      <SectionProjects />

      {/* Let's Connect Section */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-4xl lg:text-5xl font-bold text-white mb-4"
              style={{
                fontFamily: 'Orbitron, monospace',
                textShadow: '0 0 20px rgba(0,240,255,0.6), 0 0 40px rgba(0,240,255,0.4)'
              }}
            >
              Let&apos;s Connect
            </h2>
            <div className="w-24 h-0.5 bg-gradient-to-r from-teal-400 to-purple-500 mx-auto" />
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-8">
              <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
                I&apos;m always interested in new opportunities and exciting projects.
                Whether you want to collaborate or just say hello, feel free to reach out!
              </p>

              {/* Contact Links */}
              <div className="flex flex-wrap justify-center gap-6">
                <button
                  onClick={() => setIsContactFormOpen(true)}
                  className="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 text-white group"
                >
                  <svg className="w-5 h-5 text-teal-400 group-hover:text-teal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Contact Me</span>
                </button>

                <a
                  href="https://github.com/Sant0-9"
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
                  href="https://www.linkedin.com/in/shifatislam-santo/"
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
                  href="https://www.instagram.com/shifatis.santo/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 text-white group"
                >
                  <svg className="w-5 h-5 text-pink-400 group-hover:text-pink-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span>Instagram</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>

    {/* Contact Form Modal */}
    <ContactForm
      isOpen={isContactFormOpen}
      onClose={() => setIsContactFormOpen(false)}
    />
    </>
  )
}
