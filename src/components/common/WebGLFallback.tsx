'use client'

import { motion } from 'framer-motion'
import { fadeUp, stagger } from '@/lib/motion'
import { projects } from '@/lib/projects'

export default function WebGLFallback() {
  return (
    <div className="h-screen bg-gradient-to-b from-black via-zinc-900 to-black flex items-center justify-center relative overflow-hidden">
      {/* Animated background stars (CSS only) */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
      
      <motion.div 
        className="text-center text-white max-w-4xl mx-auto px-4 z-10"
        variants={stagger(0.2)}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-b from-white to-zinc-300 bg-clip-text text-transparent"
          variants={fadeUp}
        >
          Solar Portfolio
        </motion.h1>
        
        <motion.p 
          className="text-lg md:text-xl text-zinc-300 mb-8 max-w-2xl mx-auto leading-relaxed"
          variants={fadeUp}
        >
          Your browser doesn&apos;t support the 3D experience, but you can still explore my projects below.
        </motion.p>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
          variants={stagger(0.1)}
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              className="bg-zinc-900/60 backdrop-blur-sm border border-zinc-700/50 rounded-lg p-6 hover:border-zinc-600 transition-colors"
              variants={fadeUp}
              whileHover={{ scale: 1.02, y: -4 }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-semibold text-white">{project.name}</h3>
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: project.color }}
                />
              </div>
              <p className="text-zinc-300 mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs rounded border"
                    style={{ 
                      borderColor: `${project.color}55`,
                      color: project.color,
                      backgroundColor: `${project.color}1a`
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {(project.demo && project.demo !== '#') && (
                <div className="mt-4">
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 text-sm font-medium rounded transition-colors"
                    style={{ 
                      backgroundColor: project.color,
                      color: '#000'
                    }}
                  >
                    View Demo
                  </a>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
          variants={fadeUp}
        >
          <a href="#projects" className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-3 rounded-full hover:bg-white/20 transition-all duration-300 font-medium">
            View All Projects
          </a>
          <a href="#about" className="bg-transparent border border-white/30 text-white px-8 py-3 rounded-full hover:border-white/50 hover:bg-white/5 transition-all duration-300 font-medium">
            About Me
          </a>
        </motion.div>
      </motion.div>
    </div>
  )
}