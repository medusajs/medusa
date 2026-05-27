import path from "path"
import type { OpenAPI } from "types"
import readSpecDocument from "./read-spec-document"
import dereference from "./dereference"
import { unstable_cache } from "next/cache"
import { oasFileToPath } from "docs-utils"
import { specsTagIndex } from "@/generated/specs-tag-index.mjs"
import { getPathForEnv } from "./get-path-for-env"

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

  const documents: OpenAPI.ParsedPathItemObject[] = await Promise.all(
    files.map(async (file) => {
      const filePath = getPathForEnv(basePath, file)

      const fileContent = (await readSpecDocument(
        filePath
      )) as OpenAPI.OpenAPIV3.PathItemObject<OpenAPI.Operation>

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
