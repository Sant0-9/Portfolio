'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MOTION_DISABLED } from './hooks/useReducedMotion';

interface HeroTitleProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  bindToScroll?: boolean;
  parallaxHint?: boolean;
}

export default function HeroTitle({
  title,
  subtitle,
  eyebrow,
  bindToScroll = true,
  parallaxHint = true
}: HeroTitleProps) {
  const [titleChars, setTitleChars] = useState<string[]>([]);
  const { scrollYProgress } = useScroll();
  
  // Split title into characters on the client
  useEffect(() => {
    setTitleChars(title.split(''));
  }, [title]);

  // Scroll-based transforms
  const heroHeight = typeof window !== 'undefined' ? window.innerHeight : 1000;
  const fadeThreshold = 0.45;
  
  const titleOpacity = useTransform(
    scrollYProgress,
    [0, fadeThreshold],
    [1, 0]
  );
  
  const titleY = useTransform(
    scrollYProgress,
    [0, fadeThreshold],
    [0, -50]
  );

  // Parallax hint for subtitle
  const subtitleOffset = useTransform(
    scrollYProgress,
    [0, 0.2],
    [0, parallaxHint ? 8 : 0]
  );

  // Character stagger variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: MOTION_DISABLED ? 0 : 0.025,
        delayChildren: 0.1
      }
    }
  };

  const charVariants = {
    hidden: {
      opacity: 0,
      y: 16,
      filter: 'blur(4px)'
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: MOTION_DISABLED ? 0 : 0.6,
        ease: [0.25, 0.1, 0.25, 1] as const
      }
    }
  };

  // No-motion fallback
  if (MOTION_DISABLED) {
    return (
      <div className="text-center space-y-4">
        {eyebrow && (
          <div className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
            {eyebrow}
          </div>
        )}
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent leading-tight">
          {title}
        </h1>
        
        {subtitle && (
          <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    );
  }

  // Animated version
  const MotionContainer = bindToScroll ? motion.div : motion.div;
  
  return (
    <MotionContainer
      className="text-center space-y-4"
      style={bindToScroll ? {
        opacity: titleOpacity,
        y: titleY
      } : {}}
    >
      {eyebrow && (
        <motion.div
          className="text-sm font-medium text-zinc-400 uppercase tracking-wider"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {eyebrow}
        </motion.div>
      )}
      
      <motion.h1
        className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent leading-tight"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        aria-label={title}
      >
        {titleChars.map((char, index) => (
          <motion.span
            key={`${char}-${index}`}
            variants={charVariants}
            className="inline-block"
            style={{
              // Preserve whitespace
              ...(char === ' ' ? { width: '0.25em' } : {})
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </motion.h1>
      
      {subtitle && (
        <motion.p
          className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          style={parallaxHint ? { y: subtitleOffset } : {}}
        >
          {subtitle}
        </motion.p>
      )}
    </MotionContainer>
  );
}