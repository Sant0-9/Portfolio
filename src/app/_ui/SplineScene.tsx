// 3D ready
'use client';

import { Suspense, useState, useEffect } from 'react';
import Spline from '@splinetool/react-spline';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLoading } from '../context/LoadingContext';

interface SplineSceneProps {
  scene: string;
  className?: string;
  fallback?: React.ReactNode;
  scale?: number;
  position?: { x?: number; y?: number; z?: number };
  enableScrollEffects?: boolean;
  quality?: 'low' | 'medium' | 'high' | 'ultra';
  enableInteraction?: boolean;
  onSceneInteraction?: () => void;
  fallbackScene?: string; // local fallback scene path
}

export default function SplineScene({
  scene,
  className = "",
  fallback,
  scale = 1,
  position = { x: 0, y: 0, z: 0 },
  enableScrollEffects = false,
  quality = 'high',
  enableInteraction = false,
  onSceneInteraction,
  fallbackScene
}: SplineSceneProps) {
  // Detect mobile for performance optimization
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentScene, setCurrentScene] = useState(scene);
  const [triedFallback, setTriedFallback] = useState(false);
  const [splineApp, setSplineApp] = useState<any>(null);

  const { registerLoader, markLoaderComplete } = useLoading();
  const loaderId = `spline-${scene}`;

  // Scroll-based effects
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [1, 0.7, 0.2]);
  const scaleTransform = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.1, 1.2]);
  const yTransform = useTransform(scrollYProgress, [0, 1], [0, -100]);

  // Register this loader on mount
  useEffect(() => {
    registerLoader(loaderId);
  }, [registerLoader, loaderId]);

  const handleLoad = (spline: any) => {
    console.log('Spline scene loaded successfully');
    setIsLoading(false);
    setSplineApp(spline);
    markLoaderComplete(loaderId);

    if (enableInteraction && spline) {
      // Skip complex interactions on mobile for better performance
      if (isMobile) {
        // Simple mobile interaction - just trigger scene interaction on any click
        spline.addEventListener('mouseDown', (e: any) => {
          if (onSceneInteraction) {
            onSceneInteraction();
          }
        });
        return;
      }

      // Add mouse event listeners for hover effects (desktop only)
      spline.addEventListener('mouseHover', (e: any) => {
        console.log('Mouse hover:', e);
        if (e.target) {
          // Add multiple lighting effects
          if (e.target.emissiveIntensity !== undefined) {
            e.target.emissiveIntensity = 0.3;
          }
          if (e.target.material) {
            e.target.material.emissiveIntensity = 0.3;
          }
          // Add brightness/exposure increase
          if (e.target.brightness !== undefined) {
            e.target.brightness = 1.5;
          }
        }
      });

      spline.addEventListener('mouseDown', (e: any) => {
        console.log('Mouse down:', e);
        console.log('Target name:', e.target?.name);
        console.log('Target object:', e.target);

        if (e.target) {
          // Increase glow on click
          e.target.emissiveIntensity = 0.6;

          // Check if clicked object is a button or interactive element
          // Made more robust to handle various object names
          const targetName = e.target.name?.toLowerCase() || '';
          const isInteractiveObject = targetName.includes('return') ||
                                    targetName.includes('button') ||
                                    targetName.includes('click') ||
                                    targetName.includes('interact') ||
                                    targetName.includes('sphere') ||
                                    targetName.includes('cube') ||
                                    targetName.includes('mesh') ||
                                    e.target.type === 'Mesh' ||
                                    e.target.isMesh === true;

          if (isInteractiveObject) {
            console.log('Interactive object clicked:', targetName || e.target.type);
            if (onSceneInteraction) {
              onSceneInteraction();
            }
          } else {
            // Fallback: any click on the scene after 2 seconds should trigger interaction
            console.log('Non-interactive object clicked, checking fallback timer');
            setTimeout(() => {
              if (onSceneInteraction) {
                console.log('Fallback: triggering scene interaction after timeout');
                onSceneInteraction();
              }
            }, 2000);
          }
        }
      });

      spline.addEventListener('mouseUp', (e: any) => {
        console.log('Mouse up:', e);
        if (e.target) {
          // Reset glow
          e.target.emissiveIntensity = 0.2;
        }
      });

      spline.addEventListener('mouseHoverOut', (e: any) => {
        console.log('Mouse hover out:', e);
        if (e.target) {
          // Remove glow when not hovering
          if (e.target.emissiveIntensity !== undefined) {
            e.target.emissiveIntensity = 0;
          }
          if (e.target.material) {
            e.target.material.emissiveIntensity = 0;
          }
          // Reset brightness
          if (e.target.brightness !== undefined) {
            e.target.brightness = 1.0;
          }
        }
      });

      // Add global mouse move handler for scene-wide lighting effects
      const canvas = spline.canvas;
      if (canvas) {
        canvas.addEventListener('mousemove', (e: MouseEvent) => {
          const rect = canvas.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width * 2 - 1;
          const y = -(e.clientY - rect.top) / rect.height * 2 + 1;

          // Adjust scene lighting based on mouse position
          const scene = spline.scene;
          if (scene && scene.children) {
            scene.children.forEach((child: any) => {
              if (child.type === 'DirectionalLight' || child.type === 'PointLight') {
                // Subtle light movement following cursor
                if (child.position) {
                  child.position.x = x * 2;
                  child.position.y = y * 2;
                }
              }
            });
          }
        });
      }
    }
  };

  const handleError = (error: any) => {
    console.error('Spline scene failed to load:', error);
    if (fallbackScene && !triedFallback) {
      console.warn('Retrying with fallback scene:', fallbackScene);
      setTriedFallback(true);
      setHasError(false);
      setIsLoading(true);
      setCurrentScene(fallbackScene);
      return;
    }
    setHasError(true);
    setIsLoading(false);
    // Ensure global loading state can progress even if Spline fails
    try { markLoaderComplete(loaderId); } catch {}
  };

  // Safety: if the scene takes too long, mark as complete to avoid blocking the fake loader
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
        if (fallbackScene && !triedFallback) {
          console.warn('Timeout loading scene, switching to fallback scene');
          setTriedFallback(true);
          setCurrentScene(fallbackScene);
        } else {
          try { markLoaderComplete(loaderId); } catch {}
        }
      }
    }, 5000);
    return () => clearTimeout(timeout);
  }, [isLoading, loaderId, markLoaderComplete, fallbackScene, triedFallback]);

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

  if (enableScrollEffects) {
    return (
      <motion.div
        className={`relative w-full h-full ${className}`}
        style={{
          background: 'transparent',
          opacity,
          scale: scaleTransform,
          y: yTransform
        }}
      >
        {isLoading && (fallback || <LoadingFallback />)}

        <Suspense fallback={fallback || <LoadingFallback />}>
          <Spline
            scene={currentScene}
            onLoad={handleLoad}
            onError={handleError}
            renderOnDemand={quality === 'low' || isMobile}
            style={{
              width: '100%',
              height: '100%',
              opacity: isLoading ? 0 : 1,
              transition: 'opacity 0.5s ease-in-out',
              transform: `scale(${scale}) translate3d(${position.x}px, ${position.y}px, ${position.z}px)`,
              transformOrigin: 'center center',
              background: 'transparent',
              pointerEvents: enableInteraction ? 'auto' : 'none'
            }}
          />
        </Suspense>
      </motion.div>
    );
  }

  return (
    <div className={`relative w-full h-full ${className}`} style={{ background: 'transparent' }}>
      {isLoading && (fallback || <LoadingFallback />)}

      <Suspense fallback={fallback || <LoadingFallback />}>
        <Spline
          scene={currentScene}
          onLoad={handleLoad}
          onError={handleError}
          renderOnDemand={quality === 'low' || isMobile}
          style={{
            width: '100%',
            height: '100%',
            opacity: isLoading ? 0 : 1,
            transition: 'opacity 0.5s ease-in-out',
            transform: `scale(${scale}) translate3d(${position.x}px, ${position.y}px, ${position.z}px)`,
            transformOrigin: 'center center',
            background: 'transparent',
            pointerEvents: enableInteraction ? 'auto' : 'none'
          }}
        />
      </Suspense>
    </div>
  );
}
