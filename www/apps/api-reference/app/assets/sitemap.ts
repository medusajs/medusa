import { MetadataRoute } from "next"
import OpenAPIParser from "@readme/openapi-parser"
import path from "path"
import type { ExpandedDocument, Operation } from "../../types/openapi"
import getUrl from "../../utils/get-url"
import getSectionId from "../../utils/get-section-id"
import getPathsOfTag from "../../utils/get-paths-of-tag"
import { config } from "../../config"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = config.baseUrl

  const results = [
    {
      url: `${baseUrl}/api/admin`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/api/store`,
      lastModified: new Date(),
    },
  ]

  for (const area of ["store", "admin"]) {
    const baseSpecs = (await OpenAPIParser.parse(
      path.join(process.cwd(), `specs/${area}/openapi.yaml`)
    )) as ExpandedDocument

    await Promise.all(
      baseSpecs.tags?.map(async (tag) => {
        const tagName = getSectionId([tag.name])
        const url = getUrl(area, tagName)
        results.push({
          url,
          lastModified: new Date(),
        })

        const paths = await getPathsOfTag(tagName, area)

        Object.values(paths.paths).forEach((path) => {
          Object.values(path).forEach((op) => {
            const operation = op as Operation
            const operationName = getSectionId([
              tag.name,
              operation.operationId,
            ])
            const url = getUrl(area, operationName)
            results.push({
              url,
              lastModified: new Date(),
            })
          })
        })
      }) || []
    )
  }

  return results
}
