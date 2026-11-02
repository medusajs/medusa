import { builtinModules } from "module"
import { readdirSync, readFileSync } from "fs"
import { join, relative } from "path"
import ts from "typescript"

const packageRoot = join(__dirname, "..", "..")
const srcRoot = join(packageRoot, "src")

const collectSourceFiles = (dir: string): string[] => {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      return entry.name.startsWith("__") ? [] : collectSourceFiles(fullPath)
    }
    return entry.name.endsWith(".ts") && !entry.name.endsWith(".d.ts")
      ? [fullPath]
      : []
  })
}

const getPackageName = (specifier: string) => {
  const parts = specifier.split("/")
  return specifier.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0]
}

describe("core-flows declared dependencies", () => {
  it("should only require packages declared in dependencies or peerDependencies at runtime", () => {
    const pkg = JSON.parse(
      readFileSync(join(packageRoot, "package.json"), "utf8")
    )
    const declared = new Set([
      ...Object.keys(pkg.dependencies ?? {}),
      ...Object.keys(pkg.peerDependencies ?? {}),
    ])

    const undeclared: string[] = []

    for (const file of collectSourceFiles(srcRoot)) {
      const { outputText } = ts.transpileModule(readFileSync(file, "utf8"), {
        compilerOptions: {
          module: ts.ModuleKind.CommonJS,
          target: ts.ScriptTarget.ES2021,
        },
      })

      for (const [, specifier] of outputText.matchAll(
        /require\("([^"]+)"\)/g
      )) {
        if (specifier.startsWith(".") || specifier.startsWith("node:")) {
          continue
        }
        const name = getPackageName(specifier)
        if (builtinModules.includes(name) || declared.has(name)) {
          continue
        }
        undeclared.push(`${relative(srcRoot, file)} -> ${specifier}`)
      }
    }

    expect(undeclared).toEqual([])
  })
})
