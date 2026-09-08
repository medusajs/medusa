import { MetadataRoute } from "next"
import getUrl from "../../utils/get-url"
import { apiRefIntroSections, apiRefPaths } from "@/utils/api-ref-paths"

export default function sitemap(): MetadataRoute.Sitemap {
  const results: MetadataRoute.Sitemap = []

  for (const area of ["store", "admin"] as const) {
    results.push({ url: getUrl(`/${area}`), lastModified: new Date() })

    for (const section of apiRefIntroSections[area] ?? []) {
      results.push({
        url: getUrl(`/${area}/${section.slug}`),
        lastModified: new Date(),
      })
    }

    const tags = apiRefPaths[area]?.tags ?? {}
    for (const tag of Object.values(tags)) {
      results.push({ url: getUrl(tag.path), lastModified: new Date() })
      if (tag.schemaPath) {
        results.push({ url: getUrl(tag.schemaPath), lastModified: new Date() })
      }
      for (const operation of Object.values(tag.operations)) {
        results.push({ url: getUrl(operation.path), lastModified: new Date() })
      }
    }
  }

  return results
}
