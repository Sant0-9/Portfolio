'use client';

import AuroraLayer from './AuroraLayer';
import StarfieldLayer from './StarfieldLayer';

export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {/* Base gradient so it's never pure black */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-zinc-900 to-black" />
      
      {/* Aurora gradients */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 animate-pulse"
          style={{
            background: `radial-gradient(ellipse 600px 400px at 20% 40%, rgba(0,240,255,0.15) 0%, transparent 50%),
                         radial-gradient(ellipse 500px 350px at 70% 70%, rgba(168,85,247,0.12) 0%, transparent 50%)`,
          }}
        />
        <div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 500px 300px at 80% 20%, rgba(59,130,246,0.1) 0%, transparent 50%),
                         radial-gradient(ellipse 400px 250px at 30% 80%, rgba(0,240,255,0.08) 0%, transparent 50%)`,
          }}
        />
      </div>

      {/* Simple starfield */}
      <div className="absolute inset-0">
        <div className="absolute top-[20%] left-[10%] w-1 h-1 bg-white rounded-full opacity-60" />
        <div className="absolute top-[15%] left-[25%] w-0.5 h-0.5 bg-cyan-300 rounded-full opacity-70" />
        <div className="absolute top-[30%] left-[70%] w-1 h-1 bg-white rounded-full opacity-50" />
        <div className="absolute top-[60%] left-[20%] w-0.5 h-0.5 bg-purple-300 rounded-full opacity-60" />
        <div className="absolute top-[70%] left-[80%] w-1 h-1 bg-white rounded-full opacity-70" />
        <div className="absolute top-[40%] left-[60%] w-0.5 h-0.5 bg-cyan-300 rounded-full opacity-80" />
        <div className="absolute top-[80%] left-[40%] w-1 h-1 bg-white rounded-full opacity-50" />
        <div className="absolute top-[25%] left-[90%] w-0.5 h-0.5 bg-white rounded-full opacity-60" />
      </div>
    </div>
  );
}