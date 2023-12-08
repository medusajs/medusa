export function getHTMLChar(str: string) {
  return str
    .replace(/</g, "&#60;")
    .replace(/{/g, "&#123;")
    .replace(/}/g, "&#125;")
    .replace(/>/g, "&#62;")
}

export function escapeChars(str: string, escapeBackticks = true) {
  const result = getHTMLChar(str).replace(/_/g, "\\_").replace(/\|/g, "\\|")
  return escapeBackticks ? result.replace(/`/g, "\\`") : result
}
