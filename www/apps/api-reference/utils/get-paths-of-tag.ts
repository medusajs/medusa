import path from "path"
import { promises as fs } from "fs"
import type { OpenAPIV3 } from "openapi-types"
import type { Operation, Document, Version } from "@/types/openapi"
import readSpecDocument from "./read-spec-document"
import getSectionId from "./get-section-id"
import OpenAPIParser from "@readme/openapi-parser"

type ParsedPathItemObject = OpenAPIV3.PathItemObject<Operation> & {
  operationPath?: string
}

export default async function getPathsOfTag(
  tagName: string,
  area: string,
  version: Version = "1"
): Promise<Document> {
  // get path files
  const basePath = path.join(
    process.cwd(),
    version === "1" ? "specs" : "specs-v2",
    `${area}/paths`
  )

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

  // dereference the references in the paths
  let paths: Document = {
    paths: {},
    // These attributes are only for validation purposes
    openapi: "3.0.0",
    info: {
      title: "Medusa API",
      version: "1.0.0",
    },
  }

  documents.forEach((document) => {
    const documentPath = document.operationPath || ""
    delete document.operationPath
    paths.paths[documentPath] = document
  })

  // resolve references in paths
  paths = (await OpenAPIParser.dereference(`${basePath}/`, paths, {
    parse: {
      text: {
        // This ensures that all files are parsed as expected
        // resolving the error with incorrect new lines for
        // example files having `undefined` extension.
        canParse: /.*/,
      },
    },
  })) as unknown as Document

  return paths
}
