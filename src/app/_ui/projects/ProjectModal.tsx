'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Project } from '../../_data/projects';
import { MOTION_DISABLED } from '../hooks/useReducedMotion';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus management
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const modal = modalRef.current;
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    modal.addEventListener('keydown', handleTabKey);
    return () => modal.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);

  if (!project) return null;

  const backdropVariants = MOTION_DISABLED ? {} : {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.2 }
    }
  };

  const modalVariants = MOTION_DISABLED ? {} : {
    hidden: { 
      opacity: 0, 
      scale: 0.98,
      y: 20
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { 
        duration: 0.3,
        ease: 'easeOut'
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="relative bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/10"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`modal-title-${project.slug}`}
            aria-describedby={`modal-description-${project.slug}`}
          >
            {/* Close Button */}
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-teal-400/50 transition-colors duration-200"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Hero Media */}
            <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-teal-900/20 via-purple-900/20 to-blue-900/20">
              {project.previewVideo ? (
                <video
                  autoPlay
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

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

              {/* Status Badge */}
              <div className="absolute top-4 left-4">
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                  project.status === 'live' 
                    ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                    : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    project.status === 'live' ? 'bg-green-400' : 'bg-purple-400'
                  }`} />
                  {project.status === 'live' ? 'Live' : 'In Development'}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-8">
              {/* Header */}
              <div className="space-y-4">
                <h2 
                  id={`modal-title-${project.slug}`}
                  className="text-3xl font-bold text-white"
                >
                  {project.title}
                </h2>

                <p 
                  id={`modal-description-${project.slug}`}
                  className="text-lg text-gray-300 leading-relaxed"
                >
                  {project.description || project.summary}
                </p>

                {/* Role & Tech Stack */}
                <div className="flex flex-wrap gap-6 text-sm">
                  {project.role && (
                    <div>
                      <span className="text-gray-500 font-medium">Role:</span>
                      <span className="text-gray-300 ml-2">{project.role}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tech Stack */}
              {project.techStack && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 text-sm bg-white/5 text-teal-300 rounded-full border border-white/10"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Highlights */}
              {project.highlights && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Key Features</h3>
                  <ul className="space-y-3">
                    {project.highlights.map((highlight, index) => (
                      <motion.li
                        key={index}
                        initial={MOTION_DISABLED ? {} : { opacity: 0, x: -20 }}
                        animate={MOTION_DISABLED ? {} : { opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-2.5 flex-shrink-0" />
                        <span className="text-gray-300 leading-relaxed">{highlight}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tags */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 text-sm bg-white/5 text-gray-300 rounded-full border border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                {project.links.live && (
                  <motion.a
                    href={project.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={MOTION_DISABLED ? {} : { scale: 1.02 }}
                    whileTap={MOTION_DISABLED ? {} : { scale: 0.98 }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400/50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    View Live Demo
                  </motion.a>
                )}
                
                {project.links.code && (
                  <motion.a
                    href={project.links.code}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={MOTION_DISABLED ? {} : { scale: 1.02 }}
                    whileTap={MOTION_DISABLED ? {} : { scale: 0.98 }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                    </svg>
                    View Source Code
                  </motion.a>
                )}

                {project.links.case && (
                  <motion.a
                    href={project.links.case}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={MOTION_DISABLED ? {} : { scale: 1.02 }}
                    whileTap={MOTION_DISABLED ? {} : { scale: 0.98 }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Read Case Study
                  </motion.a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}