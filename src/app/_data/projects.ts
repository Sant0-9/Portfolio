export interface Project {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  image: string;
  previewVideo?: string;
  links: {
    live?: string;
    code?: string;
    case?: string;
  };
  status?: 'wip' | 'live';
  highlights?: string[];
  description?: string;
  role?: string;
  techStack?: string[];
}

export const projects: Project[] = [
  {
    slug: 'tripwise',
    title: 'Tripwise',
    summary: 'AI-powered travel planner with RAG and interactive maps for personalized trip recommendations.',
    tags: ['RAG', 'Maps', 'Next.js', 'AI'],
    image: '/images/projects/tripwise.jpg',
    links: {
      live: '#',
      code: 'https://github.com/santo-rahman/tripwise'
    },
    status: 'wip',
    highlights: [
      'Advanced RAG system for travel recommendations',
      'Interactive map integration with real-time data',
      'Personalized itinerary generation',
      'Multi-modal AI for travel planning',
      'Real-time weather and local events integration'
    ],
    description: 'An intelligent travel planning platform that combines retrieval-augmented generation (RAG) with interactive mapping to create personalized travel experiences.',
    role: 'Full-Stack Developer & AI Engineer',
    techStack: ['Next.js', 'TypeScript', 'OpenAI API', 'Mapbox', 'PostgreSQL', 'Prisma', 'Tailwind CSS']
  },
  {
    slug: 'lifeos',
    title: 'LifeOS',
    summary: 'Multi-agent personal operating system for life management and productivity optimization.',
    tags: ['Agents', 'Memory', 'Next.js', 'AI'],
    image: '/images/projects/lifeos.jpg',
    links: {
      code: 'https://github.com/santo-rahman/lifeos'
    },
    status: 'wip',
    highlights: [
      'Multi-agent architecture for different life domains',
      'Persistent memory system across interactions',
      'Natural language interface for all operations',
      'Automated task and goal management',
      'Integration with external productivity tools'
    ],
    description: 'A comprehensive personal operating system powered by multiple specialized AI agents that work together to manage different aspects of your life.',
    role: 'Lead Developer & Architect',
    techStack: ['Next.js', 'TypeScript', 'Multiple LLM APIs', 'Vector Database', 'Redis', 'PostgreSQL']
  },
  {
    slug: 'barta',
    title: 'Barta',
    summary: 'Bengali news aggregation and RAG system for contextual news understanding.',
    tags: ['Bangla', 'News', 'RAG', 'NLP'],
    image: '/images/projects/barta.jpg',
    links: {
      code: 'https://github.com/santo-rahman/barta'
    },
    status: 'live',
    highlights: [
      'Multi-source Bengali news aggregation',
      'Advanced Bengali NLP processing',
      'Contextual news understanding with RAG',
      'Sentiment analysis and topic modeling',
      'Real-time news trend analysis'
    ],
    description: 'A sophisticated Bengali news platform that uses RAG technology to provide contextual understanding and analysis of Bengali news content.',
    role: 'Solo Developer',
    techStack: ['Python', 'FastAPI', 'Bengali NLP', 'OpenAI API', 'PostgreSQL', 'Docker']
  },
  {
    slug: 'portfolio',
    title: 'Portfolio Website',
    summary: 'Cinematic portfolio with aurora background and scroll-based 3D interactions.',
    tags: ['Next.js', 'Framer Motion', 'WebGL', 'Animation'],
    image: '/images/projects/portfolio.jpg',
    links: {
      live: '/',
      code: 'https://github.com/santo-rahman/portfolio'
    },
    status: 'live',
    highlights: [
      'Cinematic aurora and starfield background',
      'Scroll-based 3D interactions',
      'Optimized performance and accessibility',
      'Responsive design with micro-interactions',
      'Custom animation system'
    ],
    description: 'A modern portfolio website featuring cinematic visuals, smooth animations, and interactive elements while maintaining excellent performance.',
    role: 'Designer & Developer',
    techStack: ['Next.js', 'TypeScript', 'Framer Motion', 'Tailwind CSS', 'Canvas API']
  }
];

export const tags = Array.from(new Set(projects.flatMap(p => p.tags))).sort();

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find(p => p.slug === slug);
}

export function getProjectsByTag(tag: string): Project[] {
  return projects.filter(p => p.tags.includes(tag));
}

export function getFeaturedProject(): Project {
  return projects[0]; // Return first project as featured
}