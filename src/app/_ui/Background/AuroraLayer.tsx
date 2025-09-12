'use client';

import { MOTION_DISABLED } from '../hooks/useReducedMotion';
import { AURORA } from './config';

export default function AuroraLayer() {
  const motionClasses = MOTION_DISABLED ? '' : 'animate-aurora-a';
  const motionClassesB = MOTION_DISABLED ? '' : 'animate-aurora-b';

  return (
    <div className="absolute inset-0">
      {/* Simple visible aurora for debugging */}
      <div 
        className={`absolute inset-0 ${motionClasses}`}
        style={{
          opacity: 0.3,
          background: `radial-gradient(circle at 30% 40%, #00F0FF33 0%, transparent 60%),
                       radial-gradient(circle at 70% 70%, #A855F733 0%, transparent 60%)`
        }}
      />
      
      <div 
        className={`absolute inset-0 ${motionClassesB}`}
        style={{
          opacity: 0.2,
          background: `radial-gradient(circle at 80% 20%, #3B82F633 0%, transparent 60%),
                       radial-gradient(circle at 20% 80%, #00F0FF22 0%, transparent 60%)`
        }}
      />
    </div>
  );
}