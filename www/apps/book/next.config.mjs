import mdx from "@next/mdx"
import rehypeMdxCodeProps from "rehype-mdx-code-props"
import rehypeSlug from "rehype-slug"
import {
  brokenLinkCheckerPlugin,
  localLinksRehypePlugin,
  cloudinaryImgRehypePlugin,
  pageNumberRehypePlugin,
  crossProjectLinksPlugin,
} from "remark-rehype-plugins"
import { sidebar } from "./sidebar.mjs"

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {
    rehypePlugins: [
      [
        crossProjectLinksPlugin,
        {
          baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
          projectUrls: {
            resources: {
              url:
                process.env.VERCEL_ENV !== "production"
                  ? process.env.NEXT_PUBLIC_RESOURCES_URL
                  : undefined,
              path: "v2/resources",
            },
            "user-guide": {
              url:
                process.env.VERCEL_ENV !== "production"
                  ? process.env.NEXT_PUBLIC_USER_GUIDE_URL
                  : undefined,
              path: "v2/user-guide",
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
              path: "api",
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
      [
        pageNumberRehypePlugin,
        {
          sidebar: sidebar,
        },
      ],
    ],
    jsx: true,
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],

  transpilePackages: ["docs-ui"],
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "/v2",
  async rewrites() {
    return {
      fallback: [
        {
          source: "/v2/resources",
          destination: `${process.env.NEXT_PUBLIC_DOCS_V2_URL}/v2/resources`,
          basePath: false,
        },
        {
          source: "/v2/resources/:path*",
          destination: `${process.env.NEXT_PUBLIC_DOCS_V2_URL}/v2/resources/:path*`,
          basePath: false,
        },
        // TODO comment out once we have the user guide published
        // {
        //   source: "/user-guide",
        //   destination: `${process.env.NEXT_PUBLIC_USER_GUIDE_URL}/user-guide`,
        //   basePath: false,
        // },
        // {
        //   source: "/user-guide/:path*",
        //   destination: `${process.env.NEXT_PUBLIC_USER_GUIDE_URL}/user-guide/:path*`,
        //   basePath: false,
        // },
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
