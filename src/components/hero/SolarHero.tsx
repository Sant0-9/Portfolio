'use client'

import { Suspense, useState, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { useScroll, useTransform, motion } from 'framer-motion'
import Sun from './Sun'
import Planet from './Planet'
import Orbits from './Orbits'
import Starfield from './Starfield'
import { projects } from '@/lib/projects'
import Section from '@/components/common/Section'
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/motion'
import AboutReveal from '@/components/about/AboutReveal'
import * as THREE from 'three'

// Camera controller component
function CameraController({ scrollYProgress }: { scrollYProgress: any }) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)

  useFrame((state) => {
    if (cameraRef.current && scrollYProgress) {
      // Get current scroll progress value
      const progress = scrollYProgress.get()
      // Approach camera as user scrolls down (600 to 400)
      const targetZ = 600 - (progress * 200)
      cameraRef.current.position.z = THREE.MathUtils.lerp(cameraRef.current.position.z, targetZ, 0.02)
    }
  })

  return (
    <PerspectiveCamera 
      ref={cameraRef}
      makeDefault 
      position={[0, 150, 600]} 
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
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  })

  const scrollProgress = useTransform(scrollYProgress, [0, 1], [0, 1])

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)

    // Mouse tilt effect
    const handleMouseMove = (e: MouseEvent) => {
      if (!isMobile) {
        const { clientX, clientY } = e
        const { innerWidth, innerHeight } = window
        setMousePosition({
          x: (clientX / innerWidth - 0.5) * 10, // ±5° tilt
          y: (clientY / innerHeight - 0.5) * 10
        })
      }
    }

    // Sun click handler
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

  // Limit planets on mobile
  const displayedProjects = isMobile ? projects.slice(0, 3) : projects

  return (
    <Section ref={sectionRef} id="hero" className="relative min-h-screen overflow-hidden">
      {/* 3D Canvas Background */}
      <Canvas
        className="absolute inset-0 z-0"
        style={{ background: 'black' }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
        shadows={false}
      >
        <CameraController scrollYProgress={scrollYProgress} />
        
        <Suspense fallback={null}>
          <Starfield />
          <Sun scrollProgress={scrollYProgress} />
          <Orbits projects={displayedProjects} />
          {displayedProjects.map((project, index) => (
            <Planet 
              key={project.id} 
              project={project} 
              mousePosition={mousePosition}
              isMobile={isMobile}
              index={index}
            />
          ))}
        </Suspense>
      </Canvas>

      {/* Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 pointer-events-none" />
      
      {/* Centered Content */}
      <div className="relative z-20 flex items-center justify-center min-h-screen px-4">
        <motion.div 
          className="text-center text-white max-w-4xl"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-b from-white to-zinc-300 bg-clip-text text-transparent"
            variants={fadeInUp}
          >
            Solar Portfolio
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-zinc-300 mb-8 max-w-2xl mx-auto leading-relaxed"
            variants={staggerItem}
          >
            Navigate through my projects orbiting like planets around the creative sun
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={staggerItem}
          >
            <button className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-3 rounded-full hover:bg-white/20 transition-all duration-300 font-medium">
              Explore Projects
            </button>
            <button className="bg-transparent border border-white/30 text-white px-8 py-3 rounded-full hover:border-white/50 hover:bg-white/5 transition-all duration-300 font-medium">
              About Me
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* About Reveal Overlay */}
      <AboutReveal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />
    </Section>
  )
}