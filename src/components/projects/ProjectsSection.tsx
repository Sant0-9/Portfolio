'use client'

import { projects } from '@/lib/projects'
import { motion } from 'framer-motion'
import { fadeUp, stagger } from '@/lib/motion'

export default function ProjectsSection() {
  return (
    <section id="projects" className="py-24 bg-gradient-to-b from-black to-zinc-900">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4" variants={fadeUp}>
            Projects
          </motion.h2>
          <motion.p className="text-lg text-zinc-300 max-w-2xl mx-auto" variants={fadeUp}>
            A selection of work represented as planets above. Browse the details below.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {projects.map((p) => (
            <motion.article
              key={p.id}
              className="rounded-xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-sm p-5 hover:border-zinc-700 transition-colors"
              variants={fadeUp}
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl font-semibold text-white">{p.name}</h3>
                <span aria-hidden className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: p.color }} />
              </div>
              <p className="mt-2 text-sm text-zinc-300">{p.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-1 text-xs rounded border"
                    style={{ borderColor: `${p.color}55`, color: p.color, backgroundColor: `${p.color}1a` }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

