import type { OpenAPI } from "types"
import readSpecDocument from "./read-spec-document"
import dereference from "./dereference"
import { unstable_cache } from "next/cache"
import { oasFileToPath } from "docs-utils"
import { specsTagIndex } from "@/generated/specs-tag-index.mjs"
import { apiRefPaths } from "@/utils/api-ref-paths"
import { getPathForEnv } from "./get-path-for-env"

const HTTP_METHODS = [
  "get",
  "post",
  "put",
  "patch",
  "delete",
  "head",
  "options",
]

async function getPathsOfTag_(
  tagName: string,
  area: "admin" | "store"
): Promise<OpenAPI.Document> {
  const r2Base = process.env.SPECS_R2_BASE_URL
  const areaIndex = (specsTagIndex[area] ?? {}) as Record<string, string[]>
  const files: string[] = areaIndex[tagName] ?? []

  const basePath = getPathForEnv(
    r2Base || process.cwd(),
    "specs",
    area,
    "paths"
  )

  // Precomputed URL path (without basePath) for each operation, keyed by
  // operationId, so the frontend links/scroll-targets match the generated
  // sidebar, sitemap, and redirects.
  const operationPaths = apiRefPaths[area]?.tags?.[tagName]?.operations ?? {}

  const documents: OpenAPI.ParsedPathItemObject[] = await Promise.all(
    files.map(async (file) => {
      const filePath = getPathForEnv(basePath, file)

      const fileContent = (await readSpecDocument(
        filePath
      )) as OpenAPI.OpenAPIV3.PathItemObject<OpenAPI.Operation>

      for (const method of HTTP_METHODS) {
        const operation = fileContent[
          method as OpenAPI.OpenAPIV3.HttpMethods
        ] as OpenAPI.Operation | undefined
        const operationId = operation?.operationId
        if (operation && operationId && operationPaths[operationId]) {
          operation["x-path"] = operationPaths[operationId].path
          operation["x-slug"] = operationPaths[operationId].slug
        }
      }

      return {
        ...fileContent,
        operationPath: oasFileToPath(file),
      }
    })
  )

  return dereference({
    basePath,
    paths: documents,
  })
}

const getPathsOfTag = unstable_cache(
  async (tagName: string, area: "admin" | "store") =>
    getPathsOfTag_(tagName, area),
  ["tag-paths"],
  {
    revalidate: 3600,
  }
)

export default getPathsOfTag
