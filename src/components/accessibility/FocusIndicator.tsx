'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RingGeometry } from 'three'
import * as THREE from 'three'

interface FocusIndicatorProps {
  isActive: boolean
  position: [number, number, number]
  radius: number
  color?: string
}

export default function FocusIndicator({ 
  isActive, 
  position, 
  radius, 
  color = '#ffffff' 
}: FocusIndicatorProps) {
  const ringRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!isActive) return
    
    const time = state.clock.elapsedTime
    
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.02
      
      // Pulsing effect
      const pulse = 1 + Math.sin(time * 4) * 0.1
      ringRef.current.scale.setScalar(pulse)
      
      // Opacity animation
      const material = ringRef.current.material as THREE.MeshBasicMaterial
      material.opacity = 0.8 + Math.sin(time * 3) * 0.2
    }
    
    if (glowRef.current) {
      glowRef.current.rotation.z -= 0.01
      const material = glowRef.current.material as THREE.MeshBasicMaterial
      material.opacity = 0.3 + Math.sin(time * 2) * 0.1
    }
  })

  if (!isActive) return null

  return (
    <group position={position}>
      {/* Main focus ring */}
      <mesh ref={ringRef}>
        <ringGeometry args={[radius * 1.2, radius * 1.4, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Subtle glow ring */}
      <mesh ref={glowRef}>
        <ringGeometry args={[radius * 1.1, radius * 1.6, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Accessibility dots for screen readers */}
      <mesh position={[0, 0, 1]}>
        <sphereGeometry args={[2, 8, 8]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  )
}