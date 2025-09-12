'use client';

import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Project } from '../../_data/projects';
import { fadeInUp } from '../motion';
import { MOTION_DISABLED } from '../hooks/useReducedMotion';

interface ProjectCardProps {
  project: Project;
  onOpenModal: (project: Project) => void;
  onTagClick: (tag: string) => void;
}

export default function ProjectCard({ project, onOpenModal, onTagClick }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const cardVariants = MOTION_DISABLED ? {} : {
    hover: {
      y: -6,
      boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25), 0 0 0 1px rgb(255 255 255 / 0.1)',
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    }
  };

  const borderVariants = MOTION_DISABLED ? {} : {
    animate: {
      background: [
        'linear-gradient(0deg, rgb(20 184 166), rgb(139 92 246))',
        'linear-gradient(90deg, rgb(20 184 166), rgb(139 92 246))',
        'linear-gradient(180deg, rgb(20 184 166), rgb(139 92 246))',
        'linear-gradient(270deg, rgb(20 184 166), rgb(139 92 246))',
        'linear-gradient(360deg, rgb(20 184 166), rgb(139 92 246))'
      ],
      transition: {
        duration: 2,
        ease: 'linear',
        repeat: Infinity
      }
    }
  };

  const actionsVariants = MOTION_DISABLED ? {} : {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: 'easeOut'
      }
    }
  };

  // Handle video playback
  useEffect(() => {
    if (videoRef.current) {
      if ((isHovered || isInView) && project.previewVideo) {
        videoRef.current.play().catch(() => {
          // Video play failed, ignore silently
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isHovered, isInView, project.previewVideo]);

  // Intersection Observer for auto-play when 80% in view
  useEffect(() => {
    if (!project.previewVideo || MOTION_DISABLED) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.8 }
    );

    const card = document.getElementById(`project-${project.slug}`);
    if (card) {
      observer.observe(card);
    }

    return () => observer.disconnect();
  }, [project.slug, project.previewVideo]);

  return (
    <motion.div
      id={`project-${project.slug}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10%' }}
      variants={fadeInUp}
      className="relative group"
    >
      <motion.div
        variants={cardVariants}
        whileHover={MOTION_DISABLED ? {} : 'hover'}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="relative bg-white/[0.04] backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 cursor-pointer transition-all duration-300 hover:bg-white/[0.08]"
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
        {/* Animated Border */}
        {isHovered && (
          <motion.div
            variants={borderVariants}
            animate={!MOTION_DISABLED ? "animate" : undefined}
            className="absolute -inset-0.5 rounded-2xl opacity-20 blur-sm -z-10"
          />
        )}

        {/* Media Container */}
        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-teal-900/20 via-purple-900/20 to-blue-900/20">
          {project.previewVideo ? (
            <video
              ref={videoRef}
              muted
              loop
              className="w-full h-full object-cover"
              poster={project.image}
            >
              <source src={project.previewVideo} type="video/mp4" />
            </video>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-teal-900/20 via-purple-900/20 to-blue-900/20" />
          )}

          {/* Status Indicator */}
          <div className="absolute top-4 right-4">
            <div className={`w-3 h-3 rounded-full ${
              project.status === 'live' 
                ? 'bg-green-400 shadow-lg shadow-green-400/50' 
                : 'bg-purple-400 shadow-lg shadow-purple-400/50'
            }`} />
          </div>

          {/* Image Fade-in Mask */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white group-hover:text-teal-300 transition-colors duration-200">
              {project.title}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
              {project.summary}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag, index) => (
              <motion.button
                key={tag}
                initial={MOTION_DISABLED ? {} : { opacity: 0, y: 10 }}
                whileInView={MOTION_DISABLED ? {} : { opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                viewport={{ once: true }}
                whileHover={MOTION_DISABLED ? {} : { 
                  scale: 1.05,
                  boxShadow: '0 0 0 1px rgba(20, 184, 166, 0.3), inset 0 0 4px rgba(20, 184, 166, 0.1)'
                }}
                whileTap={MOTION_DISABLED ? {} : { scale: 0.98 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onTagClick(tag);
                }}
                className="px-2 py-1 text-xs bg-white/5 text-teal-300 rounded-full border border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400/50"
              >
                {tag}
              </motion.button>
            ))}
          </div>

          {/* Actions - Appear on Hover */}
          <motion.div
            variants={actionsVariants}
            initial="hidden"
            animate={isHovered && !MOTION_DISABLED ? "visible" : "hidden"}
            className="flex gap-3 pt-2"
          >
            {project.links.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-teal-500 hover:bg-teal-600 text-white rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400/50"
                aria-label={`Open ${project.title} live demo`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Live
              </a>
            )}
            
            {project.links.code && (
              <a
                href={project.links.code}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label={`View ${project.title} source code`}
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
                Code
              </a>
            )}

            {project.links.case && (
              <a
                href={project.links.case}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-purple-500 hover:bg-purple-600 text-white rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                aria-label={`Read ${project.title} case study`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Case Study
              </a>
            )}
          </motion.div>
        </div>

        {/* Focus Ring */}
        <div className="absolute inset-0 rounded-2xl ring-2 ring-transparent focus-within:ring-teal-400/50 transition-all duration-200 pointer-events-none" />
      </motion.div>
    </motion.div>
  );
}