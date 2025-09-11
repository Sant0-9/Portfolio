export interface Project {
  id: string
  name: string
  description: string
  tags: string[]
  color: string
  orbit: number // orbit radius multiplier
  demo?: string
  github?: string
}

export const projects: Project[] = [
  {
    id: "tripwise",
    name: "Tripwise",
    description: "AI-powered travel planning with RAG integration and interactive maps",
    tags: ["RAG", "Maps", "Next.js"],
    color: "#5dd6c0",
    orbit: 2.2,
    demo: "#",
    github: "#"
  },
  {
    id: "leo",
    name: "LifeOS",
    description: "Personal AI agent system with persistent memory and goal tracking",
    tags: ["Agents", "Memory"],
    color: "#a78bfa",
    orbit: 3.0,
    demo: "#",
    github: "#"
  },
  {
    id: "barta",
    name: "Barta",
    description: "Bangla news aggregation and analysis using RAG technology",
    tags: ["Bangla", "News", "RAG"],
    color: "#f2a97a",
    orbit: 3.8,
    demo: "#",
    github: "#"
  }
]