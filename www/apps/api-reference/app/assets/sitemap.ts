import { MetadataRoute } from "next"
import getUrl from "../../utils/get-url"
import { config } from "../../config"
import { specsSitemapData } from "@/generated/specs-sitemap-data.mjs"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = config.baseUrl

  const results: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/api/admin`, lastModified: new Date() },
    { url: `${baseUrl}/api/store`, lastModified: new Date() },
  ]

  for (const area of ["store", "admin"] as const) {
    const tags = specsSitemapData[area] ?? []
    for (const { tagSectionId, operationSectionIds } of tags) {
      results.push({
        url: getUrl(area, tagSectionId),
        lastModified: new Date(),
      })
      for (const opSectionId of operationSectionIds) {
        results.push({
          url: getUrl(area, opSectionId),
          lastModified: new Date(),
        })
      }
    }
  }

  return results
}
