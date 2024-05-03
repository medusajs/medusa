/**
 * Get the difference between two sets. The difference is the elements that are in the original set but not in the compare set.
 * @param orignalSet
 * @param compareSet
 */
export function getSetDifference<T>(
  orignalSet: Set<T>,
  compareSet: Set<T>
): Set<T> {
  const difference = new Set<T>()

  orignalSet.forEach((element) => {
    if (!compareSet.has(element)) {
      difference.add(element)
    }
  })

  return difference
}
