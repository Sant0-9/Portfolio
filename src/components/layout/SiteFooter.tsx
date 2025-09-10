import Link from 'next/link'

export default function SiteFooter() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="border-t border-panel bg-background mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between py-8 gap-4">
          <div className="text-muted text-sm">
            © {currentYear} Portfolio. All rights reserved.
          </div>
          
          <nav role="navigation" aria-label="Footer navigation">
            <ul className="flex items-center space-x-6">
              <li>
                <Link 
                  href="/privacy" 
                  className="text-muted hover:text-text transition-colors text-sm"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms" 
                  className="text-muted hover:text-text transition-colors text-sm"
                >
                  Terms
                </Link>
              </li>
              <li>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted hover:text-text transition-colors text-sm"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  )
}