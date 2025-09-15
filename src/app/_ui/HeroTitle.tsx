'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MOTION_DISABLED } from './motion';

interface HeroTitleProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  bindToScroll?: boolean;
  parallaxHint?: boolean;
  typewriterLines?: string[];
}

export default function HeroTitle({
  title,
  subtitle,
  eyebrow,
  bindToScroll = true,
  parallaxHint = true,
  typewriterLines = []
}: HeroTitleProps) {
  const [titleChars, setTitleChars] = useState<string[]>([]);
  const [isGlitching, setIsGlitching] = useState(false);
  const [hasLoadGlitched, setHasLoadGlitched] = useState(false);
  const [currentTypewriterText, setCurrentTypewriterText] = useState('');
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [isTypewriterActive, setIsTypewriterActive] = useState(false);
  const { scrollYProgress } = useScroll();
  
  // Split title into characters on the client (memoized)
  const splitTitle = useCallback(() => {
    setTitleChars(title.split(''));
  }, [title]);
  
  useEffect(() => {
    splitTitle();
  }, [splitTitle]);

  // Load glitch effect - only once on mount
  useEffect(() => {
    if (MOTION_DISABLED || hasLoadGlitched) return;

    const timer = setTimeout(() => {
      setIsGlitching(true);
      setTimeout(() => {
        setIsGlitching(false);
        setHasLoadGlitched(true);
      }, 800); // 800ms glitch duration (matches CSS animation)
    }, 800); // Wait 800ms after load

    return () => clearTimeout(timer);
  }, [hasLoadGlitched]); // Include hasLoadGlitched in dependencies

  // Initialize typewriter after load delay
  useEffect(() => {
    if (!typewriterLines.length || MOTION_DISABLED) return;

    const startTimer = setTimeout(() => {
      setIsTypewriterActive(true);
    }, 1500); // Wait 1.5s after page load

    return () => clearTimeout(startTimer);
  }, [typewriterLines.length]);

  // Typewriter effect - cleaner implementation
  useEffect(() => {
    if (!isTypewriterActive || !typewriterLines.length || MOTION_DISABLED) return;

    let timeoutId: NodeJS.Timeout;
    let isActive = true;

    const typewriterCycle = async () => {
      if (!isActive) return;

      const currentLine = typewriterLines[currentLineIndex];
      setIsTyping(true);
      setCurrentTypewriterText('');

      // Type out the current line
      for (let i = 0; i <= currentLine.length; i++) {
        if (!isActive) return;
        await new Promise(resolve => {
          timeoutId = setTimeout(resolve, 75);
        });
        if (!isActive) return;
        setCurrentTypewriterText(currentLine.slice(0, i));
      }

      // Pause after typing
      if (!isActive) return;
      await new Promise(resolve => {
        timeoutId = setTimeout(resolve, 900);
      });

      // No glitch during typewriter - only on load and hover

      // Delete the current line
      for (let i = currentLine.length; i >= 0; i--) {
        if (!isActive) return;
        await new Promise(resolve => {
          timeoutId = setTimeout(resolve, 30);
        });
        if (!isActive) return;
        setCurrentTypewriterText(currentLine.slice(0, i));
      }

      // Pause before next line
      if (!isActive) return;
      await new Promise(resolve => {
        timeoutId = setTimeout(resolve, 300);
      });

      if (!isActive) return;
      setIsTyping(false);
      setCurrentLineIndex((prev) => (prev + 1) % typewriterLines.length);
    };

    typewriterCycle();

    return () => {
      isActive = false;
      clearTimeout(timeoutId);
    };
  }, [currentLineIndex, isTypewriterActive, typewriterLines, hasLoadGlitched]);

  // Cursor blinking effect
  useEffect(() => {
    if (!typewriterLines.length) return;

    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, [typewriterLines.length]);

  // Reduced motion typewriter - fade in/out lines
  useEffect(() => {
    if (!typewriterLines.length || !MOTION_DISABLED) return;

    const fadeInterval = setInterval(() => {
      setCurrentLineIndex((prev) => (prev + 1) % typewriterLines.length);
    }, 1200); // ~1.2s per line

    return () => clearInterval(fadeInterval);
  }, [typewriterLines.length]);

  // Enhanced scroll-based transforms
  const heroHeight = typeof window !== 'undefined' ? window.innerHeight : 1000;
  const fadeThreshold = 0.3;
  
  const titleOpacity = useTransform(
    scrollYProgress,
    [0, fadeThreshold, 0.6],
    [1, 0.8, 0]
  );
  
  const titleY = useTransform(
    scrollYProgress,
    [0, fadeThreshold, 0.6],
    [0, -30, -100]
  );
  
  const titleScale = useTransform(
    scrollYProgress,
    [0, fadeThreshold, 0.6],
    [1, 0.95, 0.8]
  );
  
  const titleBlur = useTransform(
    scrollYProgress,
    [0, 0.2, 0.6],
    [0, 0, 3]
  );
  

  // Parallax hint for subtitle
  const subtitleOffset = useTransform(
    scrollYProgress,
    [0, 0.2],
    [0, parallaxHint ? 8 : 0]
  );

  // Character stagger variants (memoized)
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: MOTION_DISABLED ? 0 : 0.025,
        delayChildren: 0.1
      }
    }
  }), []);

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
      <div className="text-left space-y-4">
        {eyebrow && (
          <div className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
            {eyebrow}
          </div>
        )}
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight" style={{ fontFamily: 'Orbitron, monospace', textShadow: '0 0 20px rgba(0,240,255,0.6), 0 0 40px rgba(0,240,255,0.4), 0 0 60px rgba(0,240,255,0.2), 0 4px 8px rgba(0,0,0,0.3)' }}>
          {title}
        </h1>
        
        {/* Typewriter lines for no-motion - fade in/out */}
        {typewriterLines.length > 0 && (
          <div className="text-xl md:text-2xl text-cyan-300 max-w-3xl leading-relaxed mt-8">
            <p style={{ fontFamily: 'Exo 2, sans-serif', textShadow: '0 0 15px rgba(0,240,255,0.4)' }}>
              {typewriterLines[currentLineIndex]} {/* Cycle through lines */}
            </p>
          </div>
        )}

        {subtitle && (
          <p className="text-lg md:text-xl text-zinc-300 max-w-2xl leading-relaxed" style={{ fontFamily: 'Exo 2, sans-serif', textShadow: '0 0 10px rgba(116,185,255,0.3)' }}>
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
      className="text-left space-y-4"
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
          style={{ 
            fontFamily: 'Exo 2, sans-serif',
            textShadow: '0 0 8px rgba(0,240,255,0.4)',
            letterSpacing: '0.2em'
          }}
        >
          {eyebrow}
        </motion.div>
      )}
      
      <motion.h1
        className={`text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight cursor-pointer ${isGlitching ? 'glitch-effect' : ''}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        aria-label={title}
        onMouseEnter={() => {
          if (!MOTION_DISABLED && hasLoadGlitched) {
            setIsGlitching(true);
          }
        }}
        onMouseLeave={() => {
          setIsGlitching(false);
        }}
        data-text={title}
        style={{
          fontFamily: 'Orbitron, monospace',
          textShadow: '0 0 20px rgba(0,240,255,0.6), 0 0 40px rgba(0,240,255,0.4), 0 0 60px rgba(0,240,255,0.2), 0 4px 8px rgba(0,0,0,0.3)',
          ...(bindToScroll ? {
            filter: `blur(${titleBlur}px)`,
            transform: `scale(${titleScale})`
          } : {})
        }}
      >
        {isGlitching && <div className="glitch-scanlines"></div>}
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
      
      {/* Typewriter animation */}
      {typewriterLines.length > 0 && (
        <motion.div
          className="text-xl md:text-2xl text-cyan-300 max-w-3xl leading-relaxed mt-8 min-h-[2rem]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          style={{
            fontFamily: 'Exo 2, sans-serif',
            textShadow: '0 0 15px rgba(0,240,255,0.4)'
          }}
        >
          <span className="inline-block">
            {currentTypewriterText}
            <span 
              className={`inline-block w-0.5 h-6 bg-cyan-400 ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'}`}
              style={{ animation: 'none' }}
            />
          </span>
        </motion.div>
      )}

      {subtitle && (
        <motion.p
          className="text-lg md:text-xl text-zinc-300 max-w-2xl leading-relaxed subtitle-pulse-animation"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: typewriterLines.length > 0 ? 1.6 : 0.8 }}
          style={{
            fontFamily: 'Exo 2, sans-serif',
            ...(parallaxHint ? { y: subtitleOffset } : {})
          }}
        >
          {subtitle}
        </motion.p>
      )}
    </MotionContainer>
  );
}