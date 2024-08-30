/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  // Remove assetPrefix: './',
  // Disable image optimization for Tauri
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig