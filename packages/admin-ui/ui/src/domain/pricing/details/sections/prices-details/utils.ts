import { Idable } from "../../../../../types/shared"

export const merge = <T extends Idable, U extends Idable>(
  l1: T[] = [],
  l2: U[] = []
) => {
  const normalizedListA = normalize(l1, "id")
  const normalizedListB = normalize(l2, "id")
  const merged = Object.values<T | U>(normalizedListA)
  Object.values(normalizedListB).forEach((element: any) => {
    if (!normalizedListA[element.id]) {
      merged.push(element)
    }
  })
  return merged
}

const normalize = <T extends {}>(arr: T[], key) => {
  return arr.reduce(
    (obj, curr) => ((obj[curr[key]] = { ...curr }), obj),
    {} as T
  )
}
