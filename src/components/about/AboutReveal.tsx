'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/motion'
import { useEffect, useRef } from 'react'

interface AboutRevealProps {
  isOpen: boolean
  onClose: () => void
}

export default function AboutReveal({ isOpen, onClose }: AboutRevealProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    const handleClickOutside = (e: MouseEvent) => {
      if ((e.target as Element)?.classList.contains('backdrop')) {
        onClose()
      }
    }

    // Focus trap for accessibility
    const trapFocus = (e: KeyboardEvent) => {
      if (!modalRef.current || e.key !== 'Tab') return

      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements[0] as HTMLElement
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus()
          e.preventDefault()
        }
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.addEventListener('keydown', trapFocus)
      document.addEventListener('click', handleClickOutside)
      document.body.style.overflow = 'hidden'
      
      // Focus first focusable element
      setTimeout(() => {
        const firstFocusable = modalRef.current?.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as HTMLElement
        firstFocusable?.focus()
      }, 100)
      
      return () => {
        document.removeEventListener('keydown', handleEscape)
        document.removeEventListener('keydown', trapFocus)
        document.removeEventListener('click', handleClickOutside)
        document.body.style.overflow = 'unset'
      }
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="backdrop fixed inset-0 z-50 backdrop-blur-sm bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div 
            className="min-h-screen flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="about-title"
          >
            <motion.div
              ref={modalRef}
              className="relative bg-zinc-900/95 backdrop-blur-md border border-zinc-700/50 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-zinc-800"
                aria-label="Close about modal"
              >
                <X size={20} />
              </button>

              <div className="p-8 sm:p-12">
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.h2 
                    id="about-title"
                    className="text-3xl md:text-5xl font-extrabold text-white mb-8 text-center"
                    variants={fadeInUp}
                  >
                    About Me
                  </motion.h2>
                  
                  <motion.div 
                    className="space-y-6 mb-12 text-center max-w-3xl mx-auto"
                    variants={staggerContainer}
                  >
                    <motion.p 
                      className="text-base sm:text-lg text-zinc-300 leading-relaxed"
                      variants={staggerItem}
                    >
                      I&apos;m a Computer Science student at UT Dallas with a passion for building intelligent systems 
                      that solve real-world problems. My journey in software engineering spans from full-stack web 
                      development to cutting-edge AI research, with a particular focus on RAG (Retrieval-Augmented 
                      Generation) and multi-agent systems.
                    </motion.p>
                    
                    <motion.p 
                      className="text-base sm:text-lg text-zinc-300 leading-relaxed"
                      variants={staggerItem}
                    >
                      When I&apos;m not coding, you&apos;ll find me exploring the latest developments in machine learning, 
                      contributing to open-source projects, or mentoring fellow developers. I believe in the power of 
                      clean code, thoughtful design, and collaborative problem-solving.
                    </motion.p>
                    
                    <motion.p 
                      className="text-base sm:text-lg text-zinc-300 leading-relaxed"
                      variants={staggerItem}
                    >
                      Currently seeking opportunities for Spring 2026 internships where I can apply my technical 
                      skills and passion for innovation to create impactful software solutions.
                    </motion.p>
                  </motion.div>
                  
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={staggerContainer}
                  >
                    <motion.div 
                      className="bg-zinc-800/80 border border-zinc-700/50 rounded-lg p-6 backdrop-blur-sm"
                      variants={staggerItem}
                      whileHover={{ scale: 1.02, y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h3 className="text-lg font-semibold text-white mb-3">Full-Stack Development</h3>
                      <p className="text-sm text-zinc-300 leading-relaxed">
                        React, Next.js, TypeScript, Node.js, and modern web technologies
                      </p>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-zinc-800/80 border border-zinc-700/50 rounded-lg p-6 backdrop-blur-sm"
                      variants={staggerItem}
                      whileHover={{ scale: 1.02, y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h3 className="text-lg font-semibold text-white mb-3">AI & Machine Learning</h3>
                      <p className="text-sm text-zinc-300 leading-relaxed">
                        RAG systems, multi-agent architectures, and LLM integration
                      </p>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-zinc-800/80 border border-zinc-700/50 rounded-lg p-6 md:col-span-2 lg:col-span-1 backdrop-blur-sm"
                      variants={staggerItem}
                      whileHover={{ scale: 1.02, y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h3 className="text-lg font-semibold text-white mb-3">System Design</h3>
                      <p className="text-sm text-zinc-300 leading-relaxed">
                        Scalable architecture, database optimization, and cloud platforms
                      </p>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}