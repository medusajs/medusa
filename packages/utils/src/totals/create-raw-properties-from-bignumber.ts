import { isDefined, trimZeros } from "../common"
import { BigNumber } from "./big-number"

export function createRawPropertiesFromBigNumber(
  obj,
  {
    prefix = "raw_",
    exclude = [],
  }: {
    prefix?: string
    exclude?: string[]
  } = {}
) {
  const stack = [{ current: obj, path: "" }]

  while (stack.length > 0) {
    const { current, path } = stack.pop()!

    if (
      current == null ||
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

        if (value != null && !exclude.includes(currentPath)) {
          const isBigNumber =
            typeof value === "object" &&
            isDefined(value.raw_) &&
            isDefined(value.numeric_)

          if (isBigNumber) {
            const newKey = prefix + key
            const newPath = path ? `${path}.${newKey}` : newKey
            if (!exclude.includes(newPath)) {
              current[newKey] = {
                ...value.raw_,
                value: trimZeros(value.raw_.value),
              }
              continue
            }
          }
        }

        stack.push({ current: value, path: currentPath })
      }
    }
  }
}
