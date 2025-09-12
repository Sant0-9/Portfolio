'use client'

import { Suspense, useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { useTransform, motion } from 'framer-motion'
import { useClientScroll } from '@/hooks/useClientScroll'
import Sun from './Sun'
import Planet from './Planet'
import Orbits from './Orbits'
import Starfield from './Starfield'
import { projects } from '@/lib/projects'
import Section from '@/components/common/Section'
import { fadeUp, stagger } from '@/lib/motion'
import AboutReveal from '@/components/about/AboutReveal'
import KeyboardControls from '@/components/accessibility/KeyboardControls'
import FocusIndicator from '@/components/accessibility/FocusIndicator'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import PerformanceMonitor from '@/components/common/PerformanceMonitor'
import WebGLFallback from '@/components/common/WebGLFallback'
import { detectWebGLCapabilities, isWebGLSupported } from '@/lib/webgl-detector'
import * as THREE from 'three'

// Camera controller component - implements the cinematic experience with 3 phases
function CameraController({ scrollProgress }: { scrollProgress: any }) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)

  useFrame((state) => {
    if (cameraRef.current && scrollProgress) {
      const progress = scrollProgress.get()
      
      // Debug every few frames
      if (Math.random() < 0.01) {
        console.log('Camera controller progress:', progress)
      }
      
      
      // Phase-based camera movement according to README specifications
      let targetZ: number
      
      if (progress < 0.3) {
        // Phase 1 (0-30%): Title Departure - remain distant
        targetZ = 1200 // Stay far away during title phase
      } else if (progress < 0.7) {
        // Phase 2 (30-70%): Approaching Solar System - dramatic approach
        const phase2Progress = (progress - 0.3) / 0.4 // 0-1 within phase 2
        targetZ = THREE.MathUtils.lerp(1200, 400, phase2Progress)
      } else {
        // Phase 3 (70-100%): Planet Interaction Zone - close approach
        const phase3Progress = (progress - 0.7) / 0.3 // 0-1 within phase 3
        targetZ = THREE.MathUtils.lerp(400, 200, phase3Progress)
      }
      
      
      // Smooth camera interpolation for cinematic feel
      cameraRef.current.position.z = THREE.MathUtils.lerp(cameraRef.current.position.z, targetZ, 0.03)
      
      // Subtle camera height adjustment based on scroll
      const targetY = 150 + (progress * 50) // Slightly elevate camera as we scroll
      cameraRef.current.position.y = THREE.MathUtils.lerp(cameraRef.current.position.y, targetY, 0.02)
    }
  })

  return (
    <PerspectiveCamera 
      ref={cameraRef}
      makeDefault 
      position={[0, 150, 1200]} 
      fov={75}
      near={1}
      far={3000}
    />
  )
}

