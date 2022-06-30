export function stringifyNullProperties<T extends object>(input: T): T {
  const convertProperties = (obj: T) => {
    const res = {} as T

    Object.keys(obj).reduce((acc: T, key: string) => {
      if (typeof obj[key] === "object") {
        acc[key] = convertProperties(obj[key])
      }

      if (obj[key] === null) {
        acc[key] = "null"
      } else {
        acc[key] = obj[key]
      }

      return acc
    }, res)

    return res
  }

  return convertProperties(input)
}
