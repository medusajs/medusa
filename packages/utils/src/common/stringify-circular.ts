const isObject = (value: any): value is object =>
  typeof value === "object" &&
  value != null &&
  !(value instanceof Boolean) &&
  !(value instanceof Date) &&
  !(value instanceof Number) &&
  !(value instanceof RegExp) &&
  !(value instanceof String)

const toPointer = (parts: string[]) =>
  "#" +
  parts
    .map((part) => String(part).replace(/~/g, "~0").replace(/\//g, "~1"))
    .join("/")

const decycle = () => {
  const paths = new WeakMap()

  return function replacer(this: any, key: string | symbol, value: any) {
    if (key !== "$ref" && isObject(value)) {
      const seen = paths.has(value)

      if (seen) {
        return { $ref: toPointer(paths.get(value)) }
      } else {
        paths.set(value, [...(paths.get(this) ?? []), key])
      }
    }

    return value
  }
}

export function stringifyCircular(
  object: any,
  space?: string | number
): string {
  return JSON.stringify(object, decycle(), space)
}
