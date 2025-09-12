'use client'

import { projects } from '@/lib/projects'
import { motion } from 'framer-motion'
import ProjectCard from '@/app/_ui/ProjectCard'

export default function ProjectsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project, index) => (
        <ProjectCard
          key={project.id}
          project={project}
          index={index}
        />
      ))}
    </div>
  )
}

