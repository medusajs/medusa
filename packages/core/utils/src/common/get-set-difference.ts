/**
 * Get the difference between two sets. The difference is the elements that are in the original set but not in the compare set.
 * @param originalSet
 * @param compareSet
 */
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
