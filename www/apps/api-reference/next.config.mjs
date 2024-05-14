import mdx from "@next/mdx"
import bundleAnalyzer from "@next/bundle-analyzer"

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const rewriteFallbacks = [
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
      }
    ]
    if (process.env.NEXT_PUBLIC_VERSIONING === "true") {
      rewriteFallbacks.push({
        source: "/v2/:path*",
        destination: `${process.env.NEXT_PUBLIC_DOCS_V2_URL}/v2/:path*`,
      })
    }
    return {
      fallback: rewriteFallbacks
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
