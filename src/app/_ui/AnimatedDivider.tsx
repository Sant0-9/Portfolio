'use client';

import { motion } from 'framer-motion';
import { MOTION_DISABLED } from './hooks/useReducedMotion';

interface AnimatedDividerProps {
  className?: string;
}

export default function AnimatedDivider({ className = '' }: AnimatedDividerProps) {
  const pathVariant = MOTION_DISABLED 
    ? { pathLength: 1, opacity: 1 }
    : {
        pathLength: [0, 1],
        opacity: [0, 1],
        transition: {
          pathLength: {
            duration: 1.5,
            ease: 'easeInOut',
            delay: 0.3
          },
          opacity: {
            duration: 0.5,
            delay: 0.2
          }
        }
      };

  return (
    <div className={`flex justify-center ${className}`}>
      <svg
        width="120"
        height="4"
        viewBox="0 0 120 4"
        fill="none"
        className="overflow-visible"
      >
        <motion.path
          d="M2 2 L118 2"
          stroke="url(#divider-gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={pathVariant}
          viewport={{ once: true, margin: '-10%' }}
        />
        <defs>
          <linearGradient id="divider-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="25%" stopColor="#14B8A6" />
            <stop offset="75%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}