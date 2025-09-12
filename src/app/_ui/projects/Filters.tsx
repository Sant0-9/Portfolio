'use client';

import { motion } from 'framer-motion';
import { fadeInUp } from '../motion';
import { MOTION_DISABLED } from '../hooks/useReducedMotion';

interface FiltersProps {
  tags: string[];
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
}

export default function Filters({ tags, selectedTag, onTagSelect }: FiltersProps) {
  const allTags = ['All', ...tags];

  const pillVariants = MOTION_DISABLED ? {} : {
    hover: {
      scale: 1.04,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 17
      }
    },
    tap: {
      scale: 0.98
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10%' }}
      variants={fadeInUp}
      className="mb-8"
      role="tablist"
      aria-label="Project filters"
    >
      <div className="flex flex-wrap gap-3 justify-center">
        {allTags.map((tag, index) => {
          const isSelected = selectedTag === tag || (tag === 'All' && selectedTag === null);
          
          return (
            <motion.button
              key={tag}
              initial={MOTION_DISABLED ? {} : { opacity: 0, y: 20 }}
              whileInView={MOTION_DISABLED ? {} : { opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              viewport={{ once: true }}
              variants={pillVariants}
              whileHover={MOTION_DISABLED ? {} : isSelected ? 'hover' : {
                ...pillVariants.hover,
                boxShadow: '0 0 0 1px rgba(20, 184, 166, 0.3), inset 0 0 4px rgba(20, 184, 166, 0.1)'
              }}
              whileTap={MOTION_DISABLED ? {} : 'tap'}
              onClick={() => onTagSelect(tag === 'All' ? null : tag)}
              className={`relative px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400/50 ${
                isSelected
                  ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/25'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10 hover:border-white/20'
              }`}
              role="tab"
              aria-selected={isSelected}
              aria-controls="projects-grid"
            >
              {/* Selected pill glow effect */}
              {isSelected && !MOTION_DISABLED && (
                <motion.div
                  layoutId="selected-pill"
                  className="absolute inset-0 bg-teal-500 rounded-full -z-10"
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 30
                  }}
                />
              )}
              
              <span className="relative z-10">{tag}</span>
              
              {/* Count indicator for non-All tags */}
              {tag !== 'All' && (
                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                  isSelected 
                    ? 'bg-white/20 text-white' 
                    : 'bg-white/10 text-gray-400'
                }`}>
                  {/* This would show count in a real app - for now just showing the tag */}
                  {tags.filter(t => t === tag).length || ''}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Selected filter indicator */}
      <motion.div
        initial={MOTION_DISABLED ? {} : { opacity: 0, y: 10 }}
        animate={selectedTag ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
        className="text-center mt-4"
      >
        {selectedTag && (
          <p className="text-sm text-gray-400">
            Showing projects tagged with{' '}
            <span className="text-teal-400 font-medium">{selectedTag}</span>
            {' · '}
            <button
              onClick={() => onTagSelect(null)}
              className="text-teal-400 hover:text-teal-300 underline focus:outline-none focus:ring-2 focus:ring-teal-400/50 rounded"
            >
              Show all
            </button>
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}