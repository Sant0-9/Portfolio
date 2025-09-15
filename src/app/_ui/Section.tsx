'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { reveal, viewport } from './motion';
import { MOTION_DISABLED } from './motion';

interface SectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  heading?: string;
  subheading?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
}

const maxWidthClasses = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  '2xl': 'max-w-screen-2xl',
  full: 'max-w-full'
};

const paddingClasses = {
  sm: 'py-6',
  md: 'py-8',
  lg: 'py-12',
  xl: 'py-16'
};

export default function Section({
  id,
  children,
  className = '',
  heading,
  subheading,
  maxWidth = 'lg',
  padding = 'lg'
}: SectionProps) {
  return (
    <section
      id={id}
      className={`relative ${paddingClasses[padding]} ${className}`}
    >
      <div className={`mx-auto px-6 lg:px-8 ${maxWidthClasses[maxWidth]}`}>
        {(heading || subheading) && (
          <motion.div
            className="text-center mb-8"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={reveal}
          >
            {heading && (
              <motion.h2 
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
                initial={MOTION_DISABLED ? {} : {
                  textShadow: '0 0 15px rgba(0,240,255,0.4), 0 0 30px rgba(0,240,255,0.2), 0 2px 4px rgba(0,0,0,0.3)'
                }}
                whileInView={MOTION_DISABLED ? {} : {
                  textShadow: [
                    '0 0 15px rgba(0,240,255,0.4), 0 0 30px rgba(0,240,255,0.2), 0 2px 4px rgba(0,0,0,0.3)',
                    '0 0 25px rgba(0,240,255,0.6), 0 0 40px rgba(0,240,255,0.4), 0 2px 4px rgba(0,0,0,0.3)',
                    '0 0 15px rgba(0,240,255,0.4), 0 0 30px rgba(0,240,255,0.2), 0 2px 4px rgba(0,0,0,0.3)'
                  ],
                  transition: {
                    duration: 2,
                    ease: 'easeInOut',
                    delay: 0.5
                  }
                }}
                viewport={{ once: true }}
                style={{
                  fontFamily: 'Orbitron, monospace'
                }}
              >
                {heading}
              </motion.h2>
            )}
            {subheading && (
              <motion.p 
                className="text-lg text-zinc-300 max-w-2xl mx-auto"
                style={{
                  fontFamily: 'Exo 2, sans-serif',
                  textShadow: '0 0 8px rgba(116,185,255,0.3)'
                }}
              >
                {subheading}
              </motion.p>
            )}
          </motion.div>
        )}
        
        {children}
      </div>
    </section>
  );
}