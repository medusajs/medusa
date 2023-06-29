import { isObject } from "./is-object"

/**
 * Converts a structure of find options to an
 * array of string paths
 * @example
 * // With `includeTruePropertiesOnly` default value set to false
 * const result = objectToStringPath({
 *   test: {
 *     test1: true,
 *     test2: true,
 *     test3: {
 *       test4: true
 *     },
 *   },
 *   test2: true
 * })
 * console.log(result)
 * // output: ['test', 'test.test1', 'test.test2', 'test.test3', 'test.test3.test4', 'test2']
 *
 * @example
 * // With `includeTruePropertiesOnly` set to true
 * const result = objectToStringPath({
 *   test: {
 *     test1: true,
 *     test2: true,
 *     test3: {
 *       test4: true
 *     },
 *   },
 *   test2: true
 * }, {
 *   includeTruePropertiesOnly: true
 * })
 * console.log(result)
 * // output: ['test.test1', 'test.test2', 'test.test3.test4', 'test2']
 *
 * @param {InputObject} input
 * @param {boolean} includeParentPropertyFields If set to true (example 1), all properties will be included as well as the parents,
 * otherwise (example 2) all properties path set to true will included, excluded the parents
 */
export function objectToStringPath(
  input: object = {},
  { includeParentPropertyFields }: { includeParentPropertyFields: boolean } = {
    includeParentPropertyFields: true,
  }
): string[] {
  if (!isObject(input) || !Object.keys(input).length) {
    return []
  }

  const output: Set<string> = includeParentPropertyFields
    ? new Set(Object.keys(input))
    : new Set()

  for (const key of Object.keys(input)) {
    if (isObject(input[key])) {
      const deepRes = objectToStringPath(input[key], {
        includeParentPropertyFields,
      })

      const items = deepRes.reduce((acc, val) => {
        acc.push(`${key}.${val}`)
        return acc
      }, [] as string[])

      items.forEach((item) => output.add(item))
      continue
    }

    if (isObject(key) || input[key] === true) {
      output.add(key)
    }
  }

  return Array.from(output)
}
