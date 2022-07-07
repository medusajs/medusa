export function removeUndefinedProperties<T extends object>(inputObj: T): T {
  const removeProperties = (obj: T) => {
    const res = {} as T

    Object.keys(obj).reduce((acc: T, key: string) => {
      if (obj[key] !== undefined) {
        acc[key] = (obj[key] !== null && typeof obj[key] === "object")
          ? removeProperties(obj[key])
          : obj[key]
      }

      return acc
    }, res)

    return res
  }

  return removeProperties(inputObj)
}
