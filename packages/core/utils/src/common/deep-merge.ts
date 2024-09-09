import { isObject } from "./is-object"

export function deepMerge(target: any, source: any) {
  const recursive = (a, b) => {
    if (!isObject(a)) {
      return b
    }
    if (!isObject(b)) {
      return a
    }

    Object.keys(b).forEach((key) => {
      if (isObject(b[key])) {
        a[key] ??= {}
        a[key] = deepMerge(a[key], b[key])
      } else {
        a[key] = b[key]
      }
    })

    return a
  }

  const copy = { ...target }
  return recursive(copy, source)
}
