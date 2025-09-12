'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { useReducedMotion, MotionValue } from 'framer-motion'

interface StarfieldProps {
  scrollProgress?: MotionValue<number>
}

export default function Starfield({ scrollProgress }: StarfieldProps) {
  const nearStarsRef = useRef<THREE.Points>(null)
  const farStarsRef = useRef<THREE.Points>(null)
  const prefersReducedMotion = useReducedMotion()
  const deviceInfo = useMemo(() => {
    if (typeof window === 'undefined') return { isMobile: false, isLowEnd: false }
    
    const width = window.innerWidth
    const isTouchDevice = 'ontouchstart' in window
    const isMobile = width < 768
    const isTablet = width >= 768 && width < 1024 && isTouchDevice
    
    // Detect low-end devices
    const isLowEnd = isMobile || (
      (navigator as any).hardwareConcurrency && 
      (navigator as any).hardwareConcurrency <= 2
    ) || (
      (navigator as any).deviceMemory && 
      (navigator as any).deviceMemory <= 2
    )
    
    return { isMobile: isMobile || isTablet, isLowEnd }
  }, [])

  // Near stars layer (brighter, larger)
  const nearStars = useMemo(() => {
    const base = prefersReducedMotion ? 300 : 800
    let count = base
    
    if (deviceInfo.isLowEnd) {
      count = Math.floor(base * 0.4) // Significantly reduce for low-end devices
    } else if (deviceInfo.isMobile) {
      count = Math.floor(base * 0.6) // Moderate reduction for mobile
    }
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
  }, [deviceInfo.isMobile, deviceInfo.isLowEnd, prefersReducedMotion])

  // Far stars layer (dimmer, smaller, more numerous)
  const farStars = useMemo(() => {
    const base = prefersReducedMotion ? 600 : 1500
    let count = base
    
    if (deviceInfo.isLowEnd) {
      count = Math.floor(base * 0.3) // Aggressive reduction for low-end devices
    } else if (deviceInfo.isMobile) {
      count = Math.floor(base * 0.6) // Moderate reduction for mobile
    }
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
  }, [deviceInfo.isMobile, deviceInfo.isLowEnd, prefersReducedMotion])

  // Enhanced parallax effect that responds to scroll
  useFrame((state) => {
    if (prefersReducedMotion) return
    
    const progress = scrollProgress?.get() || 0
    const time = state.clock.elapsedTime
    
    if (nearStarsRef.current) {
      // Near stars move faster and respond more to scroll
      const baseRotation = time * 0.0002
      const scrollInfluence = progress * 0.0005
      nearStarsRef.current.rotation.y = baseRotation + scrollInfluence
      nearStarsRef.current.rotation.x = Math.sin(time * 0.0001) * 0.02
      
      // Brightness increases as we approach the solar system
      const material = nearStarsRef.current.material as THREE.PointsMaterial
      material.opacity = 0.6 + (progress * 0.4) // 0.6 -> 1.0
    }
    
    if (farStarsRef.current) {
      // Far stars move slower with subtle multi-axis rotation
      const baseRotationY = time * 0.0001
      const baseRotationX = time * 0.00005
      const scrollInfluenceY = progress * 0.0003
      const scrollInfluenceX = progress * 0.0001
      
      farStarsRef.current.rotation.y = baseRotationY + scrollInfluenceY
      farStarsRef.current.rotation.x = baseRotationX + scrollInfluenceX
      farStarsRef.current.rotation.z = Math.cos(time * 0.00008) * 0.01
      
      // Far stars also get slightly brighter
      const material = farStarsRef.current.material as THREE.PointsMaterial
      material.opacity = 0.3 + (progress * 0.2) // 0.3 -> 0.5
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
