'use client';

import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { projects, Project } from '../../_data/projects';
import Image from 'next/image';

interface StickyProjectShowcaseProps {
  onOpenModal: (project: Project) => void;
  onTagClick: (tag: string) => void;
}

export default function StickyProjectShowcase({ onOpenModal, onTagClick }: StickyProjectShowcaseProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent, cardRef: HTMLDivElement, projectSlug: string) => {
    if (hoveredCard !== projectSlug) return;

    const rect = cardRef.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

    setMousePosition({ x, y });
  };

  return (
    <section id="projects" className="py-20">
      {/* Header */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl lg:text-5xl font-bold text-white mb-4"
          style={{
            fontFamily: 'Orbitron, monospace',
            textShadow: '0 0 20px rgba(0,240,255,0.6), 0 0 40px rgba(0,240,255,0.4)'
          }}
        >
          Featured Projects
        </motion.h2>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-24 h-0.5 bg-gradient-to-r from-teal-400 to-purple-500 mx-auto"
        />
      </div>

      {/* Project Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {projects.map((project, index) => {
            const isHovered = hoveredCard === project.slug;
            const tiltX = isHovered ? mousePosition.y * -10 : 0;
            const tiltY = isHovered ? mousePosition.x * 10 : 0;

            return (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                animate={{
                  scale: isHovered ? 1.05 : 1,
                  rotateX: tiltX,
                  rotateY: tiltY,
                  z: isHovered ? 50 : 0
                }}
                className="group cursor-pointer"
                onClick={() => onOpenModal(project)}
                onMouseEnter={() => setHoveredCard(project.slug)}
                onMouseLeave={() => {
                  setHoveredCard(null);
                  setMousePosition({ x: 0, y: 0 });
                }}
                onMouseMove={(e) => {
                  const cardRef = e.currentTarget as HTMLDivElement;
                  handleMouseMove(e, cardRef, project.slug);
                }}
                style={{
                  transformStyle: 'preserve-3d',
                  perspective: '1000px'
                }}
              >
              <div className="bg-gradient-to-br from-purple-900/20 via-gray-900/40 to-black/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20">
                {/* Project Image */}
                <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-teal-900/20 via-purple-900/20 to-blue-900/20">
                  {project.previewVideo ? (
                    <video
                      autoPlay
                      muted
                      loop
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <source src={project.previewVideo} type="video/mp4" />
                    </video>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-teal-900/30 via-purple-900/30 to-blue-900/30 flex items-center justify-center">
                      <div className="text-white/60 text-6xl font-bold">
                        {project.title.charAt(0)}
                      </div>
                    </div>
                  )}

                  {/* Status Indicator */}
                  <div className="absolute top-4 right-4">
                    <div className={`w-3 h-3 rounded-full ${
                      project.status === 'live'
                        ? 'bg-green-400 shadow-lg shadow-green-400/50'
                        : 'bg-purple-400 shadow-lg shadow-purple-400/50'
                    }`} />
                  </div>

                  {/* GitHub Icon */}
                  {project.links.code && (
                    <div className="absolute top-4 left-4">
                      <div className="w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-teal-300 transition-colors duration-300">
                    {project.title}
                  </h3>

                  <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                    {project.summary}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-teal-500/20 text-teal-300 rounded-md border border-teal-500/30"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="px-2 py-1 text-xs bg-gray-700/50 text-gray-400 rounded-md">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-gradient-to-r from-teal-400/20 via-purple-400/20 to-blue-400/20 rounded-2xl pointer-events-none" />
              </div>
            </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}