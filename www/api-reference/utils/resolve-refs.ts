import readSpecDocument from "./read-spec-document"
import path from "path"
import mergeObjects from "./merge-object"

const max_depth = process.env.REFS_MAX_DEPTH
  ? parseInt(process.env.REFS_MAX_DEPTH)
  : 12

export default async function resolveRefs(
  obj: Record<string, any>,
  basePath: string,
  currentDepth = 1
) {
  return await Promise.all(
    Object.entries(obj).map(async ([key, value]) => {
      if (currentDepth <= max_depth) {
        let contextBasePath = basePath
        if (key === "$ref") {
          const pathName = path.join(basePath, value)
          contextBasePath = pathName.substring(0, pathName.lastIndexOf("/"))
          // resolve reference
          value = await readSpecDocument(path.join(basePath, value))
          key = "0"
        }

        if (typeof value === "object" && value !== null) {
          value = await resolveRefs(value, contextBasePath, currentDepth + 1)
        }
      }

      return mergeObjects([key], [value])
    })
  )
}
