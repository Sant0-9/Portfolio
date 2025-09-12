'use client';

import { motion } from 'framer-motion';
import { fadeInUp, dur, ease } from './motion';
import { MOTION_DISABLED } from './hooks/useReducedMotion';

interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  tags: string[];
  href?: string;
}

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export default function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const cardVariants = {
    hidden: fadeInUp.hidden,
    visible: {
      ...fadeInUp.visible,
      transition: {
        ...fadeInUp.visible.transition,
        delay: MOTION_DISABLED ? 0 : index * 0.1
      }
    }
  };

  const hoverVariants = {
    rest: {
      y: 0,
      boxShadow: MOTION_DISABLED ? 
        '0 0 0 0 rgba(0, 0, 0, 0)' : 
        '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
    },
    hover: {
      y: MOTION_DISABLED ? 0 : -4,
      boxShadow: MOTION_DISABLED ? 
        '0 0 0 0 rgba(0, 0, 0, 0)' : 
        '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 20px 25px -5px rgba(0, 0, 0, 0.2)',
      transition: {
        duration: dur.fast,
        ease: ease.out
      }
    }
  };

  const imageVariants = {
    rest: { 
      scale: 1,
      filter: 'brightness(0.8)'
    },
    hover: { 
      scale: MOTION_DISABLED ? 1 : 1.05,
      filter: 'brightness(1)',
      transition: {
        duration: dur.base,
        ease: ease.out
      }
    }
  };

  const tagsContainerVariants = {
    rest: {
      y: 0
    },
    hover: {
      y: MOTION_DISABLED ? 0 : -2,
      transition: {
        duration: dur.base,
        ease: ease.out,
        staggerChildren: 0.02,
        delayChildren: 0.1
      }
    }
  };

  const tagVariants = {
    rest: {
      y: 0,
      opacity: 0.8
    },
    hover: {
      y: MOTION_DISABLED ? 0 : -1,
      opacity: 1,
      transition: {
        duration: dur.fast,
        ease: ease.out
      }
    }
  };

  const CardComponent = project.href ? motion.a : motion.article;
  const cardProps = project.href ? 
    { 
      href: project.href,
      target: '_blank',
      rel: 'noopener noreferrer',
      'aria-describedby': `project-${project.id}-tooltip`
    } : 
    {
      'aria-describedby': `project-${project.id}-tooltip`
    };

  return (
    <CardComponent
      className="group relative rounded-xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-sm p-6 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      whileHover="hover"
      animate="rest"
      {...hoverVariants}
      {...cardProps}
    >
      {/* Color indicator with subtle pulse */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="text-xl font-semibold text-white group-hover:text-zinc-100 transition-colors">
          {project.name}
        </h3>
        <motion.div
          className="relative"
          whileHover={MOTION_DISABLED ? {} : { scale: 1.1 }}
          transition={{ duration: dur.fast, ease: ease.out }}
        >
          <span 
            className="inline-block h-3 w-3 rounded-full" 
            style={{ backgroundColor: project.color }}
            aria-hidden="true"
          />
          {!MOTION_DISABLED && (
            <span 
              className="absolute inset-0 h-3 w-3 rounded-full animate-pulse opacity-30" 
              style={{ backgroundColor: project.color }}
              aria-hidden="true"
            />
          )}
        </motion.div>
      </div>

      <p className="text-sm text-zinc-300 group-hover:text-zinc-200 transition-colors leading-relaxed mb-4">
        {project.description}
      </p>

      {/* Animated image placeholder */}
      <motion.div
        className="h-32 mb-4 rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-700 overflow-hidden"
        variants={imageVariants}
      >
        <div 
          className="w-full h-full opacity-20" 
          style={{ 
            backgroundColor: project.color,
            background: `linear-gradient(135deg, ${project.color}20 0%, ${project.color}05 100%)`
          }}
        />
      </motion.div>

      {/* Animated tags */}
      <motion.div
        className="flex flex-wrap gap-2"
        variants={tagsContainerVariants}
      >
        {project.tags.map((tag, tagIndex) => (
          <motion.span
            key={tag}
            className="px-2 py-1 text-xs rounded-md border backdrop-blur-sm"
            style={{ 
              borderColor: `${project.color}55`, 
              color: project.color, 
              backgroundColor: `${project.color}1a` 
            }}
            variants={tagVariants}
            custom={tagIndex}
          >
            {tag}
          </motion.span>
        ))}
      </motion.div>

      {/* Tooltip for accessibility */}
      <div 
        id={`project-${project.id}-tooltip`}
        className="sr-only"
      >
        Project: {project.name}. Technologies: {project.tags.join(', ')}.
        {project.href && ' Click to view project details.'}
      </div>

      {/* Focus indicator */}
      <div className="absolute inset-0 rounded-xl border-2 border-transparent group-focus-visible:border-blue-500/50 pointer-events-none" />
    </CardComponent>
  );
}