'use client';

import { useEffect, useState } from 'react';

const ANIMATIONS_ENABLED = process.env.NEXT_PUBLIC_ANIMATIONS_ENABLED !== 'false';

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

export const MOTION_DISABLED = !ANIMATIONS_ENABLED || (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('Motion disabled:', MOTION_DISABLED);
}