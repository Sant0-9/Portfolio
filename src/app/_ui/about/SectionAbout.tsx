'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import BioCard from './BioCard';
import TimelineMini from './TimelineMini';
import Stats from './Stats';
import { reveal } from '../motion';
import { MOTION_DISABLED } from '../hooks/useReducedMotion';
import AnimatedDivider from '../AnimatedDivider';

const bioData = {
  name: 'Santo Rahman',
  role: 'Full-Stack Developer & AI Specialist',
  location: 'Dallas, TX',
  bullets: [
    'CS Student @ UT Dallas',
    'AI & Multi-Agent Systems Expert', 
    'Performance-Driven Development'
  ]
};

const timelineData = [
  {
    phase: 'Current',
    title: 'Delivering Production-Ready Solutions',
    description: 'Finalizing Tripwise AI travel platform and LifeOS multi-agent system with enterprise-level performance and security optimizations.'
  },
  {
    phase: 'Q1 2025',
    title: 'Advanced AI Integration',
    description: 'Launching enhanced RAG systems with 90% accuracy improvements and automated infrastructure scaling for high-traffic applications.'
  },
  {
    phase: 'Q2 2025',
    title: 'Enterprise AI Platform',
    description: 'Building comprehensive multi-agent LifeOS platform targeting 10k+ users with real-time collaboration and intelligent automation.'
  }
];

const statsData = [
  { label: 'Years Coding', value: 2, suffix: '+' },
  { label: 'Projects Shipped', value: 10, suffix: '+' },
  { label: 'Core Technologies', value: 8, suffix: '+' }
];

const aboutPoints = [
  {
    title: 'Full-Stack Architect',
    description: 'I deliver end-to-end web solutions that reduce development time by 40% while maintaining enterprise-grade security and performance standards.'
  },
  {
    title: 'AI Integration Specialist',
    description: 'I build intelligent systems using RAG and multi-agent architectures that automate complex workflows and improve user decision-making by 3x.'
  },
  {
    title: 'Scalability Expert',
    description: 'I design distributed systems and APIs that handle millions of requests while maintaining sub-100ms response times and 99.9% uptime.'
  }
];

export default function SectionAbout() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  
  // Ambient parallax for decorative elements
  const y1 = useTransform(scrollY, [0, 1000], [0, -50]);
  const y2 = useTransform(scrollY, [0, 1000], [0, 30]);

  return (
    <section ref={containerRef} id="about" className="relative py-20 lg:py-32 overflow-hidden">
      {/* Ambient decorative elements */}
      {!MOTION_DISABLED && (
        <>
          <motion.div
            style={{ y: y1 }}
            className="absolute top-20 left-10 w-24 h-24 bg-teal-500/[0.04] rounded-full blur-xl hidden lg:block"
          />
          <motion.div
            style={{ y: y2 }}
            className="absolute bottom-32 right-16 w-32 h-32 bg-purple-500/[0.06] rounded-full blur-2xl hidden lg:block"
          />
        </>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-10%' }}
          variants={reveal}
          className="text-center mb-16 lg:mb-24"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            About Me
          </h2>
          <AnimatedDivider className="mt-8" />
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column - Sticky Bio Card */}
          <div className="lg:col-span-4">
            <BioCard {...bioData} />
          </div>

          {/* Right Column - Scrolling Content */}
          <div className="lg:col-span-8 space-y-16">
            {/* What I'm About */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-10%' }}
              variants={reveal}
              className="space-y-8"
            >
              <h3 className="text-2xl font-semibold text-white">What I'm About</h3>
              <div className="grid sm:grid-cols-1 gap-6">
                {aboutPoints.map((point, index) => (
                  <motion.div
                    key={point.title}
                    initial={MOTION_DISABLED ? {} : { opacity: 0, x: 30 }}
                    whileInView={MOTION_DISABLED ? {} : { opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="relative group"
                  >
                    <div className="p-6 rounded-xl bg-white/[0.04] backdrop-blur-sm border border-white/10 transition-all duration-300 group-hover:bg-white/[0.08] group-hover:border-white/20">
                      <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-teal-400 to-purple-500" />
                        {point.title}
                      </h4>
                      <p className="text-gray-300 leading-relaxed">{point.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Timeline */}
            <TimelineMini items={timelineData} />

            {/* Stats */}
            <Stats stats={statsData} />

            {/* Tech Stack */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-10%' }}
              variants={reveal}
              className="space-y-6"
            >
              <h3 className="text-xl font-semibold text-white">Core Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {['Next.js', 'Node.js', 'PostgreSQL', 'Python', 'TypeScript', 'React', 'Tailwind CSS', 'Framer Motion'].map((tech, index) => (
                  <motion.span
                    key={tech}
                    initial={MOTION_DISABLED ? {} : { opacity: 0, scale: 0.8 }}
                    whileInView={MOTION_DISABLED ? {} : { opacity: 1, scale: 1 }}
                    whileHover={MOTION_DISABLED ? {} : { 
                      scale: 1.05,
                      boxShadow: '0 0 0 1px rgba(20, 184, 166, 0.3), inset 0 0 4px rgba(20, 184, 166, 0.1)'
                    }}
                    whileTap={MOTION_DISABLED ? {} : { scale: 0.98 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    viewport={{ once: true }}
                    className="px-3 py-1.5 text-sm bg-white/5 text-teal-300 rounded-full border border-white/10 hover:bg-white/10 hover:border-white/20 transition-colors duration-200"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}