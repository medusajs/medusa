import mdx from "@next/mdx"
import {
  brokenLinkCheckerPlugin,
  localLinksRehypePlugin,
  typeListLinkFixerPlugin,
} from "remark-rehype-plugins"
import { slugChanges } from "./generated/slug-changes.mjs"
import mdxPluginOptions from "./mdx-options.mjs"

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {
    rehypePlugins: [
      ...mdxPluginOptions.options.rehypePlugins,
      [brokenLinkCheckerPlugin],
      [localLinksRehypePlugin],
      [typeListLinkFixerPlugin],
    ],
    remarkPlugins: mdxPluginOptions.options.remarkPlugins,
    jsx: true,
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],

  transpilePackages: ["docs-ui"],

  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "/v2/resources",
  async rewrites() {
    return {
      fallback: [
        {
          source: "/:path*",
          destination: `${
            process.env.NEXT_PUBLIC_DOCS_URL || "https://localhost:3001"
          }/:path*`,
          basePath: false,
        },
      ],
    }
  },
  async redirects() {
    // redirect original file paths to the rewrite
    return slugChanges.map((item) => ({
      source: item.origSlug,
      destination: item.newSlug,
      permanent: true,
    }))
  },
}

export default withMDX(nextConfig)
