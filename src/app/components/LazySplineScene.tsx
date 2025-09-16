'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { motion } from 'framer-motion';

// Dynamically import SplineScene to reduce initial bundle size
const SplineScene = dynamic(() => import('../_ui/SplineScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <motion.div
        className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center"
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
        <div className="w-8 h-8 border-2 border-white/30 border-t-white/80 rounded-full animate-spin" />
      </motion.div>
    </div>
  )
});

interface LazySplineSceneProps {
  scene: string;
  className?: string;
  scale?: number;
  position?: { x?: number; y?: number; z?: number };
  quality?: 'low' | 'medium' | 'high' | 'ultra';
  enableInteraction?: boolean;
  onSceneInteraction?: (event?: any) => void;
}

export default function LazySplineScene(props: LazySplineSceneProps) {
  return (
    <Suspense fallback={
      <div className="w-full h-full flex items-center justify-center">
        <motion.div
          className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center"
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
          <div className="w-8 h-8 border-2 border-white/30 border-t-white/80 rounded-full animate-spin" />
        </motion.div>
      </div>
    }>
      <SplineScene {...props} />
    </Suspense>
  );
}