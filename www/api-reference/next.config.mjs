import mdx from "@next/mdx"
import rehypeMdxCodeProps from "rehype-mdx-code-props"
import rehypePrism from "@mapbox/rehype-prism"

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/admin",
        permanent: true,
      },
    ]
  },
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
}

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {
    rehypePlugins: [rehypePrism, rehypeMdxCodeProps],
  },
})
export default withMDX(nextConfig)
