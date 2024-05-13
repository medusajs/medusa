import mdx from "@next/mdx"
import bundleAnalyzer from "@next/bundle-analyzer"

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "/v2",
  async rewrites() {
    const fallbacks = [
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
    ]

    if (process.env.NEXT_PUBLIC_SHOW_V2) {
      fallbacks.push(
        {
          source: "/v2/resources",
          destination: `${process.env.NEXT_PUBLIC_DOCS_V2_URL}/v2/resources`,
        },
        {
          source: "/v2/resources/:path*",
          destination: `${process.env.NEXT_PUBLIC_DOCS_V2_URL}/v2/resources/:path*`,
        },
        {
          source: "/v2",
          destination: `${process.env.NEXT_PUBLIC_DOCS_V2_URL}/v2`,
        },
        {
          source: "/v2/:path*",
          destination: `${process.env.NEXT_PUBLIC_DOCS_V2_URL}/v2/:path*`,
        }
      )
    }

    return {
      fallback: [
        {
          source: "/:path*",
          destination: `${
            process.env.NEXT_PUBLIC_DOCS_V2_URL || "https://localhost:3001"
          }/:path*`,
        },
      ],
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
