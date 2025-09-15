'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects, Project } from '../../_data/projects';
import ProjectCard from './ProjectCard';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface StickyProjectShowcaseProps {
  onOpenModal: (project: Project) => void;
  onTagClick: (tag: string) => void;
}

export default function StickyProjectShowcase({ onOpenModal, onTagClick }: StickyProjectShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const container = containerRef.current;
    if (!container) return;

    // Clear previous animations
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    // Create timeline for project showcase
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: `+=${projects.length * 25}vh`,
        pin: true,
        scrub: 1,
        snap: {
          snapTo: 1 / projects.length,
          duration: { min: 0.2, max: 0.5 },
          delay: 0.1
        }
      }
    });

    // Animate each project
    projects.forEach((project, index) => {
      const projectElement = projectsRef.current[index];
      if (!projectElement) return;

      // Initial state - all projects hidden except first
      if (index === 0) {
        gsap.set(projectElement, { opacity: 1, scale: 1, y: 0 });
      } else {
        gsap.set(projectElement, { opacity: 0, scale: 0.8, y: 100 });
      }

      // Animation sequence
      if (index > 0) {
        tl.to(projectsRef.current[index - 1], {
          opacity: 0,
          scale: 0.8,
          y: -100,
          duration: 0.5,
          ease: "power2.inOut"
        }, index)
        .to(projectElement, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.inOut"
        }, index);
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="projects"
      className="relative"
      style={{ height: `${projects.length * 25 + 10}vh` }}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 w-full z-10 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-4xl lg:text-5xl font-bold text-white mb-4"
            style={{
              fontFamily: 'Orbitron, monospace',
              textShadow: '0 0 20px rgba(0,240,255,0.6), 0 0 40px rgba(0,240,255,0.4)'
            }}
          >
            Featured Projects
          </h2>
          <div className="w-24 h-0.5 bg-gradient-to-r from-teal-400 to-purple-500 mx-auto"></div>
        </div>
      </div>

      {/* Sticky Container */}
      <div className="sticky top-0 h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Project Cards */}
          <div className="relative max-w-4xl mx-auto">
            {projects.map((project, index) => (
              <div
                key={project.slug}
                ref={(el) => {
                  if (el) projectsRef.current[index] = el;
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-full max-w-lg">
                  <ProjectCard
                    project={project}
                    onOpenModal={onOpenModal}
                    onTagClick={onTagClick}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Progress Indicator */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-2">
              {projects.map((_, index) => (
                <div
                  key={index}
                  className="w-2 h-2 rounded-full bg-white/30 transition-all duration-300"
                  style={{
                    background: index === 0 ? 'rgba(20, 184, 166, 0.8)' : 'rgba(255, 255, 255, 0.3)'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}