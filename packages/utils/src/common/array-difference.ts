type ArrayDifferenceElement = string | number

export function arrayDifference(
  mainArray: ArrayDifferenceElement[],
  differingArray: ArrayDifferenceElement[]
): ArrayDifferenceElement[] {
  const mainArraySet = new Set(mainArray)
  const differingArraySet = new Set(differingArray)

  const difference = [...mainArraySet].filter(
    (element) => !differingArraySet.has(element)
  )

  return difference
}
