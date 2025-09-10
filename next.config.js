const { withContentlayer } = require('next-contentlayer')

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@contentlayer/core']
  }
}

module.exports = withContentlayer(nextConfig)