'use client'

import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Html } from '@react-three/drei'
import * as THREE from 'three'
import { Project } from '@/lib/projects'
import { getOrbitalPosition } from '@/lib/three-utils'
import ProjectTooltip from '../projects/ProjectTooltip'

interface PlanetProps {
  project: Project
  mousePosition: { x: number; y: number }
  isMobile: boolean
  index: number
}

export default function Planet({ project, mousePosition, isMobile, index }: PlanetProps) {
  const planetRef = useRef<THREE.Mesh>(null)
  const planetGroupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const [tapped, setTapped] = useState(false)
  const angleRef = useRef(Math.random() * Math.PI * 2)

  const orbitRadius = project.orbit * 100 // Convert to pixels
  const planetSize = Math.max(12, 20 - index * 3) // Vary size by orbit
  const speed = 0.6 / project.orbit // Closer planets orbit faster

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
    if (planetRef.current && planetGroupRef.current) {
      // Orbital motion
      angleRef.current += 0.005 * speed
      const [x, y, z] = getOrbitalPosition(orbitRadius, angleRef.current)
      
      // Apply mouse tilt (±5°) on desktop
      let finalX = x
      let finalY = y
      let finalZ = z
      
      if (!isMobile) {
        const tiltStrength = 0.3
        finalX += mousePosition.x * tiltStrength
        finalY += mousePosition.y * tiltStrength * 0.5
      }
      
      planetGroupRef.current.position.set(finalX, finalY, finalZ)
      
      // Planet self-rotation
      planetRef.current.rotation.y += 0.008
      planetRef.current.rotation.x += 0.002
      
      // Hover/tap animation
      if (hovered || tapped) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1
        planetRef.current.scale.setScalar(scale)
      } else {
        planetRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1)
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
        onPointerEnter={() => !isMobile && setHovered(true)}
        onPointerLeave={() => !isMobile && setHovered(false)}
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

      {/* Soft highlight ring when near center */}
      <Sphere args={[planetSize * 1.6, 8, 8]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={hovered || tapped ? 0.1 : 0}
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