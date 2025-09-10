import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-6xl sm:text-8xl font-bold text-text font-tight">
              404
            </h1>
            <h2 className="text-2xl sm:text-3xl font-semibold text-text">
              Page Not Found
            </h2>
          </div>
          
          <p className="text-muted max-w-md mx-auto text-lg">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          
          <div className="pt-4">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 bg-panel hover:bg-panel/80 text-text px-6 py-3 rounded-lg transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}