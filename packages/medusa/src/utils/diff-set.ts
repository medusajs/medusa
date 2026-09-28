export function getSetDifference<T>(
  originalSet: Set<T>,
  compareSet: Set<T>
): Set<T> {
  const difference = new Set<T>()

  originalSet.forEach((element) => {
    if (!compareSet.has(element)) {
      difference.add(element)
    }
  })

  return difference
}
