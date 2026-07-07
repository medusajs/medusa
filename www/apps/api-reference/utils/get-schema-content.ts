import { parseDocument } from "yaml"
import { OpenAPI } from "types"
import dereference from "./dereference"
import { unstable_cache } from "next/cache"
import { workerCompatibleFetch } from "docs-utils"

async function getSchemaContent_(schemaUrl: string, baseSchemasUrl: string) {
  const schemaContent = await workerCompatibleFetch<string>({
    url: schemaUrl,
    responseTransformer: async (res) => {
      if (!res.ok) throw new Error(`Failed to fetch schema: ${schemaUrl} (${res.status})`)
      return await res.text()
    },
    fallbackAction: async () => {
      // In local development, we can read the schema directly from the filesystem
      const { readFileSync, existsSync } = await import("fs")

      if (!existsSync(schemaUrl)) {
        throw new Error(`Schema file not found: ${schemaUrl}`)
      }
      return readFileSync(schemaUrl, "utf-8")
    },
  })
  const schema = parseDocument(schemaContent).toJS() as OpenAPI.SchemaObject

  // resolve references in schema
  const dereferencedDocument = await dereference({
    basePath: baseSchemasUrl,
    schemas: [schema],
  })

  return {
    dereferencedDocument,
    originalSchema: schema,
  }
}

const getSchemaContent = unstable_cache(
  async (schemaUrl: string, baseSchemasUrl: string) =>
    getSchemaContent_(schemaUrl, baseSchemasUrl),
  ["tag-schema"]
)

export default getSchemaContent
