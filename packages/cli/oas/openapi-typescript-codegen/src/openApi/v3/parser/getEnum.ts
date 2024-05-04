import type { Enum } from "../../../client/interfaces/Enum"

export const getEnum = (values?: (string | number)[]): Enum[] => {
  if (Array.isArray(values)) {
    return values
      .filter((value, index, arr) => {
        return arr.indexOf(value) === index
      })
      .filter((value: any) => {
        return typeof value === "number" || typeof value === "string"
      })
      .map((value) => {
        if (typeof value === "number") {
          return {
            name: `'_${value}'`,
            value: String(value),
            type: "number",
            description: null,
          }
        }
        return {
          name: String(value)
            .replace(/\W+/g, "_")
            .replace(/^(\d+)/g, "_$1")
            .replace(/([a-z])([A-Z]+)/g, "$1_$2")
            .toUpperCase(),
          value: `'${value.replace(/'/g, "\\'")}'`,
          type: "string",
          description: null,
        }
      })
  }
  return []
}
