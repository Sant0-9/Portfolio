import Link from 'next/link'
import SocialBar from './SocialBar'

export default function SiteHeader() {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 border-b border-panel/20 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link 
              href="/" 
              className="text-xl font-semibold text-text hover:text-text/80 transition-colors font-tight"
            >
              Portfolio
            </Link>
          </div>
          
          <div className="flex items-center gap-8">
            <nav role="navigation" aria-label="Main navigation" className="hidden sm:block">
              <ul className="flex items-center space-x-8">
                <li>
                  <Link 
                    href="/projects" 
                    className="text-text hover:text-text/80 transition-colors text-sm font-medium"
                  >
                    Projects
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/notes" 
                    className="text-text hover:text-text/80 transition-colors text-sm font-medium"
                  >
                    Notes
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/contact" 
                    className="text-text hover:text-text/80 transition-colors text-sm font-medium"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>
            
            <SocialBar />
          </div>
        </div>
      </div>
    </header>
  )
}