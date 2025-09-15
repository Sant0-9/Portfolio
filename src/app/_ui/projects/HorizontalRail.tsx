'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState, useCallback } from 'react';
import { Project } from '../../_data/projects';
import ProjectCard from './ProjectCard';
import { MOTION_DISABLED } from '../motion';

interface HorizontalRailProps {
  projects: Project[];
  onOpenModal: (project: Project) => void;
  onTagClick: (tag: string) => void;
}

export default function HorizontalRail({ projects, onOpenModal, onTagClick }: HorizontalRailProps) {
  const railSection = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [totalShift, setTotalShift] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check if mobile or motion disabled
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate total shift distance
  const calculateShift = useCallback(() => {
    if (!trackRef.current || isMobile || MOTION_DISABLED) return;
    
    const track = trackRef.current;
    const viewportWidth = window.innerWidth;
    const scrollWidth = track.scrollWidth;
    const shift = Math.max(0, scrollWidth - viewportWidth + 100); // Add some padding
    
    setTotalShift(shift);
  }, [isMobile]);

  // ResizeObserver to recompute on viewport changes
  useEffect(() => {
    const resizeObserver = new ResizeObserver(calculateShift);
    if (trackRef.current) {
      resizeObserver.observe(trackRef.current);
    }
    
    calculateShift();
    
    return () => resizeObserver.disconnect();
  }, [calculateShift, projects]);

  // Horizontal scroll binding - starts when section center hits viewport center
  const { scrollYProgress } = useScroll({
    target: railSection,
    offset: ["center center", "end center"]
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, isMounted && !MOTION_DISABLED && !isMobile ? -totalShift : 0]);

  // Calculate section height: needs to be tall enough for horizontal scroll
  const sectionHeight = isMobile || MOTION_DISABLED || !isMounted 
    ? 'auto' 
    : `${totalShift + (typeof window !== 'undefined' ? window.innerHeight : 800)}px`;

  // For mobile/reduced motion: render normal vertical grid
  if (isMobile || MOTION_DISABLED) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard
                key={project.slug}
                project={project}
                onOpenModal={onOpenModal}
                onTagClick={onTagClick}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={railSection}
      className="relative"
      style={{ height: sectionHeight }}
    >
      {/* Sticky container that pins while section scrolls */}
      <div className="sticky top-[72px] h-screen overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          {/* Horizontal track */}
          <motion.div
            ref={trackRef}
            style={{ x }}
            className="flex gap-8 will-change-transform snap-x snap-mandatory"
            drag="x"
            dragConstraints={{ left: -totalShift, right: 0 }}
            dragElastic={0.1}
            onDragEnd={() => {
              // Optional: snap to nearest card
            }}
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.slug}
                className="flex-shrink-0 w-80 snap-start"
                initial={{ opacity: 0, y: 50, scale: 1 }}
                whileInView={{ 
                  opacity: 1, 
                  y: 0, 
                  scale: [1, 1.03, 1],
                  transition: {
                    duration: 0.6,
                    delay: index * 0.1,
                    scale: {
                      times: [0, 0.5, 1],
                      duration: 0.6
                    }
                  }
                }}
                viewport={{ once: true, margin: '-10%' }}
              >
                <ProjectCard
                  project={project}
                  onOpenModal={onOpenModal}
                  onTagClick={onTagClick}
                />
              </motion.div>
            ))}
            
            {/* Spacer for final scroll */}
            <div className="w-20 flex-shrink-0" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}