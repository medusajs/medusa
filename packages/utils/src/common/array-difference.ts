type ArrayDifferenceElement = string | number

export function arrayDifference<TElement = ArrayDifferenceElement>(
  mainArray: TElement[],
  differingArray: TElement[]
): TElement[] {
  const mainArraySet = new Set(mainArray)
  const differingArraySet = new Set(differingArray)

  const difference = [...mainArraySet].filter(
    (element) => !differingArraySet.has(element)
  )

  return difference
}
