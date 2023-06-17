export function normalizePath(path: string): string {
  const isWindows = process.platform === "win32"
  const separator = isWindows ? "\\" : "/"
  const regex = new RegExp(`\\${separator}`, "g")
  return path.replace(regex, "/")
}
