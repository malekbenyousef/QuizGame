/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_HOST: process.env.HOST || 'http://localhost:3000',
  },
}

module.exports = nextConfig 