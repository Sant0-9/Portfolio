'use client';

import { useState, useRef, Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { useScroll, useTransform, MotionValue } from "framer-motion";
import * as random from "maath/random/dist/maath-random.esm";

interface StarsProps {
  rotationX?: MotionValue<number>;
  rotationY?: MotionValue<number>;
}

const Stars = ({ rotationX, rotationY, ...props }: StarsProps) => {
  const ref = useRef<any>();
  const [sphere] = useState(() => random.inSphere(new Float32Array(5000), { radius: 1.2 }));
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
      // Combine scroll rotation with subtle auto-rotation
      ref.current.rotation.x = currentRotation.x + Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
      ref.current.rotation.y = currentRotation.y + Math.cos(state.clock.elapsedTime * 0.15) * 0.03;
      ref.current.rotation.z += delta * 0.02;
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

const StarsCanvas = () => {
  const { scrollYProgress } = useScroll();

  const rotationX = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 0.5]);
  const rotationY = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 0.3]);

  return (
    <div className='w-full h-screen fixed inset-0 bg-black' style={{zIndex: -1000, isolation: 'isolate', contain: 'layout style paint'}}>
      <Canvas
        camera={{ position: [0, 0, 1] }}
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
      >
        <Suspense fallback={null}>
          <Stars rotationX={rotationX} rotationY={rotationY} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default StarsCanvas;