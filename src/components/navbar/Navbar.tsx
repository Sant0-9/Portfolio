import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link 
            href="/" 
            className="text-xl font-semibold text-zinc-100 hover:text-zinc-300 transition-colors"
          >
            Portfolio
          </Link>
          
          <div className="flex items-center space-x-8">
            <Link 
              href="#projects" 
              className="text-zinc-300 hover:text-zinc-100 transition-colors text-sm font-medium"
            >
              Projects
            </Link>
            <Link 
              href="#about" 
              className="text-zinc-300 hover:text-zinc-100 transition-colors text-sm font-medium"
            >
              About
            </Link>
            <Link 
              href="#contact" 
              className="text-zinc-300 hover:text-zinc-100 transition-colors text-sm font-medium"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}