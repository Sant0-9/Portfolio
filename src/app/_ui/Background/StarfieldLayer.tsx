'use client';

import { useState, useRef, Suspense, useEffect, forwardRef, useImperativeHandle, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
// Import only the needed drei submodules to avoid pulling incompatible extras
import { Points } from "@react-three/drei/core/Points";
import { PointMaterial } from "@react-three/drei/core/PointMaterial";
import { useScroll, useTransform, MotionValue, motion, useAnimationControls } from "framer-motion";
import { inSphere } from "maath/random";
import { useLoading } from "../../context/LoadingContext";

export type StarfieldHandle = {
  warp: (opts?: { factor?: number; durationMs?: number }) => Promise<void>;
};

interface StarsProps {
  rotationX?: MotionValue<number>;
  rotationY?: MotionValue<number>;
  speedMultiplier: number;
}

const Stars = ({ rotationX, rotationY, speedMultiplier, ...props }: StarsProps) => {
  const ref = useRef<any>();
  const [sphere] = useState(() => {
    const positions = new Float32Array(5000);
    inSphere(positions, { radius: 1.2 });
    return positions;
  });
  const [currentRotation, setCurrentRotation] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (rotationX && rotationY) {
      const unsubscribeX = rotationX.on('change', (x) =>
        setCurrentRotation(prev => ({ ...prev, x }))
      );
      const unsubscribeY = rotationY.on('change', (y) =>
        setCurrentRotation(prev => ({ ...prev, y }))
      );

      return () => {
        unsubscribeX();
        unsubscribeY();
      };
    }
  }, [rotationX, rotationY]);

  useFrame((state, delta) => {
    if (ref.current) {
      const adjustedDelta = delta * speedMultiplier;
      // Combine scroll rotation with subtle auto-rotation (boosted by speedMultiplier)
      ref.current.rotation.x = currentRotation.x + Math.sin(state.clock.elapsedTime * 0.1 * speedMultiplier) * 0.05;
      ref.current.rotation.y = currentRotation.y + Math.cos(state.clock.elapsedTime * 0.15 * speedMultiplier) * 0.03;
      ref.current.rotation.z += adjustedDelta * 0.02;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color='#f272c8'
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

// Streak overlay component for warp effect
const StreakOverlay = ({ isVisible }: { isVisible: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isVisible || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const drawStreaks = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(20, 184, 166, 0.15)';
      ctx.lineWidth = 1;

      // Draw angled streak lines
      const numStreaks = 8;
      for (let i = 0; i < numStreaks; i++) {
        const angle = (i / numStreaks) * Math.PI * 2;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const length = Math.min(canvas.width, canvas.height) * 0.4;

        const startX = centerX + Math.cos(angle) * 50;
        const startY = centerY + Math.sin(angle) * 50;
        const endX = centerX + Math.cos(angle) * length;
        const endY = centerY + Math.sin(angle) * length;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
    };

    let animationId: number;
    const animate = () => {
      drawStreaks();
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -999 }}
    />
  );
};

const StarsCanvas = forwardRef<StarfieldHandle>((_props, ref) => {
  const { scrollYProgress } = useScroll();
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [isWarping, setIsWarping] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const containerControls = useAnimationControls();

  const { registerLoader, markLoaderComplete } = useLoading();
  const loaderId = 'starfield-background';

  const rotationX = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 0.5]);
  const rotationY = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 0.3]);

  // Set mounted state after component mounts and register loader
  useEffect(() => {
    setIsMounted(true);
    registerLoader(loaderId);

    // Mark starfield as loaded quickly since it's not heavy
    const timer = setTimeout(() => {
      markLoaderComplete(loaderId);
    }, 500);

    return () => {
      setIsMounted(false);
      clearTimeout(timer);
    };
  }, [registerLoader, markLoaderComplete, loaderId]);

  const warpFunction = useCallback(async ({ factor = 6, durationMs = 900 } = {}) => {
    if (isWarping) return;
    setIsWarping(true);

    try {
      // Phase 1: Ramp up (250ms)
      const rampUpPromise = new Promise<void>((resolve) => {
        let start = 1;
        let current = start;
        const target = factor;
        const duration = 250;
        const startTime = Date.now();

        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          current = start + (target - start) * progress;
          setSpeedMultiplier(current);

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            resolve();
          }
        };
        animate();
      });

      // Trigger visual effects (only if mounted)
      const visualEffectsPromise = isMounted ? containerControls.start({
        scale: 1.05,
        filter: 'brightness(1.15) blur(0.5px)',
        transition: { duration: 0.25 }
      }) : Promise.resolve();

      await Promise.all([rampUpPromise, visualEffectsPromise]);

      // Phase 2: Hold (duration - 250 - 400 = 250ms for 900ms total)
      const holdDuration = Math.max(0, durationMs - 250 - 400);
      if (holdDuration > 0) {
        await new Promise(resolve => setTimeout(resolve, holdDuration));
      }

      // Phase 3: Ramp down (400ms)
      const rampDownPromise = new Promise<void>((resolve) => {
        let start = factor;
        let current = start;
        const target = 1;
        const duration = 400;
        const startTime = Date.now();

        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          current = start + (target - start) * progress;
          setSpeedMultiplier(current);

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            resolve();
          }
        };
        animate();
      });

      // Return visual effects to normal (only if mounted)
      const resetEffectsPromise = isMounted ? containerControls.start({
        scale: 1,
        filter: 'brightness(1) blur(0px)',
        transition: { duration: 0.4 }
      }) : Promise.resolve();

      await Promise.all([rampDownPromise, resetEffectsPromise]);

    } finally {
      setIsWarping(false);
      setSpeedMultiplier(1);
    }
  }, [isWarping, containerControls, isMounted]);

  useImperativeHandle(ref, () => ({
    warp: warpFunction
  }), [warpFunction]);

  // Listen for global starfield warp events
  useEffect(() => {
    const handleWarpEvent = (event: CustomEvent) => {
      const { factor, durationMs } = event.detail || {};
      warpFunction({ factor, durationMs });
    };

    window.addEventListener('starfield:warp', handleWarpEvent as EventListener);

    return () => {
      window.removeEventListener('starfield:warp', handleWarpEvent as EventListener);
    };
  }, [warpFunction]);

  return (
    <motion.div
      className='w-full h-screen fixed inset-0 bg-black'
      style={{zIndex: -1000, isolation: 'isolate', contain: 'layout style paint'}}
      animate={containerControls}
    >
      <Canvas
        camera={{ position: [0, 0, 1] }}
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
      >
        <Suspense fallback={null}>
          <Stars rotationX={rotationX} rotationY={rotationY} speedMultiplier={speedMultiplier} />
        </Suspense>
      </Canvas>
      <StreakOverlay isVisible={speedMultiplier > 1.2} />
    </motion.div>
  );
});

StarsCanvas.displayName = 'StarsCanvas';

export default StarsCanvas;
