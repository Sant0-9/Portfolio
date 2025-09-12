interface WebGLCapabilities {
  hasWebGL: boolean
  hasWebGL2: boolean
  maxTextureSize: number
  maxVertexAttributes: number
  renderer: string
  vendor: string
  isLowEnd: boolean
}

export function detectWebGLCapabilities(): WebGLCapabilities {
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null
  const gl2 = canvas.getContext('webgl2')
  
  const capabilities: WebGLCapabilities = {
    hasWebGL: !!gl,
    hasWebGL2: !!gl2,
    maxTextureSize: 0,
    maxVertexAttributes: 0,
    renderer: 'Unknown',
    vendor: 'Unknown',
    isLowEnd: false
  }
  
  if (gl) {
    // Get WebGL parameters
    capabilities.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number
    capabilities.maxVertexAttributes = gl.getParameter(gl.MAX_VERTEX_ATTRIBS) as number
    
    // Get renderer info (if available)
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
    if (debugInfo) {
      capabilities.renderer = gl.getParameter((debugInfo as any).UNMASKED_RENDERER_WEBGL) as string
      capabilities.vendor = gl.getParameter((debugInfo as any).UNMASKED_VENDOR_WEBGL) as string
    }
    
    // Detect low-end devices
    capabilities.isLowEnd = (
      capabilities.maxTextureSize < 2048 ||
      capabilities.maxVertexAttributes < 16 ||
      capabilities.renderer.includes('Intel HD') ||
      capabilities.renderer.includes('Mali-400') ||
      capabilities.renderer.includes('Adreno 3')
    )
  }
  
  // Clean up
  canvas.remove()
  
  return capabilities
}

export function isWebGLSupported(): boolean {
  try {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null
    canvas.remove()
    return !!context
  } catch (e) {
    return false
  }
}

export function getOptimalSettings(capabilities: WebGLCapabilities) {
  if (!capabilities.hasWebGL) {
    return null // No 3D support
  }
  
  return {
    // Particle counts
    nearStars: capabilities.isLowEnd ? 200 : 800,
    farStars: capabilities.isLowEnd ? 400 : 1500,
    
    // Quality settings
    antialias: !capabilities.isLowEnd,
    shadows: false, // Always disabled for performance
    pixelRatio: capabilities.isLowEnd ? 1 : Math.min(2, window.devicePixelRatio),
    
    // Performance settings
    powerPreference: capabilities.isLowEnd ? 'default' as const : 'high-performance' as const,
    preserveDrawingBuffer: false,
    
    // Feature flags
    enableAdvancedEffects: !capabilities.isLowEnd,
    enableParallax: !capabilities.isLowEnd,
    enableComplexAnimations: !capabilities.isLowEnd
  }
}