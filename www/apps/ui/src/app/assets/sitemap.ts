import { MetadataRoute } from "next"

import { docsConfig } from "@/config/docs"
import { absoluteUrl } from "@/lib/absolute-url"
import { SidebarItem } from "types"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const items: Array<{
    url: string
    lastModified?: string | Date
  }> = []

  function pushItems(newItems: SidebarItem[]) {
    newItems.forEach((item) => {
      if (item.type !== "link") {
        return
      }

      items.push({
        url: absoluteUrl(item.path),
        lastModified: now,
      })

      if (item.children) {
        pushItems(item.children)
      }
    })
  }

  pushItems(docsConfig.sidebar.default)

  return items
}
