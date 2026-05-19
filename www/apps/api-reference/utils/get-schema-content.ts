import { promises as fs } from "fs"
import { parseDocument } from "yaml"
import { OpenAPI } from "types"
import dereference from "./dereference"
import { unstable_cache } from "next/cache"

async function getSchemaContent_(schemaPath: string, baseSchemasPath: string) {
  const schemaContent = await fs.readFile(schemaPath, "utf-8")
  const schema = parseDocument(schemaContent).toJS() as OpenAPI.SchemaObject

  // resolve references in schema
  const dereferencedDocument = await dereference({
    basePath: baseSchemasPath,
    schemas: [schema],
  })

  return {
    dereferencedDocument,
    originalSchema: schema,
  }
}

const getSchemaContent = unstable_cache(
  async (schemaPath: string, baseSchemasPath: string) =>
    getSchemaContent_(schemaPath, baseSchemasPath),
  ["tag-schema"]
)

export default getSchemaContent
