import { OPERATOR_MAP } from "./query-builder"

/**
 * Flatten object keys
 * @example
 * input: {
 *   a: 1,
 *   b: {
 *     c: 2,
 *     d: 3,
 *   },
 *   e: 4,
 * }
 *
 * output: {
 *   a: 1,
 *   b.c: 2,
 *   b.d: 3,
 *   e: 4,
 * }
 *
 * @param where
 */
export function flattenObjectKeys(where: Record<string, any>) {
  const result: Record<string, any> = {}

  function flatten(obj: Record<string, any>, path?: string) {
    for (const key in obj) {
      const isOperatorMap = !!OPERATOR_MAP[key]

      if (!isOperatorMap) {
        const newPath = path ? `${path}.${key}` : key

        if (obj[key] === null) {
          result[newPath] = null
          continue
        }

        if (Array.isArray(obj[key])) {
          result[newPath] = obj[key]
          continue
        }

        if (typeof obj[key] === "object" && !isOperatorMap) {
          flatten(obj[key], newPath)
          continue
        }

        result[newPath] = obj[key]
        continue
      }

      result[path ?? key] = obj
    }
  }

  flatten(where)
  return result
}
