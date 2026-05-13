import { OpenAPI } from "types"
import { parseDocument } from "yaml"
import { workerCompatibleFetch } from "docs-utils"

export default async function readSpecDocument(filePath: string) {
  const fileContent = await workerCompatibleFetch<string>({
    url: filePath,
    responseTransformer: async (res) => {
      if (!res.ok) throw new Error(`Failed to fetch spec: ${filePath} (${res.status})`)
      return await res.text()
    },
    fallbackAction: async () => {
      // In local development, we can read the spec directly from the filesystem
      const { readFileSync, existsSync } = await import("fs")

      if (!existsSync(filePath)) {
        throw new Error(`Spec file not found: ${filePath}`)
      }
      return readFileSync(filePath, "utf-8")
    },
  })
  return parseDocument(fileContent).toJS() as OpenAPI.OpenAPIV3.PathItemObject
}
