import { isObject } from "./is-object"

/**
 * Converts a structure of find options to an
 * array of string paths
 * @example
 * input: {
 *   test: {
 *     test1: true,
 *     test2: true,
 *     test3: {
 *       test4: true
 *     },
 *   },
 *   test2: true
 * }
 * output: ['test.test1', 'test.test2', 'test.test3.test4', 'test2']
 *
 * @param input
 * @param includeTopLeaf
 */
export function objectToStringPath(
  input: object = {},
  { includeTopLeaf }: { includeTopLeaf: boolean } = { includeTopLeaf: true }
): string[] {
  if (!isObject(input) || !Object.keys(input).length) {
    return []
  }

  const output: Set<string> = includeTopLeaf
    ? new Set(Object.keys(input))
    : new Set()

  for (const key of Object.keys(input)) {
    if (input[key] != undefined && typeof input[key] === "object") {
      const deepRes = objectToStringPath(input[key], { includeTopLeaf })

      const items = deepRes.reduce((acc, val) => {
        acc.push(`${key}.${val}`)
        return acc
      }, [] as string[])

      items.forEach((item) => output.add(item))
      continue
    }

    output.add(key)
  }

  return Array.from(output)
}
