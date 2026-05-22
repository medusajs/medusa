import { addExtraToMd, getCleanMd } from "docs-utils"
import { unstable_cache } from "next/cache"
import {
  addUrlToRelativeLink,
  crossProjectLinksPlugin,
  localLinksRehypePlugin,
} from "remark-rehype-plugins"
import type { Plugin } from "unified"

type Options = {
  removeExtra?: boolean
  content?: string
}

export const getCleanMdCached = unstable_cache(
  async (filePathOrKey: string, options: Options = {}) => {
    const { removeExtra, content } = options
    const md = await getCleanMd({
      file: content ?? filePathOrKey,
      type: content ? "content" : "file",
      plugins: {
        before: [
          [
            crossProjectLinksPlugin,
            {
              baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
              projectUrls: {
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
              },
              useBaseUrl:
                process.env.NODE_ENV === "production" ||
                !!process.env.MC_ENV,
            },
          ],
          [localLinksRehypePlugin],
        ] as unknown as Plugin[],
        after: [
          [addUrlToRelativeLink, { url: process.env.NEXT_PUBLIC_BASE_URL }],
        ] as unknown as Plugin[],
      },
    })
    return removeExtra
      ? md
      : addExtraToMd(md, {
          baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "",
        })
  },
  ["clean-md"],
  {
    revalidate: 3600,
  }
)
