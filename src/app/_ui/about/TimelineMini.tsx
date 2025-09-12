'use client';

import { motion } from 'framer-motion';
import { reveal } from '../motion';
import { MOTION_DISABLED } from '../hooks/useReducedMotion';

interface TimelineItem {
  phase: string;
  title: string;
  description: string;
}

interface TimelineMiniProps {
  items: TimelineItem[];
}

export default function TimelineMini({ items }: TimelineMiniProps) {
  const pathVariant = MOTION_DISABLED 
    ? { pathLength: 1 }
    : {
        pathLength: 1,
        transition: {
          duration: 2,
          ease: 'easeInOut',
          delay: 0.5
        }
      };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-20%' }}
      variants={reveal}
      className="relative"
    >
      <h3 className="text-xl font-semibold text-white mb-8">Timeline</h3>
      
      <div className="relative space-y-8">
        {/* SVG Path connecting timeline items */}
        <svg
          className="absolute left-6 top-6 h-full w-0.5 -translate-x-1/2"
          viewBox="0 0 2 100"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M1 0 L1 100"
            stroke="url(#timeline-gradient)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            whileInView={pathVariant}
            viewport={{ once: true }}
          />
          <defs>
            <linearGradient id="timeline-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#14B8A6" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#1E40AF" />
            </linearGradient>
          </defs>
        </svg>

        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={MOTION_DISABLED ? {} : { opacity: 0, x: -30 }}
            whileInView={MOTION_DISABLED ? {} : { opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.2, duration: 0.5 }}
            viewport={{ once: true }}
            className="relative flex items-start gap-4"
          >
            {/* Timeline dot */}
            <motion.div
              initial={MOTION_DISABLED ? {} : { scale: 0, opacity: 0 }}
              whileInView={MOTION_DISABLED ? {} : { scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.2, duration: 0.3 }}
              viewport={{ once: true }}
              className="relative z-10 w-3 h-3 rounded-full bg-gradient-to-r from-teal-400 to-purple-500 flex-shrink-0 mt-1.5"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-400 to-purple-500 animate-pulse" />
            </motion.div>

            {/* Content */}
            <div className="flex-1 space-y-1 pb-8">
              <div className="flex items-center gap-2">
                <span className="inline-block px-2 py-1 text-xs font-medium bg-white/5 text-teal-300 rounded-full border border-white/10">
                  {item.phase}
                </span>
              </div>
              <h4 className="text-lg font-semibold text-white">{item.title}</h4>
              <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}