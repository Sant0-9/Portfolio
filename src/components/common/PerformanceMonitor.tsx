'use client'

import { useEffect, useState, useRef } from 'react'

interface PerformanceStats {
  fps: number
  frameTime: number
  memory?: number
}

interface PerformanceMonitorProps {
  onPerformanceChange?: (stats: PerformanceStats) => void
  showDebug?: boolean
}

export default function PerformanceMonitor({ 
  onPerformanceChange, 
  showDebug = false 
}: PerformanceMonitorProps) {
  const [stats, setStats] = useState<PerformanceStats>({ fps: 0, frameTime: 0 })
  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    let fpsBuffer: number[] = []
    let frameTimeBuffer: number[] = []
    
    const updateStats = (currentTime: number) => {
      const deltaTime = currentTime - lastTimeRef.current
      frameCountRef.current++
      
      // Calculate FPS (every 60 frames for stability)
      if (frameCountRef.current % 60 === 0) {
        const fps = Math.round(1000 / deltaTime)
        const frameTime = Math.round(deltaTime * 100) / 100
        
        // Use buffers to smooth out measurements
        fpsBuffer.push(fps)
        frameTimeBuffer.push(frameTime)
        
        if (fpsBuffer.length > 10) {
          fpsBuffer.shift()
          frameTimeBuffer.shift()
        }
        
        const avgFps = Math.round(fpsBuffer.reduce((a, b) => a + b) / fpsBuffer.length)
        const avgFrameTime = Math.round(frameTimeBuffer.reduce((a, b) => a + b) / frameTimeBuffer.length * 100) / 100
        
        // Get memory usage if available
        const memory = (performance as any).memory?.usedJSHeapSize 
          ? Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024)
          : undefined
        
        const newStats = {
          fps: avgFps,
          frameTime: avgFrameTime,
          memory
        }
        
        setStats(newStats)
        onPerformanceChange?.(newStats)
        
        // Auto-optimization: warn if performance is poor
        if (avgFps < 30) {
          console.warn('Low FPS detected:', avgFps, 'fps - Consider reducing particle counts or effects')
        }
        
        if (memory && memory > 100) {
          console.warn('High memory usage detected:', memory, 'MB')
        }
      }
      
      lastTimeRef.current = currentTime
      animationFrameRef.current = requestAnimationFrame(updateStats)
    }
    
    animationFrameRef.current = requestAnimationFrame(updateStats)
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [onPerformanceChange])

  if (!showDebug) return null

  return (
    <div className="fixed top-16 right-4 z-50 bg-black/80 backdrop-blur-sm border border-zinc-700 rounded-lg p-3 text-white text-xs font-mono">
      <div className="space-y-1">
        <div className={`${stats.fps < 30 ? 'text-red-400' : stats.fps < 50 ? 'text-yellow-400' : 'text-green-400'}`}>
          FPS: {stats.fps}
        </div>
        <div>Frame: {stats.frameTime}ms</div>
        {stats.memory && (
          <div className={stats.memory > 100 ? 'text-yellow-400' : 'text-zinc-300'}>
            Memory: {stats.memory}MB
          </div>
        )}
      </div>
    </div>
  )
}