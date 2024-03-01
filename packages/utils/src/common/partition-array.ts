export const partitionArray = <T>(
  input: T[],
  predicate: (T) => boolean
): [T[], T[]] => {
  return input.reduce(
    ([pos, neg], currentElement) => {
      if (predicate(currentElement)) {
        pos.push(currentElement)
      } else {
        neg.push(currentElement)
      }

      return [pos, neg]
    },
    [[], []] as [T[], T[]]
  )
}
