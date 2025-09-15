'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import TimelineMini from './TimelineMini';
import Stats from './Stats';
import { reveal } from '../motion';
import { MOTION_DISABLED } from '../motion';
import AnimatedDivider from '../AnimatedDivider';


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
  const [isMounted, setIsMounted] = useState(false);
  
  // Get scroll progress for the entire section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end start"]
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Create motion values for scroll-triggered animations
  const shouldAnimate = isMounted && !MOTION_DISABLED;
  

  // Create scroll-triggered animations for different sections
  const headerY = useTransform(scrollYProgress, [0, 0.2], [100, 0]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const aboutCardsY = useTransform(scrollYProgress, [0.1, 0.4], [100, 0]);
  const aboutCardsOpacity = useTransform(scrollYProgress, [0.1, 0.4], [0, 1]);
  const timelineY = useTransform(scrollYProgress, [0.3, 0.6], [100, 0]);
  const timelineOpacity = useTransform(scrollYProgress, [0.3, 0.6], [0, 1]);
  const statsY = useTransform(scrollYProgress, [0.5, 0.8], [100, 0]);
  const statsOpacity = useTransform(scrollYProgress, [0.5, 0.8], [0, 1]);
  const techStackY = useTransform(scrollYProgress, [0.7, 1], [100, 0]);
  const techStackOpacity = useTransform(scrollYProgress, [0.7, 1], [0, 1]);

  return (
    <section ref={containerRef} id="about" className="relative min-h-[80vh] py-8 lg:py-12">
      {/* Main content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Animated Section Header */}
        <motion.div
          style={{
            y: headerY,
            opacity: headerOpacity
          }}
          className="text-center mb-8 lg:mb-12"
        >
          <motion.h2
            className="text-5xl lg:text-7xl font-bold text-white mb-6"
            initial={{ scale: 0.8, rotateX: 15 }}
            whileInView={{ scale: 1, rotateX: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            About Me
          </motion.h2>
          <motion.p
            className="text-xl lg:text-2xl text-zinc-300 max-w-3xl mx-auto leading-relaxed mb-8"
            style={{ fontFamily: 'Exo 2, sans-serif', textShadow: '0 0 20px rgba(116,185,255,0.4)' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Transforming ideas into scalable, intelligent web applications that drive real business outcomes.
          </motion.p>
          <AnimatedDivider className="mt-8" />
        </motion.div>

        {/* Scrolling Content with enhanced animations */}
        <div className="space-y-6 lg:space-y-8">
          {/* What I'm About - Enhanced with scroll triggers */}
          <motion.div
            style={{
              y: aboutCardsY,
              opacity: aboutCardsOpacity
            }}
            className="space-y-12"
          >
            <motion.h3
              className="text-3xl lg:text-4xl font-bold text-white text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              What I&apos;m About
            </motion.h3>
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
              {aboutPoints.map((point, index) => (
                <motion.div
                  key={point.title}
                  initial={MOTION_DISABLED ? {} : { opacity: 0, y: 50, rotateX: 15 }}
                  whileInView={MOTION_DISABLED ? {} : { opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    delay: index * 0.2,
                    duration: 0.8,
                    ease: "easeOut"
                  }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="relative group"
                  whileHover={MOTION_DISABLED ? {} : {
                    y: -10,
                    transition: { duration: 0.3 }
                  }}
                >
                    <div className="relative p-6 rounded-xl bg-white/[0.02] backdrop-blur-xl border border-white/5 transition-all duration-500 group-hover:bg-white/[0.04] group-hover:border-white/10 overflow-hidden">
                      {/* Liquid glass effects */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400/3 to-purple-500/3 opacity-60" />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/3 to-transparent" />

                      {/* Flowing liquid effect */}
                      <motion.div
                        className="absolute inset-0 rounded-xl opacity-15"
                        animate={{
                          background: [
                            'radial-gradient(circle at 30% 40%, rgba(20, 184, 166, 0.08) 0%, transparent 50%)',
                            'radial-gradient(circle at 70% 60%, rgba(139, 92, 246, 0.08) 0%, transparent 50%)',
                            'radial-gradient(circle at 30% 40%, rgba(20, 184, 166, 0.08) 0%, transparent 50%)'
                          ]
                        }}
                        transition={{
                          duration: 6,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.5
                        }}
                      />

                      <h4 className="relative text-lg font-semibold text-white mb-3 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-teal-400 to-purple-500" />
                        {point.title}
                      </h4>
                      <p className="relative text-gray-300 leading-relaxed">{point.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

          {/* Timeline with scroll triggers */}
          <motion.div
            style={{
              y: timelineY,
              opacity: timelineOpacity
            }}
          >
            <TimelineMini items={timelineData} />
          </motion.div>

          {/* Stats with scroll triggers */}
          <motion.div
            style={{
              y: statsY,
              opacity: statsOpacity
            }}
          >
            <Stats stats={statsData} />
          </motion.div>

          {/* Tech Stack with scroll triggers */}
          <motion.div
            style={{
              y: techStackY,
              opacity: techStackOpacity
            }}
            className="space-y-8"
          >
            <motion.h3
              className="text-3xl lg:text-4xl font-bold text-white text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              Core Technologies
            </motion.h3>
              <div className="overflow-hidden relative">
                <motion.div
                  animate={{
                    x: [0, "-50%"]
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="flex gap-4 whitespace-nowrap w-max"
                >
                  {/* First set of tech tags */}
                  {['Next.js', 'Node.js', 'PostgreSQL', 'Python', 'TypeScript', 'React', 'Tailwind CSS', 'Framer Motion'].map((tech, index) => (
                    <motion.span
                      key={`first-${tech}`}
                      initial={MOTION_DISABLED ? {} : { opacity: 0, scale: 0.8 }}
                      whileInView={MOTION_DISABLED ? {} : { opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      viewport={{ once: true }}
                      className="px-4 py-2 text-sm bg-white/5 text-teal-300 rounded-full border border-white/10 flex-shrink-0"
                    >
                      {tech}
                    </motion.span>
                  ))}
                  {/* Duplicate set for seamless loop */}
                  {['Next.js', 'Node.js', 'PostgreSQL', 'Python', 'TypeScript', 'React', 'Tailwind CSS', 'Framer Motion'].map((tech, index) => (
                    <motion.span
                      key={`second-${tech}-${index}`}
                      className="px-4 py-2 text-sm bg-white/5 text-teal-300 rounded-full border border-white/10 flex-shrink-0"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
  );
}