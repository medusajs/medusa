export function csvNewLineContentFormatter(str: string): string {
  const hasNewLineChar = !!str.match(/[\r\n]/g)
  if (!hasNewLineChar) {
    return str
  }

  let formatterStr = str.replace(/\n/g, "\\n")
  formatterStr = formatterStr.replace(/"/g, '""')
  return `"${formatterStr}"`
}
