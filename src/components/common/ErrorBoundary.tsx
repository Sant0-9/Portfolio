'use client'

import { Component, ReactNode, ErrorInfo } from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('3D Scene Error:', error, errorInfo)
    this.setState({ error, errorInfo })
    
    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      // Could integrate with Sentry, LogRocket, etc.
      console.error('Portfolio 3D Error:', { error, errorInfo })
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="h-screen bg-black flex items-center justify-center text-zinc-200">
          <div className="text-center max-w-md mx-auto p-8">
            <h2 className="text-2xl font-bold mb-4">Solar System Loading Error</h2>
            <p className="text-zinc-400 mb-6">
              Unable to load the 3D experience. This might be due to WebGL not being supported by your browser.
            </p>
            <button 
              onClick={() => this.setState({ hasError: false })}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
            <div className="mt-6">
              <a 
                href="#projects" 
                className="text-zinc-400 hover:text-white underline"
              >
                Skip to Projects →
              </a>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}