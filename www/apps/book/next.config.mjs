import mdx from "@next/mdx"
import rehypeMdxCodeProps from "rehype-mdx-code-props"
import rehypeSlug from "rehype-slug"
import {
  brokenLinkCheckerPlugin,
  localLinksRehypePlugin,
  cloudinaryImgRehypePlugin,
  pageNumberRehypePlugin,
  crossProjectLinksPlugin,
  recmaInjectMdxDataPlugin,
  remarkAttachFrontmatterDataPlugin,
  validateHighlightsPlugin,
} from "remark-rehype-plugins"
import path from "path"
import redirects from "./utils/redirects.mjs"
import { generatedSidebars } from "./generated/sidebar.mjs"
import { catchBadRedirects } from "build-scripts"
import remarkFrontmatter from "remark-frontmatter"
import withExtractedTableOfContents from "@stefanprobst/rehype-extract-toc"

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {
    rehypePlugins: [
      [
        brokenLinkCheckerPlugin,
        {
          crossProjects: {
            bloom: {
              projectPath: path.resolve("..", "bloom"),
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
            api: {
              projectPath: path.resolve("..", "api-reference"),
              skipSlugValidation: true,
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
            api: {
              url: process.env.NEXT_PUBLIC_API_URL,
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
      [localLinksRehypePlugin],
      [
        rehypeMdxCodeProps,
        {
          tagName: "code",
        },
      ],
      [validateHighlightsPlugin, { verbose: false }],
      [rehypeSlug],
      [
        cloudinaryImgRehypePlugin,
        {
          cloudinaryConfig: {
            cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
            flags: ["fl_lossy", "f_auto"],
            resize: {
              action: "pad",
              aspectRatio: "16:9",
            },
            roundCorners: 16,
          },
        },
      ],
      [
        pageNumberRehypePlugin,
        {
          sidebar: generatedSidebars[0].items,
        },
      ],
      [withExtractedTableOfContents],
    ],
    remarkPlugins: [[remarkFrontmatter], [remarkAttachFrontmatterDataPlugin]],
    recmaPlugins: [[recmaInjectMdxDataPlugin]],
    jsx: true,
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],

  transpilePackages: ["docs-ui"],
  async rewrites() {
    return {
      beforeFiles: [
        {
          source:
            "/:path((?!resources|api|ui|user-guide|cloud).*)index.html.md",
          destination: "/md-content/:path*",
        },
        {
          source: "/:path((?!resources|api|ui|user-guide|cloud).*)*",
          has: [
            {
              type: "header",
              key: "Accept",
              value: ".*(text/markdown|text/plain).*",
            },
          ],
          destination: "/md-content/:path*",
        },
      ],
      fallback: [
        {
          source: "/resources",
          destination: `${
            process.env.NEXT_PUBLIC_RESOURCES_URL || "https://localhost:3001"
          }/resources`,
          basePath: false,
        },
        {
          source: "/resources/:path*",
          destination: `${
            process.env.NEXT_PUBLIC_RESOURCES_URL || "https://localhost:3001"
          }/resources/:path*`,
          basePath: false,
        },
        {
          source: "/api",
          destination: `${
            process.env.NEXT_PUBLIC_API_URL || "https://localhost:3001"
          }/api`,
          basePath: false,
        },
        {
          source: "/api/:path*",
          destination: `${
            process.env.NEXT_PUBLIC_API_URL || "https://localhost:3001"
          }/api/:path*`,
          basePath: false,
        },
        {
          source: "/ui",
          destination: `${
            process.env.NEXT_PUBLIC_UI_URL || "https://localhost:3001"
          }/ui`,
          basePath: false,
        },
        {
          source: "/ui/:path*",
          destination: `${
            process.env.NEXT_PUBLIC_UI_URL || "https://localhost:3001"
          }/ui/:path*`,
          basePath: false,
        },
        {
          source: "/v1",
          destination: `${
            process.env.NEXT_PUBLIC_DOCS_V1_URL || "https://localhost:3001"
          }/v1`,
          basePath: false,
        },
        {
          source: "/v1/:path*",
          destination: `${
            process.env.NEXT_PUBLIC_DOCS_V1_URL || "https://localhost:3001"
          }/v1/:path*`,
          basePath: false,
        },
        {
          source: "/user-guide",
          destination: `${process.env.NEXT_PUBLIC_USER_GUIDE_URL || "https://localhost:3001"}/user-guide`,
          basePath: false,
        },
        {
          source: "/user-guide/:path*",
          destination: `${process.env.NEXT_PUBLIC_USER_GUIDE_URL || "https://localhost:3001"}/user-guide/:path*`,
          basePath: false,
        },
        {
          source: "/cloud",
          destination: `${process.env.NEXT_PUBLIC_CLOUD_URL || "https://localhost:3001"}/cloud`,
          basePath: false,
        },
        {
          source: "/cloud/:path*",
          destination: `${process.env.NEXT_PUBLIC_CLOUD_URL || "https://localhost:3001"}/cloud/:path*`,
          basePath: false,
        },
        {
          source: "/mcp",
          destination:
            process.env.NEXT_MCP_SERVER_URL || "https://localhost:3001/mcp",
          basePath: false,
        },
      ],
    }
  },
  redirects: async () => {
    const result = await redirects()

    return catchBadRedirects(result)
  },
  outputFileTracingIncludes: {
    "/md\\-content/\\[\\.\\.\\.slug\\]": ["./app/**/*.mdx"],
  },
  outputFileTracingExcludes: {
    "*": ["node_modules/@medusajs/icons"],
  },
  experimental: {
    optimizePackageImports: ["@medusajs/icons", "@medusajs/ui"],
  },
}

export default withMDX(nextConfig)
