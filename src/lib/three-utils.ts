import * as THREE from 'three'

// Create instanced stars for performance
export function createStarField(count: number = 1000): THREE.Points {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  
  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    
    // Random positions in a sphere
    const radius = Math.random() * 2000 + 500
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(Math.random() * 2 - 1)
    
    positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i3 + 2] = radius * Math.cos(phi)
    
    // Vary star colors (white to blue-white)
    const intensity = Math.random() * 0.5 + 0.5
    colors[i3] = intensity
    colors[i3 + 1] = intensity
    colors[i3 + 2] = intensity + Math.random() * 0.2
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  
  const material = new THREE.PointsMaterial({
    size: 2,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true
  })
  
  return new THREE.Points(geometry, material)
}

// Calculate orbital position
export function getOrbitalPosition(
  radius: number, 
  angle: number, 
  eccentricity: number = 0
): [number, number, number] {
  const x = radius * Math.cos(angle) * (1 + eccentricity)
  const z = radius * Math.sin(angle) * (1 - eccentricity)
  return [x, 0, z]
}

// Convert hex color to RGB array
export function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255
  ] : [1, 1, 1]
}

// Smooth camera transition helper
export function lerpVector3(
  start: THREE.Vector3,
  end: THREE.Vector3,
  alpha: number
): THREE.Vector3 {
  return start.clone().lerp(end, alpha)
}

// Performance monitoring
export function setupPerformanceMonitoring(): {
  fps: number
  frameTime: number
} {
  let fps = 0
  let frameTime = 0
  let lastTime = performance.now()
  let frameCount = 0
  
  const stats = { fps, frameTime }
  
  const update = () => {
    const now = performance.now()
    frameTime = now - lastTime
    lastTime = now
    frameCount++
    
    if (frameCount % 60 === 0) {
      stats.fps = Math.round(1000 / frameTime)
      stats.frameTime = Math.round(frameTime * 100) / 100
    }
    
    requestAnimationFrame(update)
  }
  
  update()
  return stats
}