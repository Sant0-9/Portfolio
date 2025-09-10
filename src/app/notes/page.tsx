import { allNotes } from '../../../.contentlayer/generated'
import { compareDesc, format } from 'date-fns'
import Link from 'next/link'
import { Calendar, Tag } from 'lucide-react'

export default function NotesPage() {
  const notes = allNotes.sort((a, b) => 
    compareDesc(new Date(a.date), new Date(b.date))
  )

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-6xl font-bold text-text font-tight mb-8">
            Notes
          </h1>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Technical insights, learnings, and thoughts on development, design, and technology.
          </p>
        </div>

        <div className="space-y-8">
          {notes.map((note) => (
            <article
              key={note._id}
              className="group bg-panel border border-muted/20 rounded-lg p-6 hover:border-muted/40 transition-colors"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={note.date}>
                      {format(new Date(note.date), 'MMMM d, yyyy')}
                    </time>
                  </div>
                  
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      <div className="flex gap-1">
                        {note.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-xs bg-background rounded-full border border-muted/20"
                          >
                            {tag}
                          </span>
                        ))}
                        {note.tags.length > 3 && (
                          <span className="text-xs text-muted">
                            +{note.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-text mb-2 group-hover:text-muted transition-colors">
                    <Link href={note.url}>
                      {note.title}
                    </Link>
                  </h2>
                  <p className="text-muted leading-relaxed">
                    {note.summary}
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    href={note.url}
                    className="text-text hover:text-muted transition-colors text-sm font-medium"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {notes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted text-lg">No notes published yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}