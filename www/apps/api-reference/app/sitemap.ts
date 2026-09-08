import type { MetadataRoute } from "next"
import getUrl from "../utils/get-url"
import { apiRefIntroSections, apiRefPaths } from "@/utils/api-ref-paths"

export default function sitemap(): MetadataRoute.Sitemap {
  const items: MetadataRoute.Sitemap = []

  for (const area of ["store", "admin"] as const) {
    // area introduction page
    items.push({
      url: getUrl(`/${area}`),
      lastModified: new Date(),
      changeFrequency: "weekly",
    })

    // intro-section pages
    for (const section of apiRefIntroSections[area] ?? []) {
      items.push({
        url: getUrl(`/${area}/${section.slug}`),
        lastModified: new Date(),
        changeFrequency: "weekly",
      })
    }

    // tag, schema, and operation pages
    const tags = apiRefPaths[area]?.tags ?? {}
    for (const tag of Object.values(tags)) {
      items.push({
        url: getUrl(tag.path),
        lastModified: new Date(),
        changeFrequency: "weekly",
      })
      if (tag.schemaPath) {
        items.push({
          url: getUrl(tag.schemaPath),
          lastModified: new Date(),
          changeFrequency: "weekly",
        })
      }
      for (const operation of Object.values(tag.operations)) {
        items.push({
          url: getUrl(operation.path),
          lastModified: new Date(),
          changeFrequency: "weekly",
        })
      }
    }
  }

  return items
}
