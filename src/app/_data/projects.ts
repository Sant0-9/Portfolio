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
    slug: 'leo',
    title: 'Leo',
    summary: 'AI-powered personal assistant with advanced language understanding and multi-modal capabilities.',
    tags: ['AI', 'Assistant', 'NLP', 'Machine Learning'],
    image: '/images/projects/leo.jpg',
    links: {
      live: '#',
      code: 'https://github.com/santo-rahman/leo'
    },
    status: 'live',
    highlights: [
      'Advanced natural language processing',
      'Multi-modal interaction capabilities',
      'Personalized response generation',
      'Context-aware conversations',
      'Real-time learning and adaptation'
    ],
    description: 'An intelligent personal assistant powered by cutting-edge AI technology, capable of understanding complex queries and providing contextual responses.',
    role: 'AI Engineer & Lead Developer',
    techStack: ['Python', 'Transformers', 'FastAPI', 'WebSocket', 'PostgreSQL', 'Docker']
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
    techStack: ['Python', 'FastAPI', 'Bengali NLP', 'External AI API', 'PostgreSQL', 'Docker']
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
