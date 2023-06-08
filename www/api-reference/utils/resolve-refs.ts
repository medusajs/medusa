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
  const keysCount = Object.keys(obj).length
  let refValue: any = null
  let resultObj = await Promise.all(
    Object.entries(obj).map(async ([key, value]) => {
      let contextBasePath = basePath
      if (key === "$ref" && currentDepth <= max_depth) {
        const originalValue = value
        const pathName = path.join(basePath, value)
        contextBasePath = pathName.substring(0, pathName.lastIndexOf("/"))
        // resolve reference
        value = (await readSpecDocument(path.join(basePath, value))) as Record<string, any>
        if (keysCount > 1) {
          // override existing values in the ref with the sibling keys
          Object.keys(obj).forEach((objKey) => {
            if (objKey !== key || obj[key] !== originalValue) {
              value[objKey] = obj[objKey]
            }
          })
          refValue = value
          return
        }
        key = "0"
        currentDepth++
      }

      if (typeof value === "object" && value !== null) {
        value = await resolveRefs(value, contextBasePath, currentDepth)
      }

      return mergeObjects([key], [value])
    })
  )

  return refValue ? refValue : resultObj
}
