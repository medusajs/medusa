export const stringEqualsOrRegexMatch = (
  stringOrRegex: string | RegExp,
  testString: string
) => {
  if (stringOrRegex instanceof RegExp) {
    return stringOrRegex.test(testString)
  }
  return stringOrRegex === testString
}
