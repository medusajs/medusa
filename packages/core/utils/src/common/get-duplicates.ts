// This function is intentionally not generic, as we will likely need a comparator function in that case, which will make it more complex than necessary
// Revisit if there is such use-case in the future
export const getDuplicates = (collection: string[]): string[] => {
  const uniqueElements = new Set<string>()
  const duplicates = new Set<string>()

  collection.forEach((item) => {
    if (uniqueElements.has(item)) {
      duplicates.add(item)
    } else {
      uniqueElements.add(item)
    }
  })

  return Array.from(duplicates)
}
