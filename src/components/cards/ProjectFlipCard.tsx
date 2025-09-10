'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, BarChart3 } from 'lucide-react'
import Image from 'next/image'

interface ProjectFlipCardProps {
  title: string
  image: string
  metric: {
    label: string
    value: string
    icon?: React.ReactNode
  }
  summary: string
  stack: string[]
  caseStudyUrl: string
  imageAlt?: string
}

export default function ProjectFlipCard({
  title,
  image,
  metric,
  summary,
  stack,
  caseStudyUrl,
  imageAlt
}: ProjectFlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setIsFlipped(!isFlipped)
    }
  }

  const frontContent = (
    <div className="absolute inset-0 backface-hidden rounded-xl overflow-hidden bg-panel border border-muted/20">
      <div className="relative h-48 w-full">
        <Image
          src={image}
          alt={imageAlt || `${title} project screenshot`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-text font-tight">
            {title}
          </h3>
          
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-background/50">
              {metric.icon || <BarChart3 className="w-4 h-4 text-muted" />}
            </div>
            <div>
              <div className="text-lg font-semibold text-text">
                {metric.value}
              </div>
              <div className="text-sm text-muted">
                {metric.label}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const backContent = (
    <div 
      className="absolute inset-0 backface-hidden rounded-xl bg-panel border border-muted/20 p-6 flex flex-col"
      style={{ transform: 'rotateY(180deg)' }}
    >
      <div className="flex-1 space-y-4">
        <h3 className="text-xl font-semibold text-text font-tight">
          {title}
        </h3>
        
        <p className="text-muted leading-relaxed">
          {summary}
        </p>
        
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-text">Tech Stack</h4>
          <div className="flex flex-wrap gap-2">
            {stack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-xs font-medium bg-background/50 text-muted rounded-full border border-muted/20"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="pt-4 mt-auto">
        <a
          href={caseStudyUrl}
          className="inline-flex items-center gap-2 text-text hover:text-muted transition-colors text-sm font-medium"
          onClick={(e) => e.stopPropagation()}
        >
          View Case Study
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  )

  if (prefersReducedMotion) {
    // Fallback for reduced motion: show both sides stacked
    return (
      <div 
        className="w-full h-80 relative group cursor-pointer focus:ring-2 focus:ring-muted focus:ring-offset-2 focus:ring-offset-background rounded-xl focus:outline-none"
        tabIndex={0}
        role="button"
        aria-label={`Project card for ${title}. Press Enter to toggle details.`}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`transition-opacity duration-300 ${isFlipped || isFocused ? 'opacity-0' : 'opacity-100'}`}>
          {frontContent}
        </div>
        <div className={`transition-opacity duration-300 ${isFlipped || isFocused ? 'opacity-100' : 'opacity-0'}`}>
          {backContent}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="w-full h-80 perspective-1000 cursor-pointer focus:ring-2 focus:ring-muted focus:ring-offset-2 focus:ring-offset-background rounded-xl focus:outline-none"
      tabIndex={0}
      role="button"
      aria-label={`Project card for ${title}. Press Enter to flip card for more details.`}
      onHoverStart={() => setIsFlipped(true)}
      onHoverEnd={() => setIsFlipped(false)}
      onTapStart={() => setIsFlipped(true)}
      onKeyDown={handleKeyDown}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={{
        perspective: '1000px',
      }}
    >
      <motion.div
        className="relative w-full h-full preserve-3d"
        animate={{
          rotateY: isFlipped || isFocused ? 180 : 0
        }}
        transition={{
          duration: 0.6,
          ease: [0.4, 0.0, 0.2, 1]
        }}
        style={{
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        {frontContent}
        {backContent}
      </motion.div>
      
      {/* Screen reader content */}
      <div className="sr-only">
        <h3>{title}</h3>
        <p>Metric: {metric.value} {metric.label}</p>
        <p>Summary: {summary}</p>
        <p>Tech stack: {stack.join(', ')}</p>
        <a href={caseStudyUrl}>View case study</a>
      </div>
    </motion.div>
  )
}