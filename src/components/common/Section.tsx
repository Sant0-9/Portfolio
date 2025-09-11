import { ReactNode, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface SectionProps {
  id?: string
  children: ReactNode
  className?: string
  fullHeight?: boolean
}

const Section = forwardRef<HTMLElement, SectionProps>(({
  id, 
  children, 
  className, 
  fullHeight = false 
}, ref) => {
  return (
    <section 
      ref={ref}
      id={id}
      className={cn(
        "relative",
        fullHeight && "min-h-screen",
        className
      )}
    >
      {children}
    </section>
  )
})

Section.displayName = 'Section'

export default Section