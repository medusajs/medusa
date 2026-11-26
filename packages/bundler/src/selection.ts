import { existsSync, readdirSync, readFileSync } from "fs"
import path from "path"
import { findPackageRoot, readPackageName, resolveFrom } from "./packages"
import { BUNDLE_FILE_NAME, MAIN_FILE_NAME } from "./constants"

// Packages only `medusa build` and `medusa develop` use (bundlers, compilers,
// the linter the build runs). The commands that require them stay in the
// bundle, since they are reachable from the package entry, but never run from
// one.
export const BUILD_TOOLING =
  /^(vite|rollup|esbuild|ts-node|typescript|tailwindcss|postcss|autoprefixer|lightningcss|eslint|jiti|@medusajs\/admin-vite-plugin|@medusajs\/eslint-plugin|@medusajs\/bundler|@vercel\/nft)(\/|$)|^(@vitejs|@rollup|@esbuild|@swc|@tailwindcss|@eslint|@eslint-community|@typescript-eslint)\//

/**
 * Commands that build or scaffold a project. They are reachable from the
 * package entry, so their files stay addressable, but a bundle only ever runs
 * `start` and the `db:migrate` commands: compiled in as a stub, they don't
 * bring their dependencies (the linter, the bundler, project scaffolding).
 */
export function createBuildOnlyCommandMatcher(medusaDist: string) {
  const commands = path.resolve(medusaDist, "commands")
  const files = ["build", "develop", "lint"].map((name) =>
    path.join(commands, name + ".js")
  )
  const dirs = [path.join(commands, "plugin") + path.sep]
  try {
    const cli = findPackageRoot(resolveFrom(medusaDist, "@medusajs/cli"))
    if (cli) {
      dirs.push(path.join(cli, "dist", "commands") + path.sep)
    }
  } catch {
    // Not resolvable from here: nothing of it to stub
  }
  const buildOnly = { files: new Set(files), dirs }
  return function isBuildOnlyCommand(file: string): boolean {
    return (
      buildOnly.files.has(file) ||
      (file.endsWith(".js") &&
        buildOnly.dirs.some((dir) => file.startsWith(dir)))
    )
  }
}
export const BUILD_ONLY_COMMAND_STUB = `"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = function () {
  throw new Error("This command can't run from a bundled build (medusa build --bundle). Run it in the project, with the Medusa CLI.");
};
`

/**
 * The module and provider entry files of `@medusajs/medusa` (its
 * `dist/modules/<name>.js` re-exports) this app has no use for, by file, with
 * the name they are imported by. Each one would bring a whole package and its
 * dependencies into the bundle.
 *
 * Kept: what the collection pass loaded, what the configuration names, and
 * what the framework itself selects by environment (the Redis modules once
 * REDIS_URL is set, their in-memory counterparts without it), since that can
 * differ between the build and the running app.
 */
export function findUnusedModuleEntries({
  medusaDist,
  loaded,
  configured,
}: {
  medusaDist: string
  loaded: string[]
  configured: string[]
}): Record<string, string> {
  const modulesDir = path.resolve(medusaDist, "modules")
  // Named by the framework's own defaults, whatever the environment
  const defaults = new Set<string>()
  try {
    const utilsDist = path.dirname(resolveFrom(medusaDist, "@medusajs/utils"))
    for (const file of [
      path.join(utilsDist, "common", "define-config.js"),
      path.join(utilsDist, "modules-sdk", "definition.js"),
    ]) {
      for (const [, name] of readFileSync(file, "utf8").matchAll(
        /["']@medusajs\/medusa\/([\w-]+)["']/g
      )) {
        defaults.add(name)
      }
    }
  } catch {
    // The defaults can't be read: leave every module in
    return {}
  }
  if (!defaults.size || !existsSync(modulesDir)) {
    return {}
  }
  const used = new Set([...loaded, ...configured])
  const unused: Record<string, string> = {}
  for (const entry of readdirSync(modulesDir)) {
    if (!entry.endsWith(".js")) {
      continue
    }
    const name = entry.slice(0, -3)
    const file = path.join(modulesDir, entry)
    if (
      !defaults.has(name) &&
      !used.has(file) &&
      !used.has("@medusajs/medusa/" + name) &&
      !used.has("@medusajs/" + name)
    ) {
      unused[file] = "@medusajs/medusa/" + name
    }
  }
  return unused
}

// Tests and fixtures first-party packages publish in their dist
export const FIRST_PARTY_TEST_FILE =
  /[\\/]@medusajs[\\/][^\\/]+[\\/].*[\\/](__tests__|__fixtures__|__mocks__|integration-tests)[\\/]/

// `dynamicImport("pkg")` (or `(0, utils_1.dynamicImport)("pkg")` once
// compiled) with a package name, not a relative or absolute path
const DYNAMIC_IMPORT_OF_PACKAGE =
  /dynamicImport\)?\(\s*"((?:@[\w.-]+\/)?[a-z0-9][\w./-]*)"\s*\)/g
// `require.resolve("pkg")` with a package name
const REQUIRE_RESOLVE_OF_PACKAGE =
  /(?<![\w$.])require\.resolve\(\s*"((?:@[\w.-]+\/)?[a-z0-9][\w./-]*)"\s*\)/g

