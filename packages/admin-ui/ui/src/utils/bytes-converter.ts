const units: [string, number][] = [
  ["B", 1],
  ["Kb", 1000],
  ["Mb", 1000000],
  ["Gb", 1000000000]
]

export function bytesConverter(size: number): string | undefined {
  let result: string | undefined = undefined

  for (const [unit, divider] of units) {
    if (size >= divider) {
      result = `${(size / divider).toFixed(2)} ${unit}`
    }
  }

  return result
}
