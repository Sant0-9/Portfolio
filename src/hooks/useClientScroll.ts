'use client'

import { useEffect, useState, useRef } from 'react'
import { useMotionValue } from 'framer-motion'

export function useClientScroll() {
  const [mounted, setMounted] = useState(false)
  const scrollYProgress = useMotionValue(0)
  const targetRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setMounted(true)
    
    const handleScroll = () => {
      if (!targetRef.current) return

      const scrollTop = window.pageYOffset
      const windowHeight = window.innerHeight
      const docHeight = document.documentElement.scrollHeight
      
      // Simple progress: how much we've scrolled through the whole page
      const progress = scrollTop / (docHeight - windowHeight)
      
      scrollYProgress.set(Math.max(0, Math.min(1, progress)))
    }

    if (mounted) {
      handleScroll() // Initial calculation
      
      // Use requestAnimationFrame for smooth updates
      let ticking = false
      const smoothScroll = () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            handleScroll()
            ticking = false
          })
          ticking = true
        }
      }
      
      window.addEventListener('scroll', smoothScroll, { passive: true })
      window.addEventListener('resize', handleScroll, { passive: true })
      
      return () => {
        window.removeEventListener('scroll', smoothScroll)
        window.removeEventListener('resize', handleScroll)
      }
    }
  }, [mounted, scrollYProgress])

  return { scrollYProgress, targetRef, mounted }
}