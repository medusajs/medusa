const { withContentlayer } = require("next-contentlayer")

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "/ui",
  async rewrites() {
    return {
      fallback: [
        {
          source: "/:path*",
          destination: `${
            process.env.NEXT_PUBLIC_DOCS_URL || "https://localhost:3001"
          }/:path*`,
          basePath: false,
        },
      ],
    }
  },
  reactStrictMode: true,
}

module.exports = withContentlayer(nextConfig)
