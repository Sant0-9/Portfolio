import { Project } from '@/lib/projects'

interface ProjectTooltipProps {
  project: Project
}

export default function ProjectTooltip({ project }: ProjectTooltipProps) {
  return (
    <div className="bg-black/95 backdrop-blur-sm border border-zinc-600 rounded-lg p-3 text-white max-w-xs transform -translate-y-16 animate-in slide-in-from-bottom-2 shadow-2xl">
      <h3 className="font-semibold text-base mb-2 text-white">{project.name}</h3>
      <p className="text-xs text-zinc-300 mb-3 leading-relaxed">{project.description}</p>
      <div className="flex flex-wrap gap-1">
        {project.tags.map((tag, index) => (
          <span
            key={tag}
            className="px-2 py-1 rounded text-xs font-medium"
            style={{ 
              backgroundColor: `${project.color}30`,
              color: project.color,
              border: `1px solid ${project.color}40`
            }}
          >
            {tag}
          </span>
        ))}
      </div>
      {(project.demo || project.github) && (
        <div className="flex gap-2 mt-3 pt-2 border-t border-zinc-700">
          {project.demo && (
            <a
              href={project.demo}
              className="text-xs px-3 py-1 rounded transition-colors font-medium hover:scale-105 transform"
              style={{ 
                backgroundColor: project.color,
                color: '#000'
              }}
            >
              Demo
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              className="text-xs bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-1 rounded transition-all font-medium hover:scale-105 transform"
            >
              GitHub
            </a>
          )}
        </div>
      )}
    </div>
  )
}