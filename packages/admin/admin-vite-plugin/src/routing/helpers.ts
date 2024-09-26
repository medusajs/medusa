import { convertToImportPath } from "../utils"

export function getRoute(file: string): string {
  const importPath = convertToImportPath(file)
  return importPath
    .replace(/.*\/admin\/(routes)/, "")
    .replace(/\[([^\]]+)\]/g, ":$1")
    .replace(/\/page\.(tsx|jsx)/, "")
}
