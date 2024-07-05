export function getOsShortcut() {
  const isMacOs =
    typeof navigator !== "undefined"
      ? navigator.userAgent.toLowerCase().indexOf("mac") !== 0
      : true

  return isMacOs ? "⌘" : "Ctrl"
}
