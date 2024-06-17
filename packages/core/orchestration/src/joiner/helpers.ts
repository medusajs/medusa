import { RemoteJoinerQuery } from "@medusajs/types"

export function toRemoteJoinerQuery(
  obj: any,
  variables: Record<string, any> = {}
): RemoteJoinerQuery {
  const remoteJoinerQuery: RemoteJoinerQuery = {
    alias: "",
    fields: [],
    expands: [],
  }

  let entryPoint = ""
  function extractRecursive(obj: any, parentName = "", isEntryPoint = true) {
    for (const key of Object.keys(obj ?? {})) {
      const value = obj[key]

      const canExpand =
        typeof value === "object" &&
        !["fields", "__args", "__directives"].includes(key)

      if (!canExpand) {
        continue
      }

      const entityName = parentName ? `${parentName}.${key}` : key
      const variablesPath = !isEntryPoint
        ? `${entryPoint}${parentName ? "." + parentName : parentName}.${key}`
        : key

      if (isEntryPoint) {
        entryPoint = key
      }

      const currentVariables = variables[variablesPath]

      const expandObj: any = {
        property: entityName,
      }

      const reference = isEntryPoint ? remoteJoinerQuery : expandObj

      if (currentVariables) {
        reference.args = Object.entries(currentVariables).map(
          ([name, value]) => ({
            name,
            value,
          })
        )
      }

      if (value.__args) {
        reference.args = [
          ...(reference.__args || []),
          ...Object.entries(value.__args).map(([name, value]) => ({
            name,
            value,
          })),
        ]
      }

      if (value.__directives) {
        reference.directives = Object.entries(value.__directives).map(
          ([name, value]) => ({ name, value })
        )
      }

      if (value.fields) {
        reference.fields = value.fields
      }

      if (isEntryPoint) {
        if (value.isServiceAccess) {
          remoteJoinerQuery.service = key
        } else {
          remoteJoinerQuery.alias = key
        }
      } else {
        remoteJoinerQuery.expands!.push(expandObj)
      }

      extractRecursive(value, isEntryPoint ? "" : entityName, false)
    }

    return remoteJoinerQuery
  }

  return extractRecursive(obj)
}
