const newLineRegexp = new RegExp(/\n/g)
const doubleQuoteRegexp = new RegExp(/"/g)

export function csvNewLineContentFormatter(str: string): string {
  const hasNewLineChar = !!str.match(newLineRegexp)
  if (!hasNewLineChar) {
    return str
  }

  const formatterStr = str
    .replace(newLineRegexp, "\\n")
    .replace(doubleQuoteRegexp, '""')

  return `"${formatterStr}"`
}
