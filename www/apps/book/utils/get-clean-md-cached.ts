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
}

export const getCleanMdCached = unstable_cache(
  async (filePath: string, options: Options = {}) => {
    const { removeExtra } = options
    const md = await getCleanMd({
      file: filePath,
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
                  url: process.env.NEXT_PUBLIC_RESOURCES_URL,
                },
                ui: {
                  url: process.env.NEXT_PUBLIC_RESOURCES_URL,
                },
                api: {
                  url: process.env.NEXT_PUBLIC_RESOURCES_URL,
                },
              },
              useBaseUrl:
                process.env.NODE_ENV === "production" ||
                process.env.VERCEL_ENV === "production",
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
