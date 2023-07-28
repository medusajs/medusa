import mdx from "@next/mdx"

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  experimental: {
    serverActions: true,
  },
  async rewrites() {
    return {
      afterFiles: [
        {
          source: "/api/store",
          destination: "/store",
        },
        {
          source: "/api/admin",
          destination: "/admin",
        },
      ],
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
