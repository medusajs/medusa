import mdx from "@next/mdx"
import bundleAnalyzer from "@next/bundle-analyzer"
import rehypeMdxCodeProps from "rehype-mdx-code-props"
import rehypeSlug from "rehype-slug"

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "/api",
  webpack: (config) => {
    config.ignoreWarnings = [{ module: /node_modules\/keyv\/src\/index\.js/ }]

    return config
  },
  transpilePackages: ["docs-ui"],
  async redirects() {
    return [
      {
        source: "/api/download/:path",
        destination: "/download/:path",
        permanent: true,
      },
    ]
  },
}

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {
    rehypePlugins: [
      [
        rehypeMdxCodeProps,
        {
          tagName: "code",
        },
      ],
      [rehypeSlug],
    ],
    development: process.env.NODE_ENV === "development",
  },
})

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE_BUNDLE === "true",
})

export default withBundleAnalyzer(withMDX(nextConfig))
