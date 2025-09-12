'use client';

import { MOTION_DISABLED } from '../hooks/useReducedMotion';

export default function AuroraLayer() {
  const motionClasses = MOTION_DISABLED ? '' : 'animate-aurora-a';
  const motionClassesB = MOTION_DISABLED ? '' : 'animate-aurora-b';

  return (
    <div className="absolute inset-0" style={{ 
      '--aurora-1': '#00F0FF',
      '--aurora-2': '#A855F7', 
      '--aurora-3': '#1E40AF'
    } as React.CSSProperties}>
      {/* First aurora layer */}
      <div 
        className={`absolute inset-0 opacity-25 ${motionClasses}`}
        style={{
          background: `radial-gradient(ellipse 80% 50% at 20% 40%, var(--aurora-1) 0%, transparent 50%),
                       radial-gradient(ellipse 60% 70% at 70% 80%, var(--aurora-2) 0%, transparent 50%)`
        }}
      />
      
      {/* Second aurora layer */}
      <div 
        className={`absolute inset-0 opacity-20 ${motionClassesB}`}
        style={{
          background: `radial-gradient(ellipse 70% 60% at 80% 20%, var(--aurora-3) 0%, transparent 50%),
                       radial-gradient(ellipse 90% 40% at 30% 70%, var(--aurora-1) 0%, transparent 50%)`
        }}
      />
      
      {/* Noise overlay */}
      <div 
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}
      />
    </div>
  );
}