'use client';

import { useEffect, useState, useRef } from 'react';

interface CursorTorchProps {
  children: React.ReactNode;
  torchSize?: number;
  intensity?: number;
  className?: string;
}

export default function CursorTorch({
  children,
  torchSize = 200,
  intensity = 0.8,
  className = ""
}: CursorTorchProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  const maskStyle = {
    maskImage: isHovering
      ? `radial-gradient(circle ${torchSize}px at ${mousePosition.x}px ${mousePosition.y}px, rgba(0,0,0,${intensity}) 0%, rgba(0,0,0,${intensity * 0.8}) 40%, rgba(0,0,0,${intensity * 0.3}) 70%, transparent 100%)`
      : 'none',
    WebkitMaskImage: isHovering
      ? `radial-gradient(circle ${torchSize}px at ${mousePosition.x}px ${mousePosition.y}px, rgba(0,0,0,${intensity}) 0%, rgba(0,0,0,${intensity * 0.8}) 40%, rgba(0,0,0,${intensity * 0.3}) 70%, transparent 100%)`
      : 'none',
    transition: 'mask-image 0.3s ease-out, -webkit-mask-image 0.3s ease-out'
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ cursor: 'none' }}
    >
      {/* Hidden layer (always visible without torch) */}
      <div
        className="opacity-20"
        style={{
          filter: 'blur(0.5px)',
        }}
      >
        {children}
      </div>

      {/* Revealed layer (torch effect) */}
      <div
        className="absolute inset-0"
        style={maskStyle}
      >
        <div
          className="relative"
          style={{
            filter: 'brightness(1.2) contrast(1.1)',
            textShadow: '0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.3)'
          }}
        >
          {children}
        </div>
      </div>

      {/* Torch glow effect */}
      {isHovering && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: mousePosition.x - torchSize / 2,
            top: mousePosition.y - torchSize / 2,
            width: torchSize,
            height: torchSize,
            background: `radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 40%, transparent 70%)`,
            borderRadius: '50%',
            transition: 'opacity 0.2s ease-out',
          }}
        />
      )}

      {/* Custom cursor */}
      {isHovering && (
        <div
          className="absolute pointer-events-none z-50"
          style={{
            left: mousePosition.x - 4,
            top: mousePosition.y - 4,
            width: 8,
            height: 8,
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '50%',
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.6), 0 0 20px rgba(255, 255, 255, 0.4)',
            transition: 'opacity 0.2s ease-out',
          }}
        />
      )}
    </div>
  );
}