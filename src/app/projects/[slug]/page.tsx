import { allProjects } from '../../../../.contentlayer/generated'
import { getMDXComponent } from 'next-contentlayer/hooks'
import { notFound } from 'next/navigation'
import { ExternalLink, Github, Calendar, User } from 'lucide-react'
import Link from 'next/link'

interface ProjectPageProps {
  params: { slug: string }
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = allProjects.find((project) => project.slug === params.slug)
  
  if (!project) notFound()

  const MDXContent = getMDXComponent(project.body.code)

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="max-w-4xl mx-auto">
        {/* Project Header */}
        <header className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-text font-tight mb-6">
            {project.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 mb-6 text-muted">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{project.role}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{project.period}</span>
            </div>
          </div>

          <p className="text-xl text-muted leading-relaxed mb-8">
            {project.summary}
          </p>

          {/* Tech Stack */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-text mb-4">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 text-sm font-medium bg-panel text-text rounded-full border border-muted/20"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Impact Metrics */}
          {project.impact && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-text mb-4">Impact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {JSON.parse(project.impact as string).map((metric: any, index: number) => (
                  <div key={index} className="bg-panel p-4 rounded-lg border border-muted/20">
                    <div className="text-2xl font-bold text-text mb-1">
                      {metric.value}
                    </div>
                    <div className="text-sm font-medium text-muted mb-1">
                      {metric.metric}
                    </div>
                    {metric.description && (
                      <div className="text-xs text-muted">
                        {metric.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          {project.links && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-text mb-4">Links</h3>
              <div className="flex flex-wrap gap-3">
                {JSON.parse(project.links as string).map((link: any, index: number) => (
                  <a
                    key={index}
                    href={link.url}
                    target={link.type !== 'case-study' ? '_blank' : undefined}
                    rel={link.type !== 'case-study' ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-panel hover:bg-panel/80 text-text rounded-lg transition-colors border border-muted/20 hover:border-muted/40"
                  >
                    {link.type === 'github' && <Github className="w-4 h-4" />}
                    {(link.type === 'demo' || link.type === 'website') && <ExternalLink className="w-4 h-4" />}
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </header>

        {/* MDX Content */}
        <article className="prose prose-lg prose-slate dark:prose-invert max-w-none">
          <MDXContent />
        </article>

        {/* Navigation */}
        <footer className="mt-12 pt-8 border-t border-muted/20">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-text hover:text-muted transition-colors"
          >
            ← Back to Projects
          </Link>
        </footer>
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  return allProjects.map((project) => ({
    slug: project.slug,
  }))
}

export function generateMetadata({ params }: ProjectPageProps) {
  const project = allProjects.find((project) => project.slug === params.slug)
  
  if (!project) return {}

  return {
    title: project.title,
    description: project.summary,
  }
}