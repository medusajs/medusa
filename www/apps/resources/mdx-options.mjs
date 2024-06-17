import rehypeMdxCodeProps from "rehype-mdx-code-props"
import rehypeSlug from "rehype-slug"
import {
  cloudinaryImgRehypePlugin,
  resolveAdmonitionsPlugin,
  crossProjectLinksPlugin,
} from "remark-rehype-plugins"
import remarkFrontmatter from "remark-frontmatter"
import remarkDirective from "remark-directive"

/** @type {import("@next/mdx").NextMDXOptions} */
const mdxPluginOptions = {
  options: {
    rehypePlugins: [
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
              path: "v2",
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
              path: "v2/api",
            },
          },
        },
      ],
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
  },
}

export default mdxPluginOptions
