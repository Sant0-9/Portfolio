import { ReactNode, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface SectionProps {
  id?: string
  children: ReactNode
  className?: string
  fullHeight?: boolean
  'aria-label'?: string
  role?: string
}

const Section = forwardRef<HTMLElement, SectionProps>(({
  id, 
  children, 
  className, 
  fullHeight = false,
  'aria-label': ariaLabel,
  role 
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
      aria-label={ariaLabel}
      role={role}
    >
      {children}
    </section>
  )
})

Section.displayName = 'Section'

export default Section