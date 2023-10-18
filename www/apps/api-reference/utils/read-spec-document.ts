import { promises as fs } from "fs"
import { OpenAPIV3 } from "openapi-types"
import { parseDocument } from "yaml"

export default async function readSpecDocument(filePath: string) {
  const fileContent = await fs.readFile(filePath, "utf-8")
  return parseDocument(fileContent).toJS() as OpenAPIV3.PathItemObject
}
