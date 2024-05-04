import { MetadataRoute } from "next"

import { docsConfig } from "@/config/docs"
import { absoluteUrl } from "@/lib/absolute-url"
import { SidebarItemType } from "types"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const items: Array<{
    url: string
    lastModified?: string | Date
  }> = []

  function pushItems(newItems: SidebarItemType[]) {
    newItems.forEach((item) => {
      if (item.path) {
        items.push({
          url: absoluteUrl(item.path),
          lastModified: now,
        })
      }

      if (item.children) {
        pushItems(item.children)
      }
    })
  }

  pushItems(docsConfig.sidebar.top)
  pushItems(docsConfig.sidebar.bottom)

  return items
}
