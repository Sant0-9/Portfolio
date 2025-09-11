'use client'

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Text } from '@react-three/drei'
import { MotionValue } from 'framer-motion'
import * as THREE from 'three'

interface SunProps {
  scrollProgress: MotionValue<number>
}

export default function Sun({ scrollProgress }: SunProps) {
  const sunRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const rimGlowRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    const time = state.clock.elapsedTime
    const progress = scrollProgress.get()
    
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.003
      // Scale up slightly as scroll reaches end (after 75%)
      const scaleBoost = progress > 0.75 ? (progress - 0.75) * 0.4 : 0
      const scale = 1 + Math.sin(time * 0.5) * 0.02 + scaleBoost
      sunRef.current.scale.setScalar(scale)
    }
    
    if (glowRef.current) {
      glowRef.current.rotation.y -= 0.002
      glowRef.current.rotation.z += 0.001
      // Brighten glow based on scroll progress
      const material = glowRef.current.material as THREE.MeshBasicMaterial
      material.opacity = 0.4 + (progress * 0.2)
    }
    
    if (rimGlowRef.current) {
      rimGlowRef.current.rotation.x += 0.001
      rimGlowRef.current.rotation.z -= 0.0015
      // Brighten rim glow
      const material = rimGlowRef.current.material as THREE.MeshBasicMaterial
      material.opacity = 0.15 + (progress * 0.15)
    }
  })

  return (
    <group>
      {/* Sun core */}
      <Sphere 
        ref={sunRef} 
        args={[50, 32, 32]} 
        position={[0, 0, 0]}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onClick={() => {
          // This will be handled by the parent component
          window.dispatchEvent(new CustomEvent('sunClicked'))
        }}
      >
        <meshBasicMaterial
          color="#ffd700"
          transparent={false}
        />
      </Sphere>
      
      {/* Inner glow */}
      <Sphere ref={glowRef} args={[70, 24, 24]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color="#ff8c00"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>
      
      {/* Outer rim glow */}
      <Sphere ref={rimGlowRef} args={[100, 16, 16]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color="#ff6600"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Portfolio Logo/Text */}
      <Text
        position={[0, 0, 51]}
        fontSize={12}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        P
      </Text>
      
      {/* Sun lighting */}
      <pointLight
        position={[0, 0, 0]}
        intensity={1.5}
        color="#ffd700"
        distance={1500}
        decay={0.8}
      />
      
      {/* Ambient light for general illumination */}
      <ambientLight intensity={0.15} color="#ffffff" />
      
      {/* Subtle directional light */}
      <directionalLight
        position={[100, 100, 100]}
        intensity={0.3}
        color="#fff5e6"
      />
    </group>
  )
}