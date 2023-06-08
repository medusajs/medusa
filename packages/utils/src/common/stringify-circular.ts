const isObject = (value: any): value is object =>
  typeof value === "object" &&
  value != null &&
  !(value instanceof Boolean) &&
  !(value instanceof Date) &&
  !(value instanceof Number) &&
  !(value instanceof RegExp) &&
  !(value instanceof String)

function decycle(object: any, replacer?: Function) {
  const objects = new WeakMap()

  function deepCopy(value, path) {
    let oldPath
    let newObj

    if (replacer !== undefined) {
      value = replacer(value)
    }

    if (isObject(value)) {
      oldPath = objects.get(value)
      if (oldPath !== undefined) {
        return { $ref: oldPath }
      }

      objects.set(value, path)

      if (Array.isArray(value)) {
        newObj = []
        value.forEach((el, idx) => {
          newObj[idx] = deepCopy(el, path + "[" + idx + "]")
        })
      } else {
        newObj = {}
        Object.keys(value).forEach((name) => {
          newObj[name] = deepCopy(
            value[name],
            path + "[" + JSON.stringify(name) + "]"
          )
        })
      }
      return newObj
    }

    return value
  }

  return deepCopy(object, "$")
}

export function stringifyCircular(object: any, replacer?: Function): string {
  return decycle(object, replacer)
}
