'use client';

import { useState } from 'react';
import { Project } from '../../_data/projects';
import StickyProjectShowcase from './StickyProjectShowcase';
import ProjectModal from './ProjectModal';

export default function SectionProjects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const handleTagClick = (tag: string) => {
    console.log('Tag clicked:', tag);
  };

  return (
    <>
      <StickyProjectShowcase
        onOpenModal={handleOpenModal}
        onTagClick={handleTagClick}
      />

      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}