'use client';

import AuroraLayer from './AuroraLayer';
import StarfieldLayer from './StarfieldLayer';

export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      <AuroraLayer />
      <StarfieldLayer />
    </div>
  );
}