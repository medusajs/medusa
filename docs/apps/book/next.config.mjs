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
      // TODO add V2 to path if necessary
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
              path: "resources",
            },
            "user-guide": {
              url:
                process.env.VERCEL_ENV !== "production"
                  ? process.env.NEXT_PUBLIC_USER_GUIDE_URL
                  : undefined,
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
  // TODO uncomment if we decide on baes path
  // basePath: process.env.NEXT_PUBLIC_BASE_PATH || "/v2",
  async rewrites() {
    return {
      fallback: [
        {
          source: "/resources",
          destination: `${process.env.NEXT_PUBLIC_RESOURCES_URL}/resources`,
        },
        {
          source: "/resources/:path*",
          destination: `${process.env.NEXT_PUBLIC_RESOURCES_URL}/resources/:path*`,
        },
        // TODO comment out once we have the user guide published
        // {
        //   source: "/user-guide",
        //   destination: `${process.env.NEXT_PUBLIC_USER_GUIDE_URL}/user-guide`,
        // },
        // {
        //   source: "/user-guide/:path*",
        //   destination: `${process.env.NEXT_PUBLIC_USER_GUIDE_URL}/user-guide/:path*`,
        // },
      ],
    }
  },
}

export default withMDX(nextConfig)
