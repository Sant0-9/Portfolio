'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { MOTION_DISABLED } from './motion';

interface AnimatedButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
  target?: string;
  rel?: string;
  disabled?: boolean;
}

export default function AnimatedButton({
  children,
  href,
  onClick,
  variant = 'primary',
  className = '',
  target,
  rel,
  disabled = false
}: AnimatedButtonProps) {
  const baseClasses = 'relative inline-flex items-center justify-center px-6 py-3 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900';
  
  const variantClasses = {
    primary: 'bg-teal-500 hover:bg-teal-600 text-white focus:ring-teal-400/50',
    secondary: 'bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 focus:ring-white/50 backdrop-blur-xl overflow-hidden',
    ghost: 'text-teal-400 hover:text-teal-300 focus:ring-teal-400/50'
  };

  const hoverVariants = MOTION_DISABLED ? {} : {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: [0.25, 0.1, 0.25, 1] as const
    }
  };

  const tapVariants = MOTION_DISABLED ? {} : {
    scale: 0.98
  };

  const underlineVariants = MOTION_DISABLED
    ? { backgroundSize: '100% 2px' }
    : {
        backgroundSize: ['0% 2px', '100% 2px'],
        transition: {
          duration: 0.25,
          ease: [0.25, 0.1, 0.25, 1] as const
        }
      };

  const Component = href ? motion.a : motion.button;

  return (
    <Component
      {...(href && { href, target, rel })}
      {...(!href && { onClick, disabled })}
      className={`${baseClasses} ${variantClasses[variant]} ${className} ${
        variant === 'ghost' ? 'bg-gradient-to-r from-transparent to-transparent bg-no-repeat bg-bottom hover:from-teal-400 hover:to-teal-400' : ''
      }`}
      style={variant === 'ghost' ? {
        backgroundSize: '0% 2px',
        backgroundImage: 'linear-gradient(to right, #14B8A6, #14B8A6)'
      } : {}}
      whileHover={hoverVariants}
      whileTap={tapVariants}
      onHoverStart={() => {
        if (variant === 'ghost' && !MOTION_DISABLED) {
          // Trigger underline animation
        }
      }}
      initial={variant === 'ghost' ? { backgroundSize: '0% 2px' } : {}}
      whileInView={variant === 'ghost' && !MOTION_DISABLED ? underlineVariants : {}}
      viewport={{ once: false }}
    >
      {variant === 'secondary' && (
        <>
          {/* Liquid glass effects */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-teal-400/2 to-purple-500/2 opacity-80" />
          <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-white/2 to-transparent" />

          {/* Flowing liquid effect */}
          <motion.div
            className="absolute inset-0 rounded-lg opacity-30"
            animate={{
              background: [
                'radial-gradient(circle at 30% 50%, rgba(20, 184, 166, 0.06) 0%, transparent 60%)',
                'radial-gradient(circle at 70% 50%, rgba(139, 92, 246, 0.06) 0%, transparent 60%)',
                'radial-gradient(circle at 30% 50%, rgba(20, 184, 166, 0.06) 0%, transparent 60%)'
              ]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Glass refraction line */}
          <motion.div
            className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
        </>
      )}
      <span className={variant === 'secondary' ? 'relative z-10' : ''}>{children}</span>
    </Component>
  );
}