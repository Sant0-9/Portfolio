// 3D ready
'use client';

import { Suspense, useState, useEffect } from 'react';
import Spline from '@splinetool/react-spline';
import { motion } from 'framer-motion';

interface SplineSceneProps {
  scene: string;
  className?: string;
  fallback?: React.ReactNode;
  scale?: number;
  position?: { x?: number; y?: number; z?: number };
}

export default function SplineScene({
  scene,
  className = "",
  fallback,
  scale = 1,
  position = { x: 0, y: 0, z: 0 }
}: SplineSceneProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = (error: any) => {
    console.error('Spline scene failed to load:', error);
    setHasError(true);
    setIsLoading(false);
  };

  const LoadingFallback = () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center text-zinc-400">
        <motion.div
          className="w-16 h-16 mx-auto mb-4 rounded-xl bg-white/5 flex items-center justify-center"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </motion.div>
        <p className="text-sm font-medium">Loading 3D Scene...</p>
      </div>
    </div>
  );

  const ErrorFallback = () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center text-zinc-500">
        <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-red-500/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-red-400">Failed to load 3D scene</p>
        <p className="text-xs mt-1">Check console for details</p>
      </div>
    </div>
  );

  if (hasError) {
    return fallback || <ErrorFallback />;
  }

  return (
    <div className={`relative w-full h-full ${className}`} style={{ background: 'transparent' }}>
      {isLoading && (fallback || <LoadingFallback />)}

      <Suspense fallback={fallback || <LoadingFallback />}>
        <Spline
          scene={scene}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            width: '100%',
            height: '100%',
            opacity: isLoading ? 0 : 1,
            transition: 'opacity 0.5s ease-in-out',
            transform: `scale(${scale}) translate3d(${position.x}px, ${position.y}px, ${position.z}px)`,
            transformOrigin: 'center center',
            background: 'transparent'
          }}
        />
      </Suspense>
    </div>
  );
}
