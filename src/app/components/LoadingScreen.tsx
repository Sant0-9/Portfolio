'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useLoading } from '../context/LoadingContext';

interface LoadingScreenProps {
  isLoading: boolean;
  onLoadingComplete?: () => void;
}

export default function LoadingScreen({ isLoading, onLoadingComplete }: LoadingScreenProps) {
  const [showLogo, setShowLogo] = useState(true);
  const [visible, setVisible] = useState<boolean>(isLoading);
  const { loadingProgress } = useLoading();

  // Sync local visibility with global loading state to allow exit animation
  useEffect(() => {
    if (isLoading) {
      setVisible(true);
      setShowLogo(true);
    } else {
      // trigger exit; after exit animation, fire callback
      setShowLogo(false);
      const doneTimer = setTimeout(() => {
        setVisible(false);
        onLoadingComplete?.();
      }, 500); // match motion.div exit duration
      return () => clearTimeout(doneTimer);
    }
  }, [isLoading, onLoadingComplete]);

  return (
    <AnimatePresence>
      {visible && (
      <motion.div
        className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />

          {/* Animated Particles */}
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 1, 0.3],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center space-y-8">
          {/* Logo Animation */}
          <AnimatePresence>
            {showLogo && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.1, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <motion.h1
                  className="text-4xl lg:text-6xl font-bold text-white mb-4"
                  style={{
                    fontFamily: 'Orbitron, monospace',
                    textShadow: '0 0 20px rgba(0,240,255,0.6), 0 0 40px rgba(0,240,255,0.4)'
                  }}
                  animate={{
                    textShadow: [
                      '0 0 20px rgba(0,240,255,0.6), 0 0 40px rgba(0,240,255,0.4)',
                      '0 0 30px rgba(0,240,255,0.8), 0 0 60px rgba(0,240,255,0.6)',
                      '0 0 20px rgba(0,240,255,0.6), 0 0 40px rgba(0,240,255,0.4)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  OneKnight
                </motion.h1>
                <motion.p
                  className="text-white/70 text-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Full-Stack Developer & AI Enthusiast
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading Progress */}
          <div className="w-80 max-w-sm mx-auto">
            {/* Progress Bar */}
            <div className="relative h-2 bg-white/10 rounded-full overflow-hidden mb-4">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-teal-400 to-purple-500 rounded-full"
                style={{ width: `${loadingProgress}%` }}
                initial={{ width: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />

              {/* Animated Glow */}
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-teal-400/50 to-purple-500/50 rounded-full blur-sm"
                style={{ width: `${loadingProgress}%` }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </div>

            {/* Progress Text */}
            <div className="flex justify-between items-center text-white/60 text-sm">
              <span>Loading 3D Experience...</span>
              <motion.span
                key={Math.round(loadingProgress)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="font-mono"
              >
                {Math.round(loadingProgress)}%
              </motion.span>
            </div>
          </div>

          {/* Loading Dots */}
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-white/40 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>

          {/* Hint Text */}
          <motion.div
            className="text-center text-white/50 text-sm max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p>Preparing immersive portfolio experience...</p>
            <p className="mt-1 text-xs">Loading 3D models and assets</p>
          </motion.div>
        </div>

        {/* Subtle Grid Background */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          />
        </div>
      </motion.div>
      )}
    </AnimatePresence>
  );
}
