'use client'

export default function SimpleHero() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Simple animated background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900 to-black">
        {/* Animated dots/particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-900/5 to-transparent animate-pulse" />
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center text-white max-w-4xl">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-b from-white to-zinc-300 bg-clip-text text-transparent">
            Portfolio
          </h1>
          
          <p className="text-xl md:text-2xl text-zinc-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Showcasing my projects and skills
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#projects" 
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-3 rounded-full hover:bg-white/20 transition-all duration-300 font-medium"
            >
              View Projects
            </a>
            <a 
              href="#about"
              className="bg-transparent border border-white/30 text-white px-8 py-3 rounded-full hover:border-white/50 hover:bg-white/5 transition-all duration-300 font-medium"
            >
              About Me
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}