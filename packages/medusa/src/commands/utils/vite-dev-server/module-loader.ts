import { Logger } from "@medusajs/framework/types"
import { setModuleLoader } from "@medusajs/framework/utils"
import { existsSync, statSync } from "fs"
import { createRequire } from "module"
import path from "path"
import { fileURLToPath, pathToFileURL } from "url"

/**
 * Files that keep loading through require() even in Vite mode: the config is
 * read before the dev server exists and instrumentation must patch modules
 * before anything else loads.
 */
const NATIVELY_LOADED = ["medusa-config", "instrumentation"]
const SOURCE_EXTENSIONS = [".ts", ".tsx", ".mts", ".cts", ".js", ".mjs", ".cjs"]

export interface ViteModuleLoader {
  /**
   * Resolve a path the framework asks for (possibly a directory or a path
   * without extension) to the source file Vite should load.
   */
  resolveFile(filePath: string): string
  import(filePath: string): Promise<any>
  /**
   * Invalidate a file and every module that (transitively) imports it, so the
   * next import re-evaluates them. Returns the affected source files.
   */
  invalidate(filePath: string): Set<string>
  /**
   * Source files currently evaluated by the runner.
   */
  evaluatedFiles(): string[]
  close(): Promise<void>
}

/**
 * Vite ships with the admin bundler. Resolve it from there so the backend and
 * the admin dashboard run on the same copy.
 */
async function importVite() {
  const bundlerEntry = require.resolve("@medusajs/admin-bundler")
  const viteEntry = createRequire(bundlerEntry).resolve("vite")
  const nodeDir = path.dirname(viteEntry)
  const [vite, moduleRunner] = await Promise.all([
    import(pathToFileURL(path.join(nodeDir, "index.js")).href),
    import(pathToFileURL(path.join(nodeDir, "module-runner.js")).href),
  ])
  return { vite, moduleRunner }
}

/**
 * Creates a Vite module runner that loads the project's source files, and
 * installs it as the framework's module loader. Dependencies are never
 * evaluated by the runner: they go through require() so there is exactly one
 * instance of each package, shared with everything loaded natively.
 */
