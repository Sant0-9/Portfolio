import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <section 
      className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16"
      aria-label="Hero section"
    >
      <div className="container mx-auto max-w-4xl">
        <div className="text-center space-y-8">
          {/* Main headline */}
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-text font-tight leading-tight">
              <span className="block">Quiet mind,</span>
              <span className="block">loud builds.</span>
              <span className="block text-muted mt-4 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl">
                I design, train, and ship agentic software.
              </span>
            </h1>
          </div>

          {/* Subline */}
          <div className="max-w-2xl mx-auto">
            <p className="text-lg sm:text-xl text-muted leading-relaxed">
              CS @ UTD • Researching RAG + multi-agent systems • Open-sourcing my playbook.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-8">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 bg-panel hover:bg-panel/80 text-text px-6 py-3 sm:px-8 sm:py-4 rounded-lg transition-all duration-200 font-medium text-base sm:text-lg border border-panel hover:border-muted/20 focus:outline-none focus:ring-2 focus:ring-muted focus:ring-offset-2 focus:ring-offset-background w-full sm:w-auto justify-center"
            >
              View projects
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 bg-transparent hover:bg-panel/40 text-text px-6 py-3 sm:px-8 sm:py-4 rounded-lg transition-all duration-200 font-medium text-base sm:text-lg border border-muted/30 hover:border-muted/50 focus:outline-none focus:ring-2 focus:ring-muted focus:ring-offset-2 focus:ring-offset-background w-full sm:w-auto justify-center"
            >
              Hire me for Spring &apos;26
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}