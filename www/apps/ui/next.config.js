const { withContentlayer } = require("next-contentlayer")

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "/ui",
  reactStrictMode: true,
}

module.exports = withContentlayer(nextConfig)
