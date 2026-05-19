import { OpenAPI } from "types"
import OpenAPIParser from "@readme/openapi-parser"

type Options = {
  basePath: string
  paths?: OpenAPI.ParsedPathItemObject[]
  schemas?: OpenAPI.SchemaObject[]
}

export default async function dereference({
  basePath,
  paths,
  schemas,
}: Options): Promise<OpenAPI.Document> {
  // dereference the references in the paths
  let document: OpenAPI.Document = {
    paths: {},
    // These attributes are only for validation purposes
    openapi: "3.0.0",
    info: {
      title: "Medusa API",
      version: "1.0.0",
    },
    components: {
      schemas: {},
    },
  }

  if (paths) {
    paths.forEach((path) => {
      const documentPath = path.operationPath || ""
      delete path.operationPath
      document.paths[documentPath] = path
    })
  }

  if (schemas) {
    schemas.forEach((schema) => {
      if (!schema["x-schemaName"]) {
        return
      }
      document.components!.schemas![schema["x-schemaName"]] = schema
    })
  }

  // resolve references in paths
  document = (await OpenAPIParser.dereference(`${basePath}/`, document, {
    parse: {
      text: {
        // This ensures that all files are parsed as expected
        // resolving the error with incorrect new lines for
        // example files having `undefined` extension.
        canParse: /.*/,
      },
    },
    dereference: {
      circular: "ignore",
    },
  })) as unknown as OpenAPI.Document

  return document
}
