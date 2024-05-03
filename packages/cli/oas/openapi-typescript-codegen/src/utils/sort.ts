export const sort = (a: string, b: string): number => {
  const nameA = a.toLowerCase()
  const nameB = b.toLowerCase()
  return nameA.localeCompare(nameB, "en")
}
