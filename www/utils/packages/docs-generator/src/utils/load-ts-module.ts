import { existsSync, readFileSync, statSync } from "fs"
import { dirname, resolve } from "path"
import ts from "typescript"
import { createContext, runInContext } from "vm"

const moduleCache: Map<string, Record<string, unknown>> = new Map()

const MODULE_SUFFIXES = ["", ".ts", ".tsx", ".js", "/index.ts", "/index.js"]

function resolveModulePath(path: string): string | undefined {
  return MODULE_SUFFIXES.map((suffix) => `${path}${suffix}`).find(
    (candidate) => existsSync(candidate) && statSync(candidate).isFile()
  )
}

/**
 * Transpile a TypeScript file and evaluate its exports. Only relative imports are
 * resolved, so this can only be used for files that don't import external packages
 * at runtime, such as an API route's query configurations.
 *
 * @param path - The path of the file to load, with or without its extension.
 * @returns The module's exports.
 */
export default function loadTsModule(path: string): Record<string, unknown> {
  const filePath = resolveModulePath(path)

  if (!filePath) {
    throw new Error(`Couldn't resolve the module at ${path}`)
  }

  const cachedExports = moduleCache.get(filePath)

  if (cachedExports) {
    return cachedExports
  }

  const { outputText } = ts.transpileModule(readFileSync(filePath, "utf-8"), {
    fileName: filePath,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2021,
    },
  })

  const moduleExports: Record<string, unknown> = {}
  // the exports are cached before the module is evaluated so that circular
  // imports resolve to the partially evaluated exports rather than loop.
  moduleCache.set(filePath, moduleExports)

  const context = createContext({
    exports: moduleExports,
    module: { exports: moduleExports },
    require: (importPath: string) => {
      if (!importPath.startsWith(".")) {
        throw new Error(
          `Can't load the external module "${importPath}" imported in ${filePath}`
        )
      }

      return loadTsModule(resolve(dirname(filePath), importPath))
    },
  })

  try {
    runInContext(outputText, context, { filename: filePath })
  } catch (e) {
    moduleCache.delete(filePath)
    throw e
  }

  return moduleExports
}
