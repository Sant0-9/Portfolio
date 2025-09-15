'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Project } from '../../_data/projects';
import { reveal } from '../motion';
import { MOTION_DISABLED } from '../motion';

interface SpotlightProps {
  project: Project;
  onOpenModal: (project: Project) => void;
}

export default function Spotlight({ project, onOpenModal }: SpotlightProps) {
  const [isHovered, setIsHovered] = useState(false);

  const cardVariants = MOTION_DISABLED ? {
    hover: {}
  } : {
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1] as const
      }
    }
  };

  const sheenVariants = MOTION_DISABLED ? {
    initial: {},
    hover: {}
  } : {
    initial: { x: '-100%' },
    hover: {
      x: '100%',
      transition: {
        duration: 2,
        ease: [0.645, 0.045, 0.355, 1] as const
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10%' }}
      variants={reveal}
      className="mb-12"
    >
      <motion.div
        variants={cardVariants}
        whileHover={MOTION_DISABLED ? {} : 'hover'}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="relative group cursor-pointer overflow-hidden rounded-2xl aspect-video bg-gradient-to-br from-gray-900 to-gray-800"
        onClick={() => onOpenModal(project)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpenModal(project);
          }
        }}
        role="button"
        aria-label={`View details for ${project.title}`}
      >
        {/* Background Image/Video */}
        <div className="absolute inset-0">
          {project.previewVideo && isHovered ? (
            <video
              autoPlay
              muted
              loop
              className="w-full h-full object-cover"
            >
              <source src={project.previewVideo} type="video/mp4" />
            </video>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-teal-900/20 via-purple-900/20 to-blue-900/20" />
          )}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Sheen Effect */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            variants={sheenVariants}
            initial="initial"
            animate={isHovered && !MOTION_DISABLED ? "hover" : "initial"}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-end p-8 lg:p-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className={`inline-block w-3 h-3 rounded-full ${
                project.status === 'live' 
                  ? 'bg-green-400 shadow-lg shadow-green-400/50' 
                  : 'bg-purple-400 shadow-lg shadow-purple-400/50'
              }`} />
              <span className="text-sm font-medium text-gray-300 uppercase tracking-wide">
                Featured Project
              </span>
            </div>

            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
              {project.title}
            </h2>

            <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
              {project.summary}
            </p>

            {project.highlights && (
              <ul className="space-y-2 max-w-2xl">
                {project.highlights.slice(0, 2).map((highlight, index) => (
                  <motion.li
                    key={index}
                    initial={MOTION_DISABLED ? {} : { opacity: 0, x: -20 }}
                    whileInView={MOTION_DISABLED ? {} : { opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3 text-gray-400"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-2 flex-shrink-0" />
                    <span className="text-sm">{highlight}</span>
                  </motion.li>
                ))}
              </ul>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {project.tags.slice(0, 4).map((tag, index) => (
                <motion.span
                  key={tag}
                  initial={MOTION_DISABLED ? {} : { opacity: 0, scale: 0.8 }}
                  whileInView={MOTION_DISABLED ? {} : { opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.05, duration: 0.3 }}
                  viewport={{ once: true }}
                  className="px-3 py-1.5 text-sm bg-white/10 text-teal-300 rounded-full border border-white/20 backdrop-blur-sm"
                >
                  {tag}
                </motion.span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              {project.links.live && (
                <motion.a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={MOTION_DISABLED ? {} : { scale: 1.05 }}
                  whileTap={MOTION_DISABLED ? {} : { scale: 0.95 }}
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`Open ${project.title} live demo`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View Live
                </motion.a>
              )}
              
              {project.links.code && (
                <motion.a
                  href={project.links.code}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={MOTION_DISABLED ? {} : { scale: 1.05 }}
                  whileTap={MOTION_DISABLED ? {} : { scale: 0.95 }}
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`View ${project.title} source code on GitHub`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 rounded-lg font-medium transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                  View Code
                </motion.a>
              )}
            </div>
          </div>
        </div>

        {/* Focus Ring */}
        <div className="absolute inset-0 rounded-2xl ring-2 ring-transparent group-focus:ring-teal-400/50 transition-all duration-200" />
      </motion.div>
    </motion.div>
  );
}