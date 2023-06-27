import { isObject } from "./is-object"

type InputObject = { [key: string]: true | InputObject }

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
 * @param {boolean} includeTruePropertiesOnly If set to true (example 2), only the properties set to true will be included,
 * otherwise (example 1) all properties will be included in the output which includes
 * the properties that are object and contains properties set to true
 */
export function objectToStringPath(
  input: InputObject = {},
  { includeTruePropertiesOnly }: { includeTruePropertiesOnly: boolean } = {
    includeTruePropertiesOnly: false,
  }
): string[] {
  if (!isObject(input) || !Object.keys(input).length) {
    return []
  }

  const output: Set<string> = includeTruePropertiesOnly
    ? new Set(Object.keys(input))
    : new Set()

  for (const key of Object.keys(input)) {
    if (isObject(input[key])) {
      const deepRes = objectToStringPath(input[key] as InputObject, {
        includeTruePropertiesOnly,
      })

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