export async function createViteModuleLoader({
  directory,
  logger,
  server: sharedServer,
}: {
  directory: string
  logger: Logger
  /**
   * A Vite dev server with an `ssr` environment to run on, e.g. the one
   * serving the admin. When omitted, a standalone server is created.
   */
  server?: any
}): Promise<ViteModuleLoader> {
  const { vite, moduleRunner } = await importVite()
  const projectRequire = createRequire(path.join(directory, "package.json"))

  /**
   * A CommonJS `require` for code evaluated by the runner. Project sources
   * resolve to the runner's own instance (so lazy `require("./model")` in DML
   * relations doesn't load a second copy through ts-node); dependencies load
   * natively.
   */
  const createSourceRequire = (file: string) => {
    const nativeRequire = createRequire(file)
    const sourceRequire = (id: string) => {
      let resolved: string
      try {
        resolved = nativeRequire.resolve(id)
      } catch {
        return nativeRequire(id)
      }
      if (!canLoad(resolved)) {
        return nativeRequire(id)
      }
      const nodes = runner.evaluatedModules.getModulesByFile(resolved)
      const node = nodes && [...nodes].find((n: any) => n.exports)
      if (node) {
        return node.exports
      }
      throw new Error(
        `${path.relative(directory, file)} requires ${path.relative(
          directory,
          resolved
        )} before it has been loaded. Use an import statement instead.`
      )
    }
    return Object.assign(sourceRequire, {
      resolve: nativeRequire.resolve,
      cache: nativeRequire.cache,
    })
  }

  const AsyncFunction = async function () {}.constructor as new (
    ...args: string[]
  ) => (...args: unknown[]) => Promise<void>

  class MedusaModuleEvaluator extends moduleRunner.ESModulesEvaluator {
    /**
     * Same as Vite's evaluator, plus:
     * - the CommonJS globals project code relies on when compiled by tsc
     *   (`require`, `__dirname`, `__filename`), unless the module declares
     *   its own;
     * - a sourceURL so stack-based helpers such as getCallerFilePath (used
     *   to track where workflows are defined) resolve the real file.
     */
    async runInlinedModule(context: any, code: string, module: any) {
      const file: string = module.file
      const cjsGlobals: Record<string, unknown> = {
        require: createSourceRequire(file),
        __dirname: path.dirname(file),
        __filename: file,
      }
      const injected = Object.keys(cjsGlobals).filter(
        (name) =>
          !new RegExp(`\\b(const|let|class|function)\\s+${name}\\b`).test(code)
      )

      const keys = [
        moduleRunner.ssrModuleExportsKey,
        moduleRunner.ssrImportMetaKey,
        moduleRunner.ssrImportKey,
        moduleRunner.ssrDynamicImportKey,
        moduleRunner.ssrExportAllKey,
        moduleRunner.ssrExportNameKey,
      ]
      const fn = new AsyncFunction(
        ...keys,
        ...injected,
        `"use strict";${code}\n//# sourceURL=${file}`
      )
      await fn(
        ...keys.map((key) => context[key]),
        ...injected.map((name) => cjsGlobals[name])
      )
      Object.seal(context[moduleRunner.ssrModuleExportsKey])
    }

    /**
     * Load dependencies with require() and the same default-export interop
     * TypeScript's esModuleInterop applies, so `import x from "pkg"` behaves
     * as it does when the project is compiled with tsc.
     */
    runExternalModule(id: string) {
      const target = id.startsWith("file:") ? fileURLToPath(id) : id
      const exports = projectRequire(target)
      if (
        !exports ||
        exports.__esModule ||
        exports[Symbol.toStringTag] === "Module"
      ) {
        return exports
      }
      return new Proxy(exports, {
        get: (obj, key) => (key === "default" ? exports : obj[key]),
        has: (obj, key) => key === "default" || key in obj,
      })
    }
  }

  const server =
    sharedServer ??
    (await vite.createServer({
    root: directory,
    configFile: false,
    envFile: false,
    logLevel: "warn",
    clearScreen: false,
    appType: "custom",
    server: { middlewareMode: true, hmr: false, ws: false, watch: null },
    environments: {
      ssr: {
        resolve: { external: true },
      },
    },
    optimizeDeps: { noDiscovery: true, include: [] },
  }))

  const environment = server.environments.ssr
  const runner = new moduleRunner.ModuleRunner(
    {
      transport: {
        invoke: (payload: any) => environment.hot.handleInvoke(payload),
      },
      hmr: false,
      sourcemapInterceptor: "prepareStackTrace",
    },
    new MedusaModuleEvaluator()
  )

  const nodeModulesSegment = `${path.sep}node_modules${path.sep}`
  const buildOutput = path.join(directory, ".medusa") + path.sep

  const canLoad = (filePath: string) => {
    if (!path.isAbsolute(filePath) || !filePath.startsWith(directory)) {
      return false
    }
    if (
      filePath.includes(nodeModulesSegment) ||
      filePath.startsWith(buildOutput)
    ) {
      return false
    }
    const base = path.basename(filePath).replace(/\.[^.]+$/, "")
    if (
      NATIVELY_LOADED.includes(base) &&
      path.dirname(filePath) === directory
    ) {
      return false
    }
    const ext = path.extname(filePath)
    return !ext || SOURCE_EXTENSIONS.includes(ext)
  }

  const resolveFile = (filePath: string) => {
    const isFile =
      path.extname(filePath) &&
      existsSync(filePath) &&
      statSync(filePath).isFile()
    return isFile ? filePath : projectRequire.resolve(filePath)
  }

  const loader: ViteModuleLoader = {
    resolveFile,

    import: (filePath: string) => runner.import(resolveFile(filePath)),

    invalidate(filePath: string) {
      environment.moduleGraph.onFileChange(filePath)

      const affected = new Set<string>()
      const queue = [...(runner.evaluatedModules.getModulesByFile(filePath) ?? [])]
      const seen = new Set<any>()
      while (queue.length) {
        const node = queue.pop()
        if (!node || seen.has(node)) {
          continue
        }
        seen.add(node)
        if (node.file) {
          affected.add(node.file)
        }
        for (const importerId of node.importers) {
          const importer = runner.evaluatedModules.getModuleById(importerId)
          if (importer) {
            queue.push(importer)
          }
        }
      }

      // Importers' transforms are still valid; they only need re-evaluating
      for (const node of seen) {
        runner.evaluatedModules.invalidateModule(node)
      }

      return affected
    },

    evaluatedFiles() {
      return [...runner.evaluatedModules.idToModuleMap.values()]
        .filter((node: any) => !node.meta || !("externalize" in node.meta))
        .map((node: any) => node.file)
        .filter(Boolean)
    },

    async close() {
      await runner.close()
      if (!sharedServer) {
        await server.close()
      }
    },
  }

  setModuleLoader({
    canLoad,
    import: loader.import,
  })

  // Exposed for dev tooling and diagnostics
  ;(globalThis as any).__MEDUSA_VITE_RUNNER_MODULES__ = () =>
    loader.evaluatedFiles()

  logger.info(
    `[Vite] Module runner ready (vite ${vite.version}${
      sharedServer ? ", shared with admin" : ""
    })`
  )

  return loader
}
