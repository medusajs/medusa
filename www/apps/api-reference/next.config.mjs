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
import { crossProjectLinksOptions } from "./utils/cross-project-links-options.mjs"

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "/api",
  outputFileTracingRoot: new URL("../../", import.meta.url).pathname,
  outputFileTracingExcludes: {
    "*": ["../**/.open-next/**", "../!(api-reference)/.next/**"],
  },
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
  async rewrites() {
    const markdownAccept = [
      {
        type: "header",
        key: "Accept",
        value: ".*(text/markdown|text/plain).*",
      },
    ]

    return {
      beforeFiles: [
        // Explicit `.md` (and `/index.md`, `/index.html.md`) suffixes for the
        // area index.
        {
          source: "/:area(store|admin).md",
          destination: "/md-content/:area",
        },
        {
          source: "/:area(store|admin)/index.md",
          destination: "/md-content/:area",
        },
        {
          source: "/:area(store|admin)/index.html.md",
          destination: "/md-content/:area",
        },
        // Explicit `.md` suffixes for nested paths (sections, tags, operations,
        // schemas).
        {
          source: "/:area(store|admin)/:rest*/index.html.md",
          destination: "/md-content/:area/:rest*",
        },
        {
          source: "/:area(store|admin)/:rest*/index.md",
          destination: "/md-content/:area/:rest*",
        },
        {
          source: "/:area(store|admin)/:rest*.md",
          destination: "/md-content/:area/:rest*",
        },
        // Content negotiation: serve Markdown for text/markdown | text/plain.
        {
          source: "/:area(store|admin)/:rest*",
          has: markdownAccept,
          destination: "/md-content/:area/:rest*",
        },
        {
          source: "/:area(store|admin)",
          has: markdownAccept,
          destination: "/md-content/:area",
        },
      ],
    }
  },
}

const withMDX = createMDX({
  options: {
    rehypePlugins: [
      [
        brokenLinkCheckerPlugin,
        {
          crossProjects: {
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
      [crossProjectLinksPlugin, crossProjectLinksOptions],
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
