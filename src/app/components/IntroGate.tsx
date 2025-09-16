'use client';

import { motion, useAnimationControls, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useCallback, useRef } from 'react';
import LazySplineScene from './LazySplineScene';
import StarfieldLayer from '../_ui/Background/StarfieldLayer';
import { MOTION_DISABLED } from '../_ui/motion';

export type IntroGateProps = {
  onDive?: () => void;
  remember?: boolean;
  storageKey?: string;
};

// Navigation component for geometrical page
const GeometricalNavigation = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-8">
      {/* Top Left - OneKnight */}
      <div className="text-white">
        <h1
          className="text-2xl font-bold"
          style={{
            fontFamily: 'Orbitron, monospace',
            textShadow: '0 0 10px rgba(0,240,255,0.6)'
          }}
        >
          OneKnight
        </h1>
      </div>

      {/* Top Right - Navigation */}
      <nav className="flex space-x-8">
        <a href="#about" className="text-white/80 hover:text-white transition-colors">About Me</a>
        <a href="#projects" className="text-white/80 hover:text-white transition-colors">Projects</a>
        <a href="#contact" className="text-white/80 hover:text-white transition-colors">Hire Me</a>
      </nav>
    </div>
  );
};

export default function IntroGate({
  onDive,
  remember = true,
  storageKey = 'intro:oneknight'
}: IntroGateProps) {
  const [mounted, setMounted] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [showNavigation, setShowNavigation] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showFallbackHint, setShowFallbackHint] = useState(false);
  const hasAutoTransitioned = useRef(false);
  const timers = useRef<{ hint?: number; fallback?: number; hard?: number }>({});

  const overlayControls = useAnimationControls();

  // Check session storage on mount to respect "remember" functionality
  useEffect(() => {
    if (remember && typeof window !== 'undefined') {
      const hasBeenShown = sessionStorage.getItem(storageKey);
      if (hasBeenShown === 'done') {
        console.log('IntroGate: Found session storage, skipping intro');
        setIsVisible(false);
      }
    }
  }, [remember, storageKey]);


  // Handle body scroll based on visibility and navigation state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isVisible && !showNavigation) {
        // Disable scroll during initial intro (before click me)
        document.body.style.overflow = 'hidden';
        console.log('IntroGate: Disabling body scroll (initial state)');
      } else {
        // Enable scroll when intro is hidden OR in geometrical state
        document.body.style.overflow = 'auto';
        console.log('IntroGate: Enabling body scroll (geometrical state or hidden)');
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        document.body.style.overflow = 'auto';
      }
    };
  }, [isVisible, showNavigation]);

  // Handle spline interactions - show navigation when transitioning to geometrical part
  const handleSplineInteraction = useCallback((event?: any) => {
    console.log('Spline interaction detected', event);

    // If it's a "click me" interaction, show navigation (geometrical state)
    if (!showNavigation) {
      console.log('Transitioning to geometrical state (showing navigation)');
      setShowNavigation(true);
      setShowFallbackHint(false); // Hide hint when interaction works
      hasAutoTransitioned.current = true;
    } else {
      // If navigation is showing and it's a return button, hide navigation (back to click me)
      console.log('Returning to click me state (hiding navigation)');
      setShowNavigation(false);
      setShowFallbackHint(false); // Reset hint state
    }
  }, [showNavigation]);

  // Fallback mechanism: if user has been waiting too long, provide alternative interaction
  useEffect(() => {
    // Clear any previous timers
    if (timers.current.hint) clearTimeout(timers.current.hint);
    if (timers.current.fallback) clearTimeout(timers.current.fallback);
    if (timers.current.hard) clearTimeout(timers.current.hard);

    if (!showNavigation && isVisible && !hasAutoTransitioned.current) {
      // Show hint quickly to guide the user
      timers.current.hint = window.setTimeout(() => {
        setShowFallbackHint(true);
      }, 1200);

      // Auto-transition sooner to avoid being "stuck" after hard reloads
      timers.current.fallback = window.setTimeout(() => {
        if (!hasAutoTransitioned.current) {
          console.log('Fallback: Auto-transitioning to geometrical state');
          hasAutoTransitioned.current = true;
          setShowNavigation(true);
          setShowFallbackHint(false);
        }
      }, 2200);

      // Hard fail-safe: force transition even if timers were cleared by remounts/StrictMode
      timers.current.hard = window.setTimeout(() => {
        if (!hasAutoTransitioned.current && !showNavigation) {
          console.log('Hard fallback: forcing transition to geometrical state');
          hasAutoTransitioned.current = true;
          setShowNavigation(true);
          setShowFallbackHint(false);
        }
      }, 3500);
    }

    return () => {
      if (timers.current.hint) clearTimeout(timers.current.hint);
      if (timers.current.fallback) clearTimeout(timers.current.fallback);
      if (timers.current.hard) clearTimeout(timers.current.hard);
    };
  }, [showNavigation, isVisible]);

  // Keyboard shortcut fallback
  useEffect(() => {
    if (!showNavigation && isVisible) {
      const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
          console.log('Keyboard shortcut detected, transitioning to geometrical state');
          setShowNavigation(true);
          setShowFallbackHint(false);
        }
      };

      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [showNavigation, isVisible]);

  // Final transition to main page (from geometrical scene scroll)
  const handleFinalTransition = useCallback(async () => {
    if (isAnimating) return;

    setIsAnimating(true);

    try {
      // Trigger starfield warp effect
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('starfield:warp', {
            detail: { factor: 8, durationMs: 1200 }
          })
        );
      }

      // Smooth fade out
      await overlayControls.start({
        opacity: 0,
        scale: 0.98,
        filter: 'blur(1px)',
        transition: {
          duration: 1.2,
          ease: [0.4, 0.0, 0.2, 1]
        }
      });

      // Save to session storage
      if (remember && typeof window !== 'undefined') {
        sessionStorage.setItem(storageKey, 'done');
      }

      setIsVisible(false);
      if (onDive) onDive();

    } catch (error) {
      setIsVisible(false);
      if (onDive) onDive();
    } finally {
      setIsAnimating(false);
    }
  }, [isAnimating, overlayControls, remember, storageKey, onDive]);

  // Listen for significant scroll down when navigation is showing (geometrical state)
  useEffect(() => {
    if (!showNavigation || !isVisible) return;

    let scrollThreshold = 0;
    const requiredScrollDistance = 100; // Require 100px of scroll before transitioning

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) { // Scrolling down
        scrollThreshold += e.deltaY;

        if (scrollThreshold >= requiredScrollDistance) {
          console.log('Sufficient scroll down in geometrical scene, transitioning to main page');
          handleFinalTransition();
        }
      } else {
        // Reset threshold if scrolling back up
        scrollThreshold = Math.max(0, scrollThreshold + e.deltaY);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        console.log('Down key in geometrical scene, transitioning to main page');
        handleFinalTransition();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showNavigation, isVisible, handleFinalTransition]);

  // Listen for scroll to top to re-show IntroGate in geometrical state
  useEffect(() => {
    if (!isVisible) {
      const handleScroll = () => {
        if (window.scrollY === 0) {
          console.log('Scrolled to top, re-showing IntroGate in geometrical state');
          setIsVisible(true);
          setShowNavigation(true); // Go directly to geometrical state
          setShowFallbackHint(false);
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isVisible]);

  if (!mounted || !isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed inset-0 ${showNavigation ? 'z-[9998]' : 'z-[9999]'} flex items-center justify-center`}
        initial={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        animate={overlayControls}
        exit={{ opacity: 0 }}
        style={{
          backgroundColor: showNavigation ? 'rgba(0, 0, 0, 0.3)' : 'transparent'
        }}
      >
        {/* Starfield Background Layer */}
        <div className="absolute inset-0 w-full h-full">
          <StarfieldLayer />
        </div>

        {/* Purple gradient overlay for blend */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-purple-900/40" />

        {/* Single Spline Scene with both click me and geometrical states */}
        <div
          className="absolute inset-0 w-full h-full"
          onClick={() => {
            if (!showNavigation) {
              console.log('Fallback click detected on Spline container');
              handleSplineInteraction();
            }
          }}
          style={{ cursor: !showNavigation ? 'pointer' : 'default' }}
        >
          <LazySplineScene
            scene="/transition-scene.splinecode"
            className="w-full h-full mix-blend-screen opacity-90"
            scale={1.0}
            position={{ x: 0, y: 0, z: 0 }}
            quality="ultra"
            enableInteraction={true}
            onSceneInteraction={handleSplineInteraction}
          />
        </div>

        {/* Navigation - only show when in geometrical state */}
        {showNavigation && <GeometricalNavigation />}

        {/* Scroll hint - only show when in geometrical state */}
        {showNavigation && (
          <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center animate-bounce">
            <div className="flex flex-col items-center text-white/70">
              <span className="text-sm font-medium mb-2">Scroll down to enter portfolio</span>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        )}

        {/* Interaction hint - show after 2 seconds if Spline isn't working */}
        {!showNavigation && showFallbackHint && (
          <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="text-white/80 text-sm mb-4">
                <p className="mb-2">Click anywhere on the sphere or press Space to continue</p>
                <p className="text-xs text-white/60">Auto-continuing in a moment...</p>
              </div>
              <button
                onClick={() => {
                  console.log('Manual transition to geometrical state via hint button');
                  setShowNavigation(true);
                  setShowFallbackHint(false);
                }}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-sm transition-all duration-200"
              >
                Continue to Portfolio
              </button>
            </motion.div>
          </div>
        )}

        {/* Fallback debug button - only show in development */}
        {!showNavigation && !showFallbackHint && process.env.NODE_ENV === 'development' && (
          <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center">
            <button
              onClick={() => {
                console.log('Debug: Manual transition to geometrical state');
                setShowNavigation(true);
              }}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg backdrop-blur-sm border border-white/20 transition-colors"
            >
              Click Me (Debug)
            </button>
          </div>
        )}

        {/* Additional blend overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-purple-950/60 to-transparent mix-blend-multiply" />
      </motion.div>
    </AnimatePresence>
  );
}
