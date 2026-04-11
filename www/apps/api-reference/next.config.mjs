import createMDX from "@next/mdx"
import bundleAnalyzer from "@next/bundle-analyzer"
import rehypeMdxCodeProps from "rehype-mdx-code-props"
import rehypeSlug from "rehype-slug"
import {
  brokenLinkCheckerPlugin,
  crossProjectLinksPlugin,
  validateHighlightsPlugin,
} from "remark-rehype-plugins"
import path from "path"
import { catchBadRedirects } from "build-scripts"

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "/api",
  webpack: (config) => {
    config.ignoreWarnings = [{ module: /node_modules\/keyv\/src\/index\.js/ }]

    return config
  },
  transpilePackages: ["docs-ui", "docs-utils"],
  experimental: {
    optimizePackageImports: ["docs-utils"],
  },
  async redirects() {
    return catchBadRedirects([
      {
        source: "/api/download/:path",
        destination: "/download/:path",
        permanent: true,
      },
    ])
  },
}

const withMDX = createMDX({
  options: {
    rehypePlugins: [
      [
        brokenLinkCheckerPlugin,
        {
          crossProjects: {
            bloom: {
              projectPath: path.resolve("..", "bloom"),
            },
            docs: {
              projectPath: path.resolve("..", "book"),
            },
            resources: {
              projectPath: path.resolve("..", "resources"),
              hasGeneratedSlugs: true,
            },
            ui: {
              projectPath: path.resolve("..", "ui"),
            },
            "user-guide": {
              projectPath: path.resolve("..", "user-guide"),
            },
            cloud: {
              projectPath: path.resolve("..", "cloud"),
            },
          },
        },
      ],
      [
        crossProjectLinksPlugin,
        {
          baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
          projectUrls: {
            docs: {
              url: process.env.NEXT_PUBLIC_DOCS_URL,
              path: "",
            },
            bloom: {
              url: process.env.NEXT_PUBLIC_BLOOM_URL,
            },
            resources: {
              url: process.env.NEXT_PUBLIC_RESOURCES_URL,
            },
            "user-guide": {
              url: process.env.NEXT_PUBLIC_USER_GUIDE_URL,
            },
            ui: {
              url: process.env.NEXT_PUBLIC_UI_URL,
            },
            cloud: {
              url: process.env.NEXT_PUBLIC_CLOUD_URL,
            },
          },
          useBaseUrl:
            process.env.NODE_ENV === "production" ||
            process.env.VERCEL_ENV === "production",
        },
      ],
      [
        rehypeMdxCodeProps,
        {
          tagName: "code",
        },
      ],
      [validateHighlightsPlugin, { verbose: false }],
      [rehypeSlug],
    ],
    development: process.env.NODE_ENV === "development",
  },
})

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE_BUNDLE === "true",
})

export default withMDX(withBundleAnalyzer(nextConfig))
