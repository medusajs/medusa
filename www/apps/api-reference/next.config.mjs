import mdx from "@next/mdx"
import bundleAnalyzer from "@next/bundle-analyzer"

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "/v1/api",
  async rewrites() {
    const rewriteFallbacks = [
      {
        source: "/v1",
        destination: `${process.env.NEXT_PUBLIC_DOCS_URL}/v1`,
      },
      {
        source: "/v1/:path*",
        destination: `${process.env.NEXT_PUBLIC_DOCS_URL}/v1`,
      },
      {
        source: "/:path*",
        destination: `${process.env.NEXT_PUBLIC_DOCS_V2_URL}/:path*`,
      },
    ]
    return {
      fallback: rewriteFallbacks,
    }
  },
  webpack: (config) => {
    config.ignoreWarnings = [{ module: /node_modules\/keyv\/src\/index\.js/ }]

    return config
  },
  transpilePackages: ["docs-ui"],
}

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {
    rehypePlugins: [],
    development: process.env.NODE_ENV === "development",
  },
})

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE_BUNDLE === "true",
})

export default withBundleAnalyzer(withMDX(nextConfig))
