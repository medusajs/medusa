export function omitDeep<T extends object = object>(
  input: object,
  excludes: Array<number | string>
): T {
  if (!input) {
    return input
  }

  return Object.entries(input).reduce((nextInput, [key, value]) => {
    const shouldExclude = excludes.includes(key)
    if (shouldExclude) {
      return nextInput
    }

    if (Array.isArray(value)) {
      const nextValue = value.map((arrItem) => {
        if (arrItem && typeof arrItem === "object") {
          return omitDeep(arrItem, excludes)
        }
        return arrItem
      })
      nextInput[key] = nextValue
      return nextInput
    } else if (typeof value === "object") {
      nextInput[key] = omitDeep(value, excludes)
      return nextInput
    }

    nextInput[key] = value

    return nextInput
  }, {} as T)
}
