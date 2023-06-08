import readSpecDocument from "./read-spec-document"
import path from "path"
import mergeObjects from "./merge-object"

const max_depth = process.env.REFS_MAX_DEPTH
  ? parseInt(process.env.REFS_MAX_DEPTH)
  : 4

export default async function resolveRefs(
  obj: Record<string, any>,
  basePath: string,
  currentDepth = 1
) {
  return await Promise.all(
    Object.entries(obj).map(async ([key, value]) => {
      let contextBasePath = basePath
      if (key === "$ref" && currentDepth <= max_depth) {
        const pathName = path.join(basePath, value)
        contextBasePath = pathName.substring(0, pathName.lastIndexOf("/"))
        // resolve reference
        value = await readSpecDocument(path.join(basePath, value))
        key = "0"
        currentDepth++
      }

      if (typeof value === "object" && value !== null) {
        value = await resolveRefs(value, contextBasePath, currentDepth)
      }

      return mergeObjects([key], [value])
    })
  )
}
