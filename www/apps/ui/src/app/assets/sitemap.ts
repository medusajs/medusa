import { MetadataRoute } from "next"

import { docsConfig } from "@/config/docs"
import { absoluteUrl } from "@/lib/absolute-url"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const items: Array<{
    url: string
    lastModified?: string | Date
  }> = []

  const createUrl = (path: string) => {
    return absoluteUrl(path)
  }

  docsConfig.sidebar.forEach((item) => {
    if (item.href && !item.disabled) {
      items.push({
        url: createUrl(item.href),
        lastModified: now,
      })
    }

    if (item.items) {
      item.items.forEach((subItem) => {
        if (subItem.href && !subItem.disabled) {
          items.push({
            url: createUrl(subItem.href),
            lastModified: now,
          })
        }
      })
    }
  })

  return items
}
