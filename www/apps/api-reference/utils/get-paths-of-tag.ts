import path from "path"
import { promises as fs } from "fs"
import type { OpenAPIV3 } from "openapi-types"
import type { Operation, Document, ParsedPathItemObject } from "@/types/openapi"
import readSpecDocument from "./read-spec-document"
import getSectionId from "./get-section-id"
import dereference from "./dereference"
import { unstable_cache } from "next/cache"

async function getPathsOfTag_(
  tagName: string,
  area: string
): Promise<Document> {
  // get path files
  const basePath = path.join(process.cwd(), "specs", `${area}/paths`)

  const files = await fs.readdir(basePath)

  // read the path documents
  let documents: ParsedPathItemObject[] = await Promise.all(
    files.map(async (file) => {
      const fileContent = (await readSpecDocument(
        path.join(basePath, file)
      )) as OpenAPIV3.PathItemObject<Operation>

      return {
        ...fileContent,
        operationPath: `/${file
          .replaceAll(/(?<!\{[^}]*)_(?![^{]*\})/g, "/")
          .replace(/\.[A-Za-z]+$/, "")}`,
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
