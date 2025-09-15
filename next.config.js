/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Avoid optimizing framer-motion to prevent RSC client manifest issues
    optimizePackageImports: ['@react-three/fiber', '@react-three/drei', 'three']
  },
  eslint: {
    // Allow production builds to succeed even with ESLint errors
    ignoreDuringBuilds: true
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000
  }
}

module.exports = nextConfig
