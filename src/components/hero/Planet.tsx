'use client'

import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Html } from '@react-three/drei'
import * as THREE from 'three'
import { Project } from '@/lib/projects'
import { getOrbitalPosition } from '@/lib/three-utils'
import ProjectTooltip from '../projects/ProjectTooltip'
import { useReducedMotion } from 'framer-motion'

interface PlanetProps {
  project: Project
  mousePosition: { x: number; y: number }
  isMobile: boolean
  index: number
  scrollProgress?: any
}

export default function Planet({ project, mousePosition, isMobile, index, scrollProgress }: PlanetProps) {
  const planetRef = useRef<THREE.Mesh>(null)
  const planetGroupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const [tapped, setTapped] = useState(false)
  const angleRef = useRef(Math.random() * Math.PI * 2)
  const prefersReducedMotion = useReducedMotion()
  const highlightRef = useRef<THREE.Mesh>(null)

  const orbitRadius = project.orbit * 100 // Convert to pixels
  const planetSize = Math.max(12, 20 - index * 3) // Vary size by orbit
  const baseSpeed = 0.6 / project.orbit // Closer planets orbit faster

  useEffect(() => {
    // Close tooltip on outside click for mobile
    const handleClickOutside = (e: MouseEvent) => {
      if (isMobile && tapped && planetRef.current) {
        setTapped(false)
      }
    }

    if (tapped) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [tapped, isMobile])

  useFrame((state) => {
    const progress = scrollProgress?.get() || 0
    const time = state.clock.elapsedTime
    const isInInteractionZone = progress > 0.7
    
    
    if (planetRef.current && planetGroupRef.current) {
      // Orbital motion (respect reduced motion)
      const speed = prefersReducedMotion ? 0 : baseSpeed
      angleRef.current += 0.005 * speed
      const [x, y, z] = getOrbitalPosition(orbitRadius, angleRef.current)
      
      // Apply mouse tilt (±5°) on desktop
      let finalX = x
      let finalY = y
      let finalZ = z
      
      if (!isMobile && !prefersReducedMotion) {
        const tiltStrength = 0.3
        finalX += mousePosition.x * tiltStrength
        finalY += mousePosition.y * tiltStrength * 0.5
      }
      
      planetGroupRef.current.position.set(finalX, finalY, finalZ)
      
      // Planet self-rotation with slight acceleration in interaction zone
      if (!prefersReducedMotion) {
        const rotationMultiplier = isInInteractionZone ? 1.5 : 1
        planetRef.current.rotation.y += 0.008 * rotationMultiplier
        planetRef.current.rotation.x += 0.002 * rotationMultiplier
      }
      
      // Enhanced hover/tap animation with interaction zone consideration
      const isInteractive = hovered || tapped || (isInInteractionZone && !prefersReducedMotion)
      if (isInteractive) {
        const pulseIntensity = (hovered || tapped) ? 0.15 : 0.05
        const scale = 1 + Math.sin(time * 3) * pulseIntensity
        planetRef.current.scale.setScalar(scale)
      } else {
        planetRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1)
      }
    }

    // Enhanced highlight system with scroll awareness
    if (highlightRef.current) {
      const mat = highlightRef.current.material as THREE.MeshBasicMaterial
      const group = planetGroupRef.current
      if (group) {
        const dist = Math.hypot(group.position.x, group.position.z)
        const proximity = Math.max(0, 1 - dist / (orbitRadius))
        
        let baseOpacity = 0
        if (hovered || tapped) {
          baseOpacity = 0.15
        } else if (isInInteractionZone) {
          // Gentle ambient glow in interaction zone
          baseOpacity = 0.03
        }
        
        // Enhanced center proximity glow in interaction zone
        const centerGlow = prefersReducedMotion ? 0 : proximity * (isInInteractionZone ? 0.08 : 0.04)
        mat.opacity = Math.min(0.3, baseOpacity + centerGlow)
      }
    }
  })

  const handlePointerEvents = (e: any) => {
    e.stopPropagation()
    if (isMobile) {
      setTapped(!tapped)
    } else {
      setHovered(true)
    }
  }

  return (
    <group ref={planetGroupRef}>
      <Sphere
        ref={planetRef}
        args={[planetSize, 12, 12]}
        onPointerEnter={() => {
          if (!isMobile) {
            setHovered(true)
            document.body.style.cursor = 'pointer'
          }
        }}
        onPointerLeave={() => {
          if (!isMobile) {
            setHovered(false)
            document.body.style.cursor = 'default'
          }
        }}
        onClick={handlePointerEvents}
      >
        <meshLambertMaterial
          color={project.color}
          transparent
          opacity={0.9}
        />
      </Sphere>
      
      {/* Planet glow */}
      <Sphere args={[planetSize * 1.3, 8, 8]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color={project.color}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>

      {/* Soft highlight ring when near center or hover */}
      <Sphere ref={highlightRef} args={[planetSize * 1.6, 8, 8]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>
      
      {(hovered || tapped) && (
        <Html
          center
          distanceFactor={12}
          className="pointer-events-none select-none"
          style={{ zIndex: 1000 }}
        >
          <ProjectTooltip project={project} />
        </Html>
      )}
    </group>
  )
}
