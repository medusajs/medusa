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
