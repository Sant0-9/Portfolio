'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { reveal } from '../motion';
import { MOTION_DISABLED } from '../motion';

interface Stat {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
}

interface StatsProps {
  stats: Stat[];
}

function useCounter(
  target: number,
  isInView: boolean,
  duration: number = 2000
): number {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number>();

  useEffect(() => {
    if (!isInView || MOTION_DISABLED) {
      setCount(target);
      return;
    }

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.round(target * easeOutCubic);
      
      countRef.current = currentCount;
      setCount(currentCount);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isInView, target, duration]);

  return count;
}

function StatItem({ stat, index, isInView }: { 
  stat: Stat; 
  index: number; 
  isInView: boolean; 
}) {
  const count = useCounter(stat.value, isInView, 2000 + index * 200);

  return (
    <motion.div
      initial={MOTION_DISABLED ? {} : { opacity: 0, y: 20 }}
      whileInView={MOTION_DISABLED ? {} : { opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      className="text-center space-y-2"
    >
      <div className="text-3xl font-bold text-white">
        {stat.prefix || ''}
        {count}
        {stat.suffix || ''}
      </div>
      <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
    </motion.div>
  );
}

export default function Stats({ stats }: StatsProps) {
  const [isInView, setIsInView] = useState(false);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-20%' }}
      variants={reveal}
      onViewportEnter={() => setIsInView(true)}
      className="space-y-6"
    >
      <h3 className="text-xl font-semibold text-white">By the Numbers</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {stats.map((stat, index) => (
          <StatItem
            key={index}
            stat={stat}
            index={index}
            isInView={isInView}
          />
        ))}
      </div>
    </motion.div>
  );
}