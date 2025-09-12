import { Variants } from 'framer-motion'

// fadeUp {opacity:0,y:20} → {opacity:1,y:0}
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

// stagger(int) parent variant
export const stagger = (interval: number = 0.1): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: interval,
      delayChildren: interval * 2,
    },
  },
})

// scaleIn for the Sun highlight
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}
