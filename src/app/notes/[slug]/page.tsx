import { allNotes } from '../../../../.contentlayer/generated'
import { getMDXComponent } from 'next-contentlayer/hooks'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { Calendar, Tag } from 'lucide-react'
import Link from 'next/link'

interface NotePageProps {
  params: { slug: string }
}

export default function NotePage({ params }: NotePageProps) {
  const note = allNotes.find((note) => note.slug === params.slug)
  
  if (!note) notFound()

  const MDXContent = getMDXComponent(note.body.code)

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="max-w-4xl mx-auto">
        {/* Note Header */}
        <header className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-text font-tight mb-6">
            {note.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 mb-6 text-muted">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <time dateTime={note.date}>
                {format(new Date(note.date), 'MMMM d, yyyy')}
              </time>
            </div>
          </div>

          <p className="text-xl text-muted leading-relaxed mb-8">
            {note.summary}
          </p>

          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-muted" />
                <span className="text-sm font-medium text-muted">Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {note.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm font-medium bg-panel text-text rounded-full border border-muted/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </header>

        {/* MDX Content */}
        <article className="prose prose-lg prose-slate dark:prose-invert max-w-none">
          <MDXContent />
        </article>

        {/* Navigation */}
        <footer className="mt-12 pt-8 border-t border-muted/20">
          <Link
            href="/notes"
            className="inline-flex items-center gap-2 text-text hover:text-muted transition-colors"
          >
            ← Back to Notes
          </Link>
        </footer>
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  return allNotes.map((note) => ({
    slug: note.slug,
  }))
}

export function generateMetadata({ params }: NotePageProps) {
  const note = allNotes.find((note) => note.slug === params.slug)
  
  if (!note) return {}

  return {
    title: note.title,
    description: note.summary,
  }
}