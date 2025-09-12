'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { projects, tags, getFeaturedProject, Project } from '../../_data/projects';
import Spotlight from './Spotlight';
import ProjectCard from './ProjectCard';
import Filters from './Filters';
import ProjectModal from './ProjectModal';
import { reveal } from '../motion';
import AnimatedDivider from '../AnimatedDivider';

export default function SectionProjects() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const featuredProject = getFeaturedProject();
  const otherProjects = projects.slice(1);

  // Filter projects based on selected tag
  const filteredProjects = useMemo(() => {
    if (!selectedTag) return otherProjects;
    return otherProjects.filter(project => project.tags.includes(selectedTag));
  }, [selectedTag, otherProjects]);

  const handleTagSelect = (tag: string | null) => {
    setSelectedTag(tag);
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
  };

  const handleOpenModal = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <section id="projects" className="relative py-20 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-10%' }}
          variants={reveal}
          className="text-center mb-16 lg:mb-24"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Featured Projects
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Production-ready applications delivering measurable business impact through intelligent automation and scalable architecture
          </p>
          <AnimatedDivider className="mt-8" />
        </motion.div>

        {/* Featured Project Spotlight */}
        <Spotlight 
          project={featuredProject} 
          onOpenModal={handleOpenModal}
        />

        {/* Filters */}
        <Filters
          tags={tags}
          selectedTag={selectedTag}
          onTagSelect={handleTagSelect}
        />

        {/* Projects Grid */}
        <div 
          id="projects-grid"
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              onOpenModal={handleOpenModal}
              onTagClick={handleTagClick}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && selectedTag && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No projects found
            </h3>
            <p className="text-gray-400 mb-4">
              No projects match the <span className="text-teal-400 font-medium">{selectedTag}</span> tag.
            </p>
            <button
              onClick={() => setSelectedTag(null)}
              className="text-teal-400 hover:text-teal-300 font-medium underline focus:outline-none focus:ring-2 focus:ring-teal-400/50 rounded"
            >
              Show all projects
            </button>
          </motion.div>
        )}

        {/* Results count */}
        {selectedTag && filteredProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center mt-12"
          >
            <p className="text-sm text-gray-500">
              Showing {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} tagged with{' '}
              <span className="text-teal-400 font-medium">{selectedTag}</span>
            </p>
          </motion.div>
        )}
      </div>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
}