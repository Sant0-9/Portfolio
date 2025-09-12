'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { projects } from '@/lib/projects'

interface KeyboardControlsProps {
  onSunFocus: () => void
  onProjectFocus: (projectId: string) => void
  onAboutOpen: () => void
  isInInteractionZone: boolean
}

export default function KeyboardControls({ 
  onSunFocus, 
  onProjectFocus, 
  onAboutOpen,
  isInInteractionZone 
}: KeyboardControlsProps) {
  const [focusedElement, setFocusedElement] = useState<'sun' | string | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  const focusableElements = useMemo(() => ['sun', ...projects.map(p => p.id)], [])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Only activate keyboard navigation in interaction zone or when user presses Tab
    if (!isInInteractionZone && e.key !== 'Tab') return

    switch (e.key) {
      case 'Tab':
        e.preventDefault()
        setIsVisible(true)
        
        const currentIndex = focusedElement ? focusableElements.indexOf(focusedElement) : -1
        const nextIndex = e.shiftKey 
          ? (currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1)
          : (currentIndex >= focusableElements.length - 1 ? 0 : currentIndex + 1)
        
        const nextElement = focusableElements[nextIndex]
        setFocusedElement(nextElement)
        
        if (nextElement === 'sun') {
          onSunFocus()
        } else {
          onProjectFocus(nextElement)
        }
        break

      case 'Enter':
      case ' ':
        if (focusedElement === 'sun') {
          e.preventDefault()
          onAboutOpen()
        } else if (focusedElement && projects.find(p => p.id === focusedElement)) {
          e.preventDefault()
          // Could trigger project details or external link
          const project = projects.find(p => p.id === focusedElement)
          if (project?.demo && project.demo !== '#') {
            window.open(project.demo, '_blank')
          }
        }
        break

      case 'Escape':
        setFocusedElement(null)
        setIsVisible(false)
        break
    }
  }, [focusedElement, focusableElements, onSunFocus, onProjectFocus, onAboutOpen, isInInteractionZone])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    
    // Hide keyboard navigation when mouse is used
    const handleMouseMove = () => {
      if (isVisible) {
        setIsVisible(false)
        setFocusedElement(null)
      }
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [handleKeyDown, isVisible])

  if (!isVisible && !focusedElement) return null

  return (
    <div 
      className="absolute bottom-4 left-4 z-50 bg-black/80 backdrop-blur-sm border border-zinc-700 rounded-lg p-3 text-white text-sm max-w-xs"
      role="region"
      aria-label="Keyboard navigation help"
    >
      <div className="mb-2 font-medium">Keyboard Navigation Active</div>
      <div className="space-y-1 text-xs text-zinc-300">
        <div><kbd className="bg-zinc-800 px-1 rounded">Tab</kbd> Navigate elements</div>
        <div><kbd className="bg-zinc-800 px-1 rounded">Enter</kbd> Activate focused element</div>
        <div><kbd className="bg-zinc-800 px-1 rounded">Esc</kbd> Exit navigation</div>
      </div>
      {focusedElement && (
        <div className="mt-2 pt-2 border-t border-zinc-700">
          <div className="font-medium">
            {focusedElement === 'sun' ? 'Sun (About Me)' : 
             projects.find(p => p.id === focusedElement)?.name}
          </div>
        </div>
      )}
    </div>
  )
}