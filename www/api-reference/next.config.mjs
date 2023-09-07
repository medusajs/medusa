import mdx from "@next/mdx"

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  async rewrites() {
    return {
      fallback: [
        {
          source: "/ui",
          destination: `${process.env.NEXT_PUBLIC_UI_URL}/ui`,
        },
        {
          source: "/ui/:path*",
          destination: `${process.env.NEXT_PUBLIC_UI_URL}/ui/:path*`,
        },
        {
          source: "/:path*",
          destination: `${process.env.NEXT_PUBLIC_DOCS_URL}/:path*`,
        },
      ],
    }
  },
  webpack: (config) => {
    config.ignoreWarnings = [{ module: /node_modules\/keyv\/src\/index\.js/ }]

    return config
  },
}

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {
    rehypePlugins: [],
  },
})
export default withMDX(nextConfig)
