'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { reveal, viewport } from './motion';

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
  sm: 'py-12',
  md: 'py-16',
  lg: 'py-20',
  xl: 'py-24'
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
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={reveal}
          >
            {heading && (
              <motion.h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent mb-4">
                {heading}
              </motion.h2>
            )}
            {subheading && (
              <motion.p className="text-lg text-zinc-400 max-w-2xl mx-auto">
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