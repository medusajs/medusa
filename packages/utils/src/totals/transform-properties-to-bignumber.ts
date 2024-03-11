import { BigNumber } from "./big-number"

export function transformPropertiesToBigNumber(
  obj,
  {
    prefix = "raw_",
    include = [],
    exclude = [],
  }: {
    prefix?: string
    include?: string[]
    exclude?: string[]
  } = {}
) {
  const stack = [{ current: obj, path: "" }]

  while (stack.length > 0) {
    const { current, path } = stack.pop()!

    if (
      current === null ||
      typeof current !== "object" ||
      current instanceof BigNumber
    ) {
      continue
    }

    if (Array.isArray(current)) {
      current.forEach((element, index) =>
        stack.push({ current: element, path })
      )
    } else {
      for (const key of Object.keys(current)) {
        const value = current[key]
        const currentPath = path ? `${path}.${key}` : key

        if (
          key.startsWith(prefix) &&
          value != null &&
          key !== prefix &&
          !exclude.includes(currentPath)
        ) {
          const newKey = key.replace(prefix, "")
          current[newKey] = new BigNumber(value)
        } else if (include.includes(currentPath) && value != null) {
          current[key] = new BigNumber(value)
        } else {
          stack.push({ current: value, path: currentPath })
        }
      }
    }
  }
}
