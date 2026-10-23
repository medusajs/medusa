import { builtinModules } from "module"
import * as fs from "fs"
import * as path from "path"

const packageJson = require("../../package.json")
const srcDir = path.join(__dirname, "..")

// Files that are only loaded by this package's own tests.
const testOnlyFiles = new Set(["test-utils.ts"])

function listRuntimeSourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      return entry.name === "__tests__" ? [] : listRuntimeSourceFiles(fullPath)
    }
    if (!entry.name.endsWith(".ts") || testOnlyFiles.has(entry.name)) {
      return []
    }
    return [fullPath]
  })
}

function packageName(specifier: string): string {
  const parts = specifier.split("/")
  return specifier.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0]
}

describe("@medusajs/eslint-plugin dependencies", () => {
  it("declares every package its runtime code imports", () => {
    const declared = new Set([
      ...Object.keys(packageJson.dependencies ?? {}),
      ...Object.keys(packageJson.peerDependencies ?? {}),
    ])
    const valueImport =
      /^import\s+(?!type\b)[^"']*?from\s+["']([^"'.][^"']*)["']|require\(\s*["']([^"'.][^"']*)["']\s*\)/gm

    const undeclared = new Set<string>()
    for (const file of listRuntimeSourceFiles(srcDir)) {
      const source = fs.readFileSync(file, "utf8")
      for (const match of source.matchAll(valueImport)) {
        const name = packageName(match[1] ?? match[2])
        if (!builtinModules.includes(name) && !declared.has(name)) {
          undeclared.add(`${name} (${path.relative(srcDir, file)})`)
        }
      }
    }

    expect([...undeclared]).toEqual([])
  })
})
