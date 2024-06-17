type ArrayIntersectionElement = string | number

export function arrayIntersection<TElement = ArrayIntersectionElement>(
  firstArray: TElement[],
  secondArray: TElement[]
): TElement[] {
  const firstArraySet = new Set(firstArray)
  const res = new Set<TElement>()

  secondArray.forEach((element) => {
    if (firstArraySet.has(element)) {
      res.add(element)
    }
  })

  return Array.from(res)
}
