'use client';

import { motion } from 'framer-motion';
import { fadeInUp } from '../motion';
import { MOTION_DISABLED } from '../hooks/useReducedMotion';

interface BioCardProps {
  name: string;
  role: string;
  location: string;
  bullets: string[];
  avatar?: string;
}

export default function BioCard({ name, role, location, bullets, avatar }: BioCardProps) {
  const cardVariant = {
    hidden: fadeInUp.hidden,
    visible: {
      ...fadeInUp.visible,
      transition: {
        ...fadeInUp.visible.transition,
        delay: 0.2
      }
    }
  };

  const hoverVariant = MOTION_DISABLED ? {} : {
    rotateY: 2,
    rotateX: 1,
    scale: 1.02,
    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 0 0 1px rgb(255 255 255 / 0.05)',
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10%' }}
      variants={cardVariant}
      className="sticky top-24 h-fit"
    >
      <motion.div
        whileHover={hoverVariant}
        whileFocus={hoverVariant}
        tabIndex={0}
        className="relative rounded-2xl bg-white/[0.08] backdrop-blur-sm border border-white/10 p-6 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/20"
      >
        <div className="space-y-6">
          {avatar && (
            <div className="flex justify-center">
              <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-teal-400 to-purple-500 p-0.5">
                <img
                  src={avatar}
                  alt={`Professional headshot of ${name}, ${role}`}
                  className="w-full h-full rounded-full object-cover bg-gray-900"
                />
              </div>
            </div>
          )}
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white">{name}</h2>
            <p className="text-lg text-teal-300 font-medium">{role}</p>
            <p className="text-sm text-gray-400 flex items-center justify-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {location}
            </p>
          </div>

          <div className="space-y-3">
            {bullets.map((bullet, index) => (
              <motion.div
                key={index}
                initial={MOTION_DISABLED ? {} : { opacity: 0, x: -20 }}
                whileInView={MOTION_DISABLED ? {} : { opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.4 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 text-sm text-gray-300"
              >
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-teal-400 to-purple-500 flex-shrink-0" />
                <span>{bullet}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}