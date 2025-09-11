'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Project } from '@/lib/projects'

interface OrbitsProps {
  projects: Project[]
}

export default function Orbits({ projects }: OrbitsProps) {
  const orbitsRef = useRef<THREE.Group>(null)

  const orbits = useMemo(() => {
    return projects.map((project) => {
      const points = []
      const segments = 64
      const radius = project.orbit * 100
      
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        points.push(new THREE.Vector3(x, 0, z))
      }
      
      return {
        geometry: new THREE.BufferGeometry().setFromPoints(points),
        radius: radius,
        opacity: Math.max(0.15, 0.6 - (project.orbit / 5))
      }
    })
  }, [projects])

  // Slow rotation
  useFrame((state) => {
    if (orbitsRef.current) {
      orbitsRef.current.rotation.y += 0.0008
    }
  })

  return (
    <group ref={orbitsRef}>
      {orbits.map((orbit, index) => (
        <group key={projects[index].id}>
          {/* Main orbit ring */}
          <line>
            <primitive object={orbit.geometry} />
            <lineBasicMaterial
              color="#444444"
              transparent
              opacity={orbit.opacity}
              linewidth={1}
            />
          </line>
          
          {/* Subtle inner glow ring */}
          <line>
            <primitive object={orbit.geometry} />
            <lineBasicMaterial
              color="#666666"
              transparent
              opacity={orbit.opacity * 0.3}
              linewidth={2}
              blending={THREE.AdditiveBlending}
            />
          </line>
        </group>
      ))}
    </group>
  )
}