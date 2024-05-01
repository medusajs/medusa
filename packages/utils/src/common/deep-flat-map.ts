import { isDefined } from "./is-defined"
import { isObject } from "./is-object"

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
