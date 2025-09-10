'use client'

import { useState } from 'react'
import ProjectFlipCard from '@/components/cards/ProjectFlipCard'
import { allProjects } from '../../../.contentlayer/generated'
import { Users, DollarSign, TrendingUp, BarChart3 } from 'lucide-react'

// Icon mapping for different metric types
const getMetricIcon = (metric: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    'Monthly Active Users': <Users className="w-4 h-4 text-muted" />,
    'Revenue Impact': <DollarSign className="w-4 h-4 text-muted" />,
    'Engagement Boost': <TrendingUp className="w-4 h-4 text-muted" />,
    'Decision Speed': <BarChart3 className="w-4 h-4 text-muted" />,
    'Data Accuracy': <BarChart3 className="w-4 h-4 text-muted" />,
  }
  return iconMap[metric] || <BarChart3 className="w-4 h-4 text-muted" />
}

// Helper function to determine project category based on stack
const getProjectCategory = (stack: string[]): string => {
  const stackLower = stack.map(tech => tech.toLowerCase())
  
  // AI/ML category indicators
  const aiMlTech = ['openai', 'tensorflow', 'pytorch', 'python', 'machine learning', 'ai', 'ml', 'gpt']
  if (aiMlTech.some(tech => stackLower.some(s => s.includes(tech)))) {
    return 'AI/ML'
  }
  
  // Systems category indicators  
  const systemsTech = ['docker', 'kubernetes', 'aws', 'azure', 'gcp', 'postgresql', 'redis', 'kafka', 'airflow', 'microservices']
  if (systemsTech.some(tech => stackLower.some(s => s.includes(tech)))) {
    return 'Systems'
  }
  
  // Default to Web category
  return 'Web'
}

const categories = ['All', 'AI/ML', 'Web', 'Systems']

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const projects = allProjects.map((project) => {
    // Parse JSON fields and get the primary impact metric for the card
    const impactData = project.impact ? JSON.parse(project.impact as string) : []
    const primaryImpact = impactData[0]
    
    return {
      title: project.title,
      image: project.cover || '/api/placeholder/400/300',
      metric: {
        label: primaryImpact?.metric || 'Impact',
        value: primaryImpact?.value || 'High',
        icon: primaryImpact ? getMetricIcon(primaryImpact.metric) : <BarChart3 className="w-4 h-4 text-muted" />
      },
      summary: project.summary,
      stack: project.stack,
      caseStudyUrl: project.url,
      imageAlt: `${project.title} project screenshot`,
      category: getProjectCategory(project.stack)
    }
  })

  // Filter projects based on selected category
  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory)

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-6xl font-bold text-text font-tight mb-8">
            Projects
          </h1>
          <p className="text-xl text-muted max-w-2xl mx-auto mb-12">
            Hover over each card to explore my latest work and see the impact of modern development practices.
          </p>
          
          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-text text-background'
                    : 'bg-background/50 text-muted hover:bg-background hover:text-text border border-muted/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        {/* Responsive Grid: 1-col on 320px, 3-col on ≥1024px */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <ProjectFlipCard
              key={project.title}
              title={project.title}
              image={project.image}
              metric={project.metric}
              summary={project.summary}
              stack={project.stack}
              caseStudyUrl={project.caseStudyUrl}
              imageAlt={project.imageAlt}
            />
          ))}
        </div>
        
        {/* Empty state when no projects match filter */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted text-lg">
              No projects found in the {selectedCategory} category.
            </p>
            <button
              onClick={() => setSelectedCategory('All')}
              className="mt-4 text-text hover:text-muted transition-colors"
            >
              View all projects →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}