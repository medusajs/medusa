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
          source: "/:path*",
          destination: `${process.env.NEXT_PUBLIC_DOCS_URL}/:path*`,
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
