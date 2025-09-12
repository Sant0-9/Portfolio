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
    const progress = scrollProgress?.get() || 0
    
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.003
      
      // Progressive scaling based on scroll phases
      let scaleMultiplier = 1
      if (progress > 0.3) {
        // Start growing slightly when approaching solar system
        scaleMultiplier = 1 + (progress - 0.3) * 0.2
      }
      if (progress > 0.75) {
        // Extra growth in interaction zone
        scaleMultiplier += (progress - 0.75) * 0.3
      }
      
      const pulseEffect = hovered ? 1.05 : 1
      const breathingEffect = 1 + Math.sin(time * 0.5) * 0.015
      const finalScale = scaleMultiplier * pulseEffect * breathingEffect
      
      sunRef.current.scale.setScalar(finalScale)
    }
    
    if (glowRef.current) {
      glowRef.current.rotation.y -= 0.002
      glowRef.current.rotation.z += 0.001
      
      // Dynamic glow based on scroll and hover
      const material = glowRef.current.material as THREE.MeshBasicMaterial
      const baseOpacity = 0.4 + (progress * 0.3)
      const hoverBoost = hovered ? 0.2 : 0
      material.opacity = Math.min(1, baseOpacity + hoverBoost)
    }
    
    if (rimGlowRef.current) {
      rimGlowRef.current.rotation.x += 0.001
      rimGlowRef.current.rotation.z -= 0.0015
      
      // Enhanced rim glow for interaction phase
      const material = rimGlowRef.current.material as THREE.MeshBasicMaterial
      const baseOpacity = 0.15 + (progress * 0.2)
      const interactionBoost = progress > 0.7 ? (progress - 0.7) * 0.3 : 0
      const hoverBoost = hovered ? 0.15 : 0
      material.opacity = Math.min(0.8, baseOpacity + interactionBoost + hoverBoost)
    }
  })

  return (
    <group>
      {/* Sun core */}
      <Sphere 
        ref={sunRef} 
        args={[50, 32, 32]} 
        position={[0, 0, 0]}
        onPointerEnter={(e) => {
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerLeave={(e) => {
          setHovered(false)
          document.body.style.cursor = 'default'
        }}
        onClick={(e) => {
          e.stopPropagation()
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