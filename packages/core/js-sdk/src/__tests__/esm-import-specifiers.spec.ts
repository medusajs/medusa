import { readdirSync, readFileSync, statSync } from "fs"
import path from "path"

const sourceRoot = path.join(__dirname, "..")

function getSourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const fullPath = path.join(dir, entry)
    const stat = statSync(fullPath)

    if (stat.isDirectory()) {
      if (entry === "__tests__" || entry === "__mocks__") {
        return []
      }

      return getSourceFiles(fullPath)
    }

    return entry.endsWith(".ts") ? [fullPath] : []
  })
}

describe("ESM import specifiers", () => {
  it("uses explicit file extensions for relative source imports", () => {
    const importSpecifier =
      /\b(?:import|export)\s+(?:type\s+)?(?:[^'";]*?\s+from\s+)?["'](\.{1,2}\/[^"']+)["']/g

    const offenders = getSourceFiles(sourceRoot).flatMap((file) => {
      const source = readFileSync(file, "utf8")
      const relativePath = path.relative(sourceRoot, file)

      return [...source.matchAll(importSpecifier)]
        .map((match) => match[1])
        .filter(
          (specifier) =>
            !specifier.endsWith(".js") && !specifier.endsWith(".json")
        )
        .map((specifier) => `${relativePath}: ${specifier}`)
    })

    expect(offenders).toEqual([])
  })
})
