'use client';

import { useEffect, useState } from 'react';

const ANIMATIONS_ENABLED = process.env.NEXT_PUBLIC_ANIMATIONS_ENABLED !== 'false';
const DEBUG_MOTION_OFF = process.env.NEXT_PUBLIC_DEBUG_MOTION === 'off';

export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = () => {
      setReducedMotion(mediaQuery.matches);
    };

    handleChange();
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return reducedMotion;
}

export const MOTION_DISABLED = DEBUG_MOTION_OFF || !ANIMATIONS_ENABLED || (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('Motion disabled:', MOTION_DISABLED, {
    debugMotionOff: DEBUG_MOTION_OFF,
    animationsEnabled: ANIMATIONS_ENABLED,
    prefersReducedMotion: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  });
}