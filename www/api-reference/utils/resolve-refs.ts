import readSpecDocument from "./read-spec-document"
import path from "path"
import mergeObjects from "./merge-object"

export default async function resolveRefs(
  obj: Record<string, any>,
  basePath: string
) {
  return await Promise.all(
    Object.entries(obj).map(async ([key, value]) => {
      if (key === "$ref") {
        // resolve reference
        value = await readSpecDocument(path.join(basePath, value))
      } else if (typeof value === "object" && value !== null) {
        value = await resolveRefs(value, basePath)
      }

      return mergeObjects([key], [value])
    })
  )
}
