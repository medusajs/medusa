import mdx from "@next/mdx"
import rehypeMdxCodeProps from "rehype-mdx-code-props"
import rehypeSlug from "rehype-slug"
import remarkDirective from "remark-directive"
import remarkFrontmatter from "remark-frontmatter"
import {
  brokenLinkCheckerPlugin,
  localLinksRehypePlugin,
  cloudinaryImgRehypePlugin,
  resolveAdmonitionsPlugin,
  crossProjectLinksPlugin,
} from "remark-rehype-plugins"

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {
    rehypePlugins: [
      // TODO add V2 to path if necessary
      [
        crossProjectLinksPlugin,
        {
          baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
          projectUrls: {
            docs: {
              url:
                process.env.VERCEL_ENV !== "production"
                  ? process.env.NEXT_PUBLIC_DOCS_URL
                  : undefined,
            },
            resources: {
              url:
                process.env.VERCEL_ENV !== "production"
                  ? process.env.NEXT_PUBLIC_RESOURCES_URL
                  : undefined,
              path: "resources",
            },
            ui: {
              url:
                process.env.VERCEL_ENV !== "production"
                  ? process.env.NEXT_PUBLIC_UI_URL
                  : undefined,
              path: "ui",
            },
            api: {
              url:
                process.env.VERCEL_ENV !== "production"
                  ? process.env.NEXT_PUBLIC_API_URL
                  : undefined,
              path: "v2/api",
            },
          },
        },
      ],
      [brokenLinkCheckerPlugin],
      [localLinksRehypePlugin],
      [
        rehypeMdxCodeProps,
        {
          tagName: "code",
        },
      ],
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
    ],
    remarkPlugins: [
      [remarkFrontmatter],
      [remarkDirective],
      [resolveAdmonitionsPlugin],
    ],
    jsx: true,
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],

  transpilePackages: ["docs-ui"],
  // TODO uncomment if we decide on baes path
  // basePath: process.env.NEXT_PUBLIC_BASE_PATH || "/v2/user-guide",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "/user-guide",
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
}

export default withMDX(nextConfig)
