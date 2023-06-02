import mdx from "@next/mdx"
import rehypeMdxCodeProps from "rehype-mdx-code-props"
import rehypePrism from "@mapbox/rehype-prism"

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    mdxRs: true,
    serverActions: true,
  },
}

const withMDX = mdx({
  options: {
    remarkPlugins: [rehypeMdxCodeProps],
    rehypePlugins: [rehypePrism],
    providerImportSource: "@mdx-js/react",
  },
})
export default withMDX(nextConfig)
