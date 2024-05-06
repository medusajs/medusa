import { isDefined } from "./is-defined"
import { isObject } from "./is-object"

/**
 * @description
 * This function is used to flatten nested objects and arrays
 *
 * @example
 *
 * ```ts
 * const data = {
 *   root_level_property: "root level",
 *   products: [
 *     {
 *       id: "1",
 *       name: "product 1",
 *       variants: [
 *         { id: "1.1", name: "variant 1.1" },
 *         { id: "1.2", name: "variant 1.2" },
 *       ],
 *     },
 *     {
 *       id: "2",
 *       name: "product 2",
 *       variants: [
 *         { id: "2.1", name: "variant 2.1" },
 *         { id: "2.2", name: "variant 2.2" },
 *       ],
 *     },
 *   ],
 * }
 *
 * const flat = deepFlatMap(
 *   data,
 *   "products.variants",
 *   ({ root_, products, variants }) => {
 *     return {
 *       root_level_property: root_.root_level_property,
 *       product_id: products.id,
 *       product_name: products.name,
 *       variant_id: variants.id,
 *       variant_name: variants.name,
 *     }
 *   }
 * )
 * ```
 */

export function deepFlatMap(
  data: any,
  path: string,
  callback: (context: Record<string, any>) => any
) {
  const ROOT_LEVEL = "root_"
  const keys = path.split(".")
  keys.unshift(ROOT_LEVEL)

  const lastKey = keys[keys.length - 1]
  const stack: {
    element: any
    path: string[]
    context: Record<string, any>
  }[] = [{ element: { [ROOT_LEVEL]: data }, path: keys, context: {} }]

  const results: any[] = []
  while (stack.length > 0) {
    const { element, path, context } = stack.shift()!
    const currentKey = path[0]
    const remainingPath = path.slice(1)

    if (!isDefined(element[currentKey])) {
      callback({ ...context })
      continue
    }

    if (remainingPath.length === 0) {
      if (Array.isArray(element[currentKey])) {
        element[currentKey].forEach((item) => {
          results.push(callback({ ...context, [lastKey]: item }))
        })
      } else if (isObject(element[currentKey])) {
        results.push(callback({ ...context, [lastKey]: element[currentKey] }))
      }
    } else {
      if (Array.isArray(element[currentKey])) {
        if (element[currentKey].length === 0) {
          callback({ ...context })
          continue
        }

        element[currentKey].forEach((item) => {
          stack.push({
            element: item,
            path: remainingPath,
            context: { ...context, [currentKey]: item },
          })
        })
      } else if (isObject(element[currentKey])) {
        stack.push({
          element: element[currentKey],
          path: remainingPath,
          context: { ...context, [currentKey]: element[currentKey] },
        })
      }
    }
  }
  return results
}
