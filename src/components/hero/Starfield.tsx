'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

export default function Starfield() {
  const nearStarsRef = useRef<THREE.Points>(null)
  const farStarsRef = useRef<THREE.Points>(null)

  // Near stars layer (brighter, larger)
  const nearStars = useMemo(() => {
    const count = 800
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      
      // Distribute in a sphere
      const radius = Math.random() * 1500 + 800
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i3 + 2] = radius * Math.cos(phi)
      
      // Vary star colors (white to blue-white)
      const intensity = Math.random() * 0.4 + 0.8
      colors[i3] = intensity
      colors[i3 + 1] = intensity  
      colors[i3 + 2] = intensity + Math.random() * 0.2
    }
    
    return { positions, colors }
  }, [])

  // Far stars layer (dimmer, smaller, more numerous)
  const farStars = useMemo(() => {
    const count = 1500
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      
      // Distribute further out
      const radius = Math.random() * 2000 + 2000
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i3 + 2] = radius * Math.cos(phi)
      
      // Dimmer colors
      const intensity = Math.random() * 0.3 + 0.4
      colors[i3] = intensity
      colors[i3 + 1] = intensity
      colors[i3 + 2] = intensity + Math.random() * 0.1
    }
    
    return { positions, colors }
  }, [])

  // Subtle rotation for parallax effect
  useFrame((state) => {
    if (nearStarsRef.current) {
      nearStarsRef.current.rotation.y += 0.0002
    }
    if (farStarsRef.current) {
      farStarsRef.current.rotation.y += 0.0001
      farStarsRef.current.rotation.x += 0.00005
    }
  })

  return (
    <>
      {/* Near star layer */}
      <Points 
        ref={nearStarsRef}
        positions={nearStars.positions} 
        colors={nearStars.colors}
        stride={3} 
        frustumCulled={false}
      >
        <PointMaterial
          transparent
          vertexColors
          size={2.5}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </Points>

      {/* Far star layer */}
      <Points 
        ref={farStarsRef}
        positions={farStars.positions}
        colors={farStars.colors} 
        stride={3}
        frustumCulled={false}
      >
        <PointMaterial
          transparent
          vertexColors
          size={1.5}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </>
  )
}