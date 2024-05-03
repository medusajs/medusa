import camelCase from "camelcase"

export const reservedWords =
  /^(arguments|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|eval|export|extends|false|finally|for|function|if|implements|import|in|instanceof|interface|let|new|null|package|private|protected|public|return|static|super|switch|this|throw|true|try|typeof|var|void|while|with|yield)$/g

/**
 * Replaces any invalid characters from a parameter name.
 * For example: 'filter.someProperty' becomes 'filterSomeProperty'.
 */
export const getOperationParameterName = (value: string): string => {
  const clean = value
    .replace(/^[^a-zA-Z]+/g, "")
    .replace(/[^\w\-]+/g, "-")
    .trim()
  return camelCase(clean).replace(reservedWords, "_$1")
}
