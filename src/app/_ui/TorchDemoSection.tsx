'use client';

import { motion } from 'framer-motion';
import CursorTorch from './CursorTorch';
import Section from './Section';

export default function TorchDemoSection() {
  return (
    <Section
      id="torch-demo"
      className="min-h-screen flex items-center justify-center relative bg-black"
      padding="xl"
      maxWidth="2xl"
    >
      <div className="w-full max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-white/30 mb-4">
            Hover to Reveal
          </h2>
          <p className="text-zinc-400 text-lg">
            Move your mouse over the text below to see the torch effect
          </p>
        </motion.div>

        <CursorTorch
          torchSize={250}
          intensity={0.9}
          className="min-h-[400px] flex items-center justify-center"
        >
          <div className="text-center space-y-8 px-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <div className="mb-4">
                You&apos;ve gotta dance like there&apos;s
              </div>
              <div className="mb-4">
                <span className="text-white">nobody watching</span>,
              </div>
              <div className="mb-4">
                Love like <span className="text-white">you&apos;ll never be hurt</span>,
              </div>
              <div className="mb-4">
                Sing like <span className="text-white">there&apos;s nobody listening</span>,
              </div>
              <div>
                And live like <span className="text-white">it&apos;s heaven on earth</span>
              </div>
            </h1>

            <div className="text-xl md:text-2xl text-gray-400 font-light">
              — William W. Purkey
            </div>
          </div>
        </CursorTorch>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-sm text-zinc-300">
              Interactive torch effect powered by CSS masks
            </span>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}