'use client';

import { useEffect, useRef, useCallback } from 'react';
import { MOTION_DISABLED } from '../hooks/useReducedMotion';
import { reducedForMobile, SHOOTING } from './config';

interface Star {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  radius: number;
  alpha: number;
  depth: number;
  twinkle: number;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  alpha: number;
}

export default function StarfieldLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const animationRef = useRef<number | null>(null);
  const starsRef = useRef<Star[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);
  const lastShootingStarRef = useRef(0);
  const isVisibleRef = useRef(true);

  // Initialize stars
  const initStars = useCallback((width: number, height: number) => {
    const config = reducedForMobile(width);
    const stars: Star[] = [];

    for (let depth = 0; depth < 3; depth++) {
      for (let i = 0; i < config.starCounts[depth]; i++) {
        const star: Star = {
          x: Math.random() * width,
          y: Math.random() * height,
          baseX: Math.random() * width,
          baseY: Math.random() * height,
          radius: 0.5 + Math.random() * 0.7,
          alpha: 0.2 + Math.random() * 0.6,
          depth,
          twinkle: Math.random() * Math.PI * 2,
        };
        star.baseX = star.x;
        star.baseY = star.y;
        stars.push(star);
      }
    }

    // Add a few golden tint stars (1-3%)
    const goldenCount = Math.floor(stars.length * 0.02);
    for (let i = 0; i < goldenCount; i++) {
      if (stars[i]) {
        (stars[i] as any).golden = true;
      }
    }

    starsRef.current = stars;
  }, []);

  // Create shooting star
  const createShootingStar = useCallback((width: number, height: number) => {
    const now = Date.now();
    const timeSinceLastStar = now - lastShootingStarRef.current;
    const config = reducedForMobile(width);
    const nextInterval = config.shooting.minMs + Math.random() * (config.shooting.maxMs - config.shooting.minMs);

    if (timeSinceLastStar > nextInterval) {
      const shootingStar: ShootingStar = {
        x: Math.random() * width,
        y: -10,
        vx: (Math.random() - 0.5) * 2,
        vy: config.shooting.speed + Math.random() * 1.2,
        life: 0,
        maxLife: 60 + Math.random() * 40,
        alpha: 0,
      };
      shootingStarsRef.current.push(shootingStar);
      lastShootingStarRef.current = now;
    }
  }, []);

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;

    const { width, height } = canvas;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    const config = reducedForMobile(width);

    // Update and draw stars
    starsRef.current.forEach((star) => {
      // Apply parallax based on scroll and mouse
      let parallaxX = 0;
      let parallaxY = 0;

      if (star.depth === 1) {
        parallaxX = (mouseRef.current.x * config.parallax.depth1 + scrollRef.current * config.parallax.depth1) * -1;
        parallaxY = mouseRef.current.y * config.parallax.depth1;
      } else if (star.depth === 2) {
        parallaxX = (mouseRef.current.x * config.parallax.depth2 + scrollRef.current * config.parallax.depth2) * -1;
        parallaxY = mouseRef.current.y * config.parallax.depth2;
      }

      // Update position with wrapping
      star.x = star.baseX + parallaxX;
      star.y = star.baseY + parallaxY;

      // Wrap around edges
      if (star.x > width) star.x = 0;
      if (star.x < 0) star.x = width;
      if (star.y > height) star.y = 0;
      if (star.y < 0) star.y = height;

      // Apply tiny drift
      star.baseX += (Math.random() - 0.5) * 0.02;
      star.baseY += (Math.random() - 0.5) * 0.02;

      // Wrap base position
      if (star.baseX > width) star.baseX = 0;
      if (star.baseX < 0) star.baseX = width;
      if (star.baseY > height) star.baseY = 0;
      if (star.baseY < 0) star.baseY = height;

      // Twinkle effect
      star.twinkle += 0.02;
      const twinkleAlpha = star.alpha * (0.8 + 0.2 * Math.sin(star.twinkle));

      // Draw star
      ctx.save();
      ctx.globalAlpha = twinkleAlpha;
      ctx.fillStyle = (star as any).golden ? '#FFD580' : '#ffffff';
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Update and draw shooting stars
    if (!MOTION_DISABLED) {
      createShootingStar(width, height);
      
      shootingStarsRef.current = shootingStarsRef.current.filter((star) => {
        star.life++;
        star.x += star.vx;
        star.y += star.vy;

        // Fade in/out
        const lifePct = star.life / star.maxLife;
        if (lifePct < 0.2) {
          star.alpha = lifePct * 5;
        } else if (lifePct > 0.8) {
          star.alpha = (1 - lifePct) * 5;
        } else {
          star.alpha = 1;
        }

        // Draw shooting star trail
        if (star.alpha > 0) {
          ctx.save();
          ctx.globalAlpha = star.alpha * 0.8;
          ctx.strokeStyle = '#00F0FF';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(star.x, star.y);
          ctx.lineTo(star.x - star.vx * 10, star.y - star.vy * 10);
          ctx.stroke();
          
          // Star head
          ctx.globalAlpha = star.alpha;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(star.x, star.y, 1, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // Remove if out of bounds or life exceeded
        return star.y < height + 50 && star.x > -50 && star.x < width + 50 && star.life < star.maxLife;
      });
    }

    if (!MOTION_DISABLED && isVisibleRef.current) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [createShootingStar]);

  // Setup canvas and context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
        contextRef.current = ctx;
        
        // Initialize stars when canvas is ready
        initStars(rect.width, rect.height);
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [initStars]);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = window.scrollY / window.innerHeight;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Visibility tracking
  useEffect(() => {
    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
      if (isVisibleRef.current && !MOTION_DISABLED) {
        animate();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [animate]);

  // Start animation
  useEffect(() => {
    if (MOTION_DISABLED) {
      // Render one static frame
      const canvas = canvasRef.current;
      const ctx = contextRef.current;
      if (canvas && ctx) {
        animate();
      }
    } else {
      animate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  return (
    <div className="absolute inset-0">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: 'block' }}
      />
    </div>
  );
}