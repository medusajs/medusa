export const getCombinations = (options) => {
  if (options.length === 0) {
    return []
  }

  if (options.length === 1) {
    const values = options.shift().values
    if (values.length > 0) {
      return values.map((v) => [v])
    }

    return [""]
  }

  const combinations = []
  const theseValues = options.shift().values

  const lowerCombinations = getCombinations(options)
  for (const v of theseValues) {
    for (const second of lowerCombinations) {
      combinations.push([v, second].flat())
    }
  }

  return combinations
}
