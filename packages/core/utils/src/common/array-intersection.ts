type ArrayIntersectionElement = string | number

/** Returns the unique, defined elements that appear in both arrays. */
export function arrayIntersection<TElement = ArrayIntersectionElement>(
  firstArray: TElement[],
  secondArray: TElement[]
): TElement[] {
  const firstArraySet = new Set(firstArray)
  const res = new Set<TElement>()

  secondArray.forEach((element) => {
    if (element === undefined) {
      return
    }

    if (firstArraySet.has(element)) {
      res.add(element)
    }
  })

  return Array.from(res)
}