/**
 * The packages a compiled file loads (`dynamicImport`) or resolves
 * (`require.resolve`) by a literal name. Neither is an import the bundler
 * follows, so each is resolved at build time and answered from the bundle.
 */
export function packagesResolvedByName(source: string): string[] {
  return [
    ...source.matchAll(DYNAMIC_IMPORT_OF_PACKAGE),
    ...source.matchAll(REQUIRE_RESOLVE_OF_PACKAGE),
  ].map(([, request]) => request)
}

/**
 * Whether a file belongs in the bundle's registry: loadable code or JSON,
 * minus build tooling, the files in `bundleDir` (the collection pass, which
 * only `medusa build` runs), the module entries left out of the bundle and
 * JSON nothing can require.
 */
export function createRegistrable({
  unusedModules,
  bundleDir,
}: {
  unusedModules: Record<string, string>
  /** The folder (with a trailing separator) holding the collection pass */
  bundleDir: string
}) {
  return (file: string) => {
    if (!/\.(c|m)?js$|\.json$/.test(file) || file.endsWith(".d.ts")) {
      return false
    }
    // Build tooling the collection pass happened to load isn't needed to run
    const root = findPackageRoot(file)
    const name = root ? readPackageName(root) : undefined
    if (name && BUILD_TOOLING.test(name)) {
      return false
    }
    // The bundler itself (this folder), which only `medusa build` runs
    if (file.startsWith(bundleDir)) {
      return false
    }
    if (file in unusedModules) {
      return false
    }
    // Scanned folders can hold JSON with comments (e.g. tsconfig.json),
    // which nothing can require
    if (file.endsWith(".json") && !isRequirableJson(file)) {
      return false
    }
    return true
  }
}

const SKIP_DIR =
  /[\\/](node_modules|__tests__|__fixtures__|__mocks__|integration-tests|public)([\\/]|$)/
// A plugin's admin extensions (src/admin in its build output): browser code
// that is compiled into the admin build, and never loaded by the server
const ADMIN_EXTENSIONS =
  /(^|[\\/]\.medusa[\\/]server)[\\/]src[\\/]admin([\\/]|$)/

/**
 * Calls `add` with every file under `dir` that isn't tests, fixtures, the
 * bundle itself or a plugin's admin extensions.
 */
export function scanDirectory(dir: string, add: (file: string) => void) {
  for (const file of readdirSync(dir, { recursive: true } as any)) {
    const absolute = path.join(dir, String(file))
    if (
      !SKIP_DIR.test(absolute.slice(dir.length)) &&
      !ADMIN_EXTENSIONS.test(absolute.slice(dir.length)) &&
      ![BUNDLE_FILE_NAME, MAIN_FILE_NAME].includes(path.basename(absolute))
    ) {
      add(absolute)
    }
  }
}

/**
 * Adds a resolution for each specifier the bundled @medusajs packages export
 * (`exports` subpaths, wildcards expanded against the bundled files) that
 * isn't resolved yet.
 */
export function addPackageExportResolutions(
  bundledFiles: Set<string>,
  resolutions: Record<string, string>
) {
  const roots = new Set<string>()
  for (const file of bundledFiles) {
    const root = findPackageRoot(file)
    if (root && readPackageName(root)?.startsWith("@medusajs/")) {
      roots.add(root)
    }
  }
  for (const root of roots) {
    const pkg = JSON.parse(
      readFileSync(path.join(root, "package.json"), "utf8")
    )
    const exportsMap =
      typeof pkg.exports === "string"
        ? { ".": pkg.exports }
        : (pkg.exports ?? {})
    const filesInRoot = [...bundledFiles].filter((file) =>
      file.startsWith(root + path.sep)
    )
    for (const [subpath, value] of Object.entries<any>(exportsMap)) {
      const target =
        typeof value === "string"
          ? value
          : (value?.require ?? value?.node ?? value?.default)
      if (typeof target !== "string" || !subpath.startsWith(".")) {
        continue
      }
      const request = pkg.name + subpath.slice(1)
      if (!subpath.includes("*")) {
        const file = path.resolve(root, target)
        if (bundledFiles.has(file)) {
          resolutions[request] ??= file
        }
        continue
      }
      // Patterns map one wildcard onto one wildcard; anything else (e.g. a
      // pattern pointing at a single file) isn't expanded
      const targetParts = path.resolve(root, target).split("*")
      const requestParts = request.split("*")
      if (targetParts.length !== 2 || requestParts.length !== 2) {
        continue
      }
      const [targetPrefix, targetSuffix] = targetParts
      const [requestPrefix, requestSuffix] = requestParts
      for (const file of filesInRoot) {
        if (
          file.length > targetPrefix.length + targetSuffix.length &&
          file.startsWith(targetPrefix) &&
          file.endsWith(targetSuffix)
        ) {
          const match = file
            .slice(targetPrefix.length, file.length - targetSuffix.length)
            .split(path.sep)
            .join("/")
          resolutions[requestPrefix + match + requestSuffix] ??= file
        }
      }
    }
  }
}

function isRequirableJson(file: string): boolean {
  try {
    JSON.parse(readFileSync(file, "utf8"))
    return true
  } catch {
    return false
  }
}
