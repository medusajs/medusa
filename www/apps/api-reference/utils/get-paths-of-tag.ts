import path from "path"
import { promises as fs } from "fs"
import type { OpenAPI } from "types"
import readSpecDocument from "./read-spec-document"
import dereference from "./dereference"
import { unstable_cache } from "next/cache"
import { getSectionId, oasFileToPath } from "docs-utils"

async function getPathsOfTag_(
  tagName: string,
  area: string
): Promise<OpenAPI.Document> {
  // get path files
  const basePath = path.join(process.cwd(), "specs", `${area}/paths`)

  const files = await fs.readdir(basePath)

  // read the path documents
  let documents: OpenAPI.ParsedPathItemObject[] = await Promise.all(
    files.map(async (file) => {
      const fileContent = (await readSpecDocument(
        path.join(basePath, file)
      )) as OpenAPI.OpenAPIV3.PathItemObject<OpenAPI.Operation>

      return {
        ...fileContent,
        operationPath: oasFileToPath(file),
      }
    })
  )

  // filter out operations not related to the passed tag
  documents = documents.filter((document) =>
    Object.values(document).some((operation) => {
      if (typeof operation !== "object" || !("tags" in operation)) {
        return false
      }

      return operation.tags?.some((tag) => getSectionId([tag]) === tagName)
    })
  )

  return dereference({
    basePath,
    paths: documents,
  })
}

const getPathsOfTag = unstable_cache(
  async (tagName: string, area: string) => getPathsOfTag_(tagName, area),
  ["tag-paths"],
  {
    revalidate: 3600,
  }
)

export default getPathsOfTag
