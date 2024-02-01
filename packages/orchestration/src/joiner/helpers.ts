import { RemoteJoinerQuery } from "@medusajs/types"

export function toRemoteJoinerQuery(obj: any): RemoteJoinerQuery {
  const remoteJoinerQuery: RemoteJoinerQuery = {
    alias: "",
    fields: [],
    expands: [],
  }

  function extractRecursive(obj, parentName = "", isEntryPoint = true) {
    for (const key in obj) {
      const value = obj[key]

      const canExpand =
        typeof value === "object" &&
        !["fields", "__args", "__directives"].includes(key)

      if (canExpand) {
        const entityName = parentName ? `${parentName}.${key}` : key
        const expandObj: any = {
          property: entityName,
        }

        const reference = isEntryPoint ? remoteJoinerQuery : expandObj

        if (value.__args) {
          reference.args = Object.entries(value.__args).map(
            ([name, value]) => ({
              name,
              value,
            })
          )
        }

        if (value.__directives) {
          reference.directives = Object.entries(value.__directives).map(
            ([name, value]) => ({ name, value })
          )
        }

        reference.fields = value.fields

        if (isEntryPoint) {
          remoteJoinerQuery.alias = key
        } else {
          remoteJoinerQuery.expands!.push(expandObj)
        }

        extractRecursive(value, isEntryPoint ? "" : entityName, false)
      }
    }

    return remoteJoinerQuery
  }

  return extractRecursive(obj)
}
