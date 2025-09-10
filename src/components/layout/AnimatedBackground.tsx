'use client'

import { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'

interface AnimatedBackgroundProps {
  intensity: number
  speed: number
  seed: number
}

interface ParticleProps {
  x: number
  y: number
  size: number
  opacity: number
  duration: number
  delay: number
}

function generateParticles(seed: number, intensity: number): ParticleProps[] {
  const particles: ParticleProps[] = []
  const particleCount = Math.floor(intensity * 20)
  
  // Simple seeded random number generator
  let seedValue = seed
  const random = () => {
    seedValue = (seedValue * 9301 + 49297) % 233280
    return seedValue / 233280
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: random() * 100,
      y: random() * 100,
      size: random() * 4 + 1,
      opacity: random() * 0.5 + 0.3,
      duration: random() * 20 + 10,
      delay: random() * 5,
    })
  }

  return particles
}

export default function AnimatedBackground({ 
  intensity, 
  speed, 
  seed 
}: AnimatedBackgroundProps) {
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

  const particles = useMemo(() => generateParticles(seed, intensity), [seed, intensity])

  if (prefersReducedMotion) {
    return (
      <div 
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(161, 166, 164, 0.25) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(161, 166, 164, 0.2) 0%, transparent 50%),
            radial-gradient(ellipse at 40% 80%, rgba(161, 166, 164, 0.15) 0%, transparent 50%)
          `
        }}
      />
    )
  }

  return (
    <div 
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
      data-animated
      style={{ 
        contain: 'layout style paint',
        willChange: 'transform, opacity'
      }}
    >
      {/* Static gradient base */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(161, 166, 164, 0.25) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(161, 166, 164, 0.2) 0%, transparent 50%),
            radial-gradient(ellipse at 40% 80%, rgba(161, 166, 164, 0.15) 0%, transparent 50%)
          `
        }}
      />
      
      {/* Animated particles */}
      {particles.map((particle, index) => (
        <motion.div
          key={`${seed}-${index}`}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: '#9aa09e',
            willChange: 'transform, opacity',
          }}
          initial={{
            opacity: 0,
            scale: 0,
          }}
          animate={{
            opacity: [0, particle.opacity, 0],
            scale: [0, 1, 0],
            x: [0, Math.sin(index) * 50, 0],
            y: [0, Math.cos(index) * 30, 0],
          }}
          transition={{
            duration: particle.duration / speed,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
      
      {/* Floating gradient orbs */}
      <motion.div
        className="absolute rounded-full blur-3xl"
        style={{
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(161, 166, 164, 0.3) 0%, transparent 70%)',
          left: '10%',
          top: '20%',
          willChange: 'transform, opacity',
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 25 / speed,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      <motion.div
        className="absolute rounded-full blur-3xl"
        style={{
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(161, 166, 164, 0.25) 0%, transparent 70%)',
          right: '10%',
          bottom: '20%',
          willChange: 'transform, opacity',
        }}
        animate={{
          x: [0, -80, 0],
          y: [0, -60, 0],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 30 / speed,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 5,
        }}
      />
      
      <motion.div
        className="absolute rounded-full blur-2xl"
        style={{
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(161, 166, 164, 0.35) 0%, transparent 70%)',
          left: '60%',
          top: '60%',
          willChange: 'transform, opacity',
        }}
        animate={{
          x: [0, -50, 50, 0],
          y: [0, 40, -20, 0],
          opacity: [0.5, 0.9, 0.5],
        }}
        transition={{
          duration: 20 / speed,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />
    </div>
  )
}