export default function SolarHero() {
  const [isMobile, setIsMobile] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [aboutOpen, setAboutOpen] = useState(false)
  const [focusedElement, setFocusedElement] = useState<'sun' | string | null>(null)
  const [webGLSupported, setWebGLSupported] = useState<boolean | null>(null)
  const [showDebugInfo, setShowDebugInfo] = useState(false)
  // Use custom client-side scroll hook to avoid hydration issues
  const { scrollYProgress, targetRef: sectionRef, mounted } = useClientScroll()

  useEffect(() => {
    // Enhanced mobile detection with device capability checking
    const checkMobile = () => {
      const width = window.innerWidth
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const isSmallScreen = width < 768
      const isTablet = width >= 768 && width < 1024 && isTouchDevice
      
      setIsMobile(isSmallScreen || isTablet)
    }
    
    // Check WebGL support on client side
    const checkWebGL = () => {
      setWebGLSupported(isWebGLSupported())
    }
    
    checkMobile()
    checkWebGL()
    window.addEventListener('resize', checkMobile)
    
    // Debug info toggle (development only)
    if (process.env.NODE_ENV === 'development') {
      const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === 'd' && e.ctrlKey && e.shiftKey) {
          setShowDebugInfo(prev => !prev)
        }
      }
      window.addEventListener('keydown', handleKeyPress)
      return () => {
        window.removeEventListener('keydown', handleKeyPress)
        window.removeEventListener('resize', checkMobile)
      }
    }

    // Mouse tilt effect (only on desktop)
    const handleMouseMove = (e: MouseEvent) => {
      if (!isMobile && window.innerWidth >= 1024) {
        const { clientX, clientY } = e
        const { innerWidth, innerHeight } = window
        setMousePosition({
          x: (clientX / innerWidth - 0.5) * 10,
          y: (clientY / innerHeight - 0.5) * 10
        })
      }
    }

    const handleSunClick = () => {
      setAboutOpen(true)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('sunClicked', handleSunClick)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('sunClicked', handleSunClick)
    }
  }, [isMobile])

  // Transform scroll progress for different animation phases
  const titleOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const titleY = useTransform(scrollYProgress, [0, 0.3], [0, -50])
  const scrollProgress = scrollYProgress?.get() || 0
  const isInInteractionZone = scrollProgress > 0.7


  // Responsive project display based on device capabilities
  const displayedProjects = useMemo(() => {
    if (typeof window === 'undefined') return projects
    
    const width = window.innerWidth
    const isTouchDevice = 'ontouchstart' in window
    
    if (width < 768) {
      // Mobile: Show only 3 projects for performance
      return projects.slice(0, 3)
    } else if (width < 1024 && isTouchDevice) {
      // Tablet: Show all projects but may be touch-optimized
      return projects
    } else {
      // Desktop: Full experience
      return projects
    }
  }, [])

  // Accessibility handlers for keyboard navigation
  const handleSunFocus = useCallback(() => {
    setFocusedElement('sun')
  }, [])

  const handleProjectFocus = useCallback((projectId: string) => {
    setFocusedElement(projectId)
  }, [])

  const handleAboutOpen = useCallback(() => {
    setAboutOpen(true)
  }, [])

  // Early return for no WebGL support
  if (webGLSupported === false) {
    return <WebGLFallback />
  }

  // Loading state while checking WebGL
  if (webGLSupported === null) {
    return (
      <div className="h-screen bg-black flex items-center justify-center text-zinc-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading Solar System...</p>
        </div>
      </div>
    )
  }

  return (
    <Section 
      ref={sectionRef} 
      id="hero" 
      className="relative h-[400vh] overflow-hidden"
      aria-label="Interactive Solar System Portfolio"
      role="region"
    >
      <div suppressHydrationWarning>
      {/* Performance Monitor (dev only) */}
      <PerformanceMonitor showDebug={showDebugInfo} />
      
      {/* 3D Canvas Background - positioned behind everything */}
      <ErrorBoundary fallback={<WebGLFallback />}>
        <div className="sticky top-0 h-screen w-full">
        {/* Screen reader description */}
        <div className="sr-only">
          <h2>Interactive Solar System Portfolio</h2>
          <p>
            Navigate through a 3D solar system where projects orbit like planets around a central sun. 
            Scroll to approach the solar system and interact with planets to learn about projects. 
            Click the sun to learn more about me. Use Tab to navigate with keyboard.
          </p>
          <ul>
            {displayedProjects.map(project => (
              <li key={project.id}>
                {project.name}: {project.description}. Technologies: {project.tags.join(', ')}.
              </li>
            ))}
          </ul>
        </div>
        <Canvas
          className="absolute inset-0 z-0"
          style={{ 
            background: 'black',
            touchAction: 'pan-y'
          }}
          gl={{ 
            antialias: !isMobile, // Disable on mobile for performance
            alpha: true,
            powerPreference: isMobile ? "default" : "high-performance",
            preserveDrawingBuffer: false, // Better for mobile performance
            failIfMajorPerformanceCaveat: isMobile
          }}
          dpr={isMobile ? [1, 1.5] : [1, 2]} // Lower pixel ratio on mobile
          performance={{ min: isMobile ? 0.3 : 0.5 }} // More aggressive throttling on mobile
          shadows={false}
          frameloop="always" // Always render for smooth animations
        >
          <CameraController scrollProgress={scrollYProgress} />
          
          <Suspense fallback={null}>
            <Starfield scrollProgress={scrollYProgress} />
            <Sun scrollProgress={scrollYProgress} />
            <Orbits projects={displayedProjects} />
            
            {/* Focus indicator for sun */}
            <FocusIndicator
              isActive={focusedElement === 'sun'}
              position={[0, 0, 0]}
              radius={70}
              color="#ffd700"
            />
            
            {displayedProjects.map((project, index) => {
              const orbitRadius = project.orbit * 100
              const angle = Math.PI * 2 * index / displayedProjects.length
              const x = Math.cos(angle) * orbitRadius
              const z = Math.sin(angle) * orbitRadius
              
              return (
                <group key={project.id}>
                  <Planet 
                    project={project} 
                    mousePosition={mousePosition}
                    isMobile={isMobile}
                    index={index}
                    scrollProgress={scrollYProgress}
                  />
                  
                  {/* Focus indicator for planet */}
                  <FocusIndicator
                    isActive={focusedElement === project.id}
                    position={[x, 0, z]}
                    radius={20 + index * 3}
                    color={project.color}
                  />
                </group>
              )
            })}
          </Suspense>
        </Canvas>

        {/* Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 pointer-events-none" />
        
        {/* Title Content - fades out as you scroll */}
        <motion.div 
          className="absolute inset-0 z-20 flex items-center justify-center px-4"
          style={{ opacity: titleOpacity, y: titleY }}
        >
          <motion.div 
            className="text-center text-white max-w-4xl"
            variants={stagger(0.1)}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-b from-white to-zinc-300 bg-clip-text text-transparent"
              variants={fadeUp}
            >
              Solar Portfolio
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-zinc-300 mb-8 max-w-2xl mx-auto leading-relaxed"
              variants={fadeUp}
            >
              Navigate through my projects orbiting like planets around the creative sun
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={fadeUp}
            >
              <a href="#projects" className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-3 rounded-full hover:bg-white/20 transition-all duration-300 font-medium">
                Explore Projects
              </a>
              <button onClick={() => setAboutOpen(true)} className="bg-transparent border border-white/30 text-white px-8 py-3 rounded-full hover:border-white/50 hover:bg-white/5 transition-all duration-300 font-medium">
                About Me
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
        </div>
      </ErrorBoundary>

      {/* Keyboard Navigation Controls */}
      <KeyboardControls
        onSunFocus={handleSunFocus}
        onProjectFocus={handleProjectFocus}
        onAboutOpen={handleAboutOpen}
        isInInteractionZone={isInInteractionZone}
      />

      {/* Debug scroll progress indicator */}
      {process.env.NODE_ENV === 'development' && (
        <motion.div
          className="fixed top-4 right-4 z-50 bg-red-500 text-white p-4 rounded"
          style={{ 
            opacity: scrollYProgress ? 1 : 0.3
          }}
        >
          Scroll: {scrollYProgress ? Math.round((scrollYProgress.get() || 0) * 100) : 0}%
        </motion.div>
      )}

      {/* About Reveal Overlay */}
      <AboutReveal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />
      </div>
    </Section>
  )
}