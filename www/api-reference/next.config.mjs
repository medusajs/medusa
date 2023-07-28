import mdx from "@next/mdx"

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  experimental: {
    serverActions: true,
  },
  async rewrites() {
    return {
      fallback: [
        {
          source: "/:path*",
          destination: "https://docs.medusajs.com/:path*",
        },
      ],
    }
  },
}

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {
    rehypePlugins: [],
  },
})
export default withMDX(nextConfig)
