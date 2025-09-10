'use client'

import { useEffect, useState } from 'react'
import { Github, Linkedin, Instagram, Mail } from 'lucide-react'
import { motion } from 'framer-motion'

interface SocialLinkProps {
  href: string
  icon: React.ReactNode
  label: string
  hoverColor: string
  prefersReducedMotion: boolean
}

function SocialLink({ href, icon, label, hoverColor, prefersReducedMotion }: SocialLinkProps) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group relative inline-flex items-center justify-center w-12 h-12 rounded-lg bg-transparent border border-muted/20 hover:border-transparent transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-muted focus:ring-offset-2 focus:ring-offset-background"
      whileHover={prefersReducedMotion ? {} : { scale: 1.1 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
      style={{
        willChange: 'transform',
      }}
    >
      <motion.div
        className="flex items-center justify-center w-full h-full rounded-lg"
        initial={{ backgroundColor: 'transparent' }}
        whileHover={{ 
          backgroundColor: hoverColor,
          transition: { duration: 0.2, ease: 'easeOut' }
        }}
      >
        <motion.div
          initial={{ color: '#9aa09e' }}
          whileHover={{ 
            color: '#ffffff',
            transition: { duration: 0.2, ease: 'easeOut' }
          }}
        >
          {icon}
        </motion.div>
      </motion.div>
      
      {/* Tooltip */}
      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-panel px-2 py-1 rounded text-xs text-text opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        {label}
      </div>
    </motion.a>
  )
}

export default function SocialBar() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const socialLinks = [
    {
      href: 'https://github.com',
      icon: <Github className="w-5 h-5" />,
      label: 'GitHub',
      hoverColor: '#24292e'
    },
    {
      href: 'https://linkedin.com',
      icon: <Linkedin className="w-5 h-5" />,
      label: 'LinkedIn',
      hoverColor: '#0077b5'
    },
    {
      href: 'https://instagram.com',
      icon: <Instagram className="w-5 h-5" />,
      label: 'Instagram',
      hoverColor: '#e4405f'
    },
    {
      href: 'mailto:hello@example.com',
      icon: <Mail className="w-5 h-5" />,
      label: 'Email',
      hoverColor: '#ea4335'
    }
  ]

  return (
    <nav 
      className="flex items-center gap-3"
      role="navigation" 
      aria-label="Social media links"
    >
      {socialLinks.map((link) => (
        <SocialLink
          key={link.label}
          href={link.href}
          icon={link.icon}
          label={link.label}
          hoverColor={link.hoverColor}
          prefersReducedMotion={prefersReducedMotion}
        />
      ))}
    </nav>
  )
}