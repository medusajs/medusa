import { readdirSync, readFileSync } from "fs"
import { readFile } from "fs/promises"
import Module, { createRequire } from "module"
import path from "path"
import { EXTERNAL_PREFIX } from "./constants"
import { findPackageRoot, packageNameOf, readPackageName } from "./packages"
import { BUILD_ONLY_COMMAND_STUB, BUILD_TOOLING } from "./selection"

const LAZY_HELPER = `var __lazyReq = (load) => { let m; const get = () => (m ??= load()); return new Proxy({}, { get: (_, k) => get()[k], has: (_, k) => k in get(), ownKeys: () => Reflect.ownKeys(get()), getOwnPropertyDescriptor: (_, k) => { const d = Reflect.getOwnPropertyDescriptor(get(), k); if (d) d.configurable = true; return d; }, set: (_, k, v) => { get()[k] = v; return true; } }); };`
const LAZY_REQUIRE =
  /^(const|var|let) ([A-Za-z_$][\w$]*) = (__importDefault\(|__importStar\()?require\("([^"]+)"\)\)?;$/gm
const NEVER_LAZY =
  /^(@sentry\/|@opentelemetry\/|@medusajs\/framework$|@medusajs\/framework\/(utils|types)$|reflect-metadata|dotenv|source-map-support)/
const STAR = /^__exportStar\(require\("([^"]+)"\), exports\);$/
const NAMESPACE =
  /^exports\.([A-Za-z_$][\w$]*) = __importStar\(require\("([^"]+)"\)\);$/
const VOID = /^(exports\.[A-Za-z_$][\w$]* = )+void 0;$/
// `require(x)` whose argument isn't a single string literal, and
// `require.resolve(`, as calls (not `.require(` or `typeof require`)
const COMPUTED_REQUIRE =
  /(?<![\w$.])require\s*\((?!\s*(["'])[^"'\\\n]*\1\s*\))/g
const REQUIRE_RESOLVE = /(?<![\w$.])require\.resolve\s*\(/g
// A file declaring its own `require` (a parameter or variable)
const SHADOWED_REQUIRE =
  /function\s*[\w$]*\s*\([^)]*\brequire\b[^)]*\)|\b(?:var|let|const)\s+require\b|\(\s*require\s*(?:,[^)]*)?\)\s*=>/
export const SIDE_EFFECT = /^global(This)?\.[A-Za-z_]+ *(\?\?=|=)/m
// A call made at the top level (compiled TypeScript puts top-level statements
// at column 0), other than the module plumbing TypeScript emits: e.g.
// `OrderChangeProcessing.registerActionType(...)`
const TOP_LEVEL_CALL =
  /^(?!Object\.defineProperty\(exports|exports\.|module\.exports|__exportStar\(|__setModuleDefault\(|__createBinding\(|__decorate\(|__metadata\()(?:\(0, )?[A-Za-z_$][\w$]*(?:\.[\w$]+)*\)?\s*\(/m
const ES_MODULE_MARKER =
  'Object.defineProperty(exports, "__esModule", { value: true });'

export function createTransforms({
  outDir,
  entryFile,
  toKey,
  isBuildOnlyCommand,
}: {
  outDir: string
  entryFile: string
  toKey: (file: string) => string
  /** Commands compiled in as a stub (see createBuildOnlyCommandMatcher) */
  isBuildOnlyCommand: (file: string) => boolean
}) {
  const appPrefix = outDir + path.sep
  const isApp = (file: string) =>
    file.startsWith(appPrefix) &&
    !file.includes(`${path.sep}node_modules${path.sep}`)
  const isFirstParty = (file: string) =>
    isApp(file) || !!packageNameOf(file)?.startsWith("@medusajs/")

  const sideEffects = new Map<string, boolean>()
  const hasSideEffects = (file: string): boolean => {
    if (sideEffects.has(file)) {
      return sideEffects.get(file)!
    }
    sideEffects.set(file, false)
    const src = readFileSync(file, "utf8")
    let result = SIDE_EFFECT.test(src) || TOP_LEVEL_CALL.test(src)
    if (!result) {
      const req = createRequire(file)
      for (const match of src.matchAll(new RegExp(STAR.source, "gm"))) {
        try {
          if (hasSideEffects(req.resolve(match[1]))) {
            result = true
            break
          }
        } catch {}
      }
    }
    sideEffects.set(file, result)
    return result
  }

  /**
   * Re-export files (`export * from`, `export * as x from`) become getters
   * requiring each child on first access. Export names are read here, at
   * build time. Children with global side effects still load eagerly.
   */
  const lazyBarrel = (file: string, src: string) => {
    if (!packageNameOf(file)?.startsWith("@medusajs/")) {
      return
    }
    const at = src.indexOf(ES_MODULE_MARKER)
    if (at === -1) {
      return
    }
    const lines = src
      .slice(at + ES_MODULE_MARKER.length)
      .replace(/\/\/# sourceMappingURL=.*$/m, "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
    if (
      !lines.length ||
      !lines.every((l) => STAR.test(l) || NAMESPACE.test(l) || VOID.test(l)) ||
      !lines.some((l) => STAR.test(l) || NAMESPACE.test(l))
    ) {
      return
    }
    const req = createRequire(file)
    const out = [
      src.slice(0, at + ES_MODULE_MARKER.length),
      "var __has = Object.prototype.hasOwnProperty;",
      "var __d = (k, l) => { if (!__has.call(exports, k)) Object.defineProperty(exports, k, { enumerable: true, configurable: true, get: () => l()[k] }); };",
    ]
    lines.forEach((line, i) => {
      let match: RegExpMatchArray | null
      if ((match = line.match(STAR))) {
        const spec = match[1]
        out.push(
          `var __m${i}; var __l${i} = () => __m${i} ??= require(${JSON.stringify(
            spec
          )});`
        )
        for (const key of Object.keys(req(spec))) {
          if (key !== "default" && key !== "__esModule") {
            out.push(`__d(${JSON.stringify(key)}, __l${i});`)
          }
        }
        if (hasSideEffects(req.resolve(spec))) {
          out.push(`__l${i}();`)
        }
      } else if ((match = line.match(NAMESPACE))) {
        const [, name, spec] = match
        out.push(
          `var __n${i}; Object.defineProperty(exports, ${JSON.stringify(
            name
          )}, { enumerable: true, configurable: true, get: () => __n${i} ??= __importStar(require(${JSON.stringify(
            spec
          )})) });`
        )
        if (hasSideEffects(req.resolve(spec))) {
          out.push(`exports.${name};`)
        }
      }
    })
    return out.join("\n")
  }

  /**
   * In first-party code, top-level `const x = require("...")` becomes a proxy
   * requiring on first access: imports only used later (in functions) no
   * longer evaluate at boot.
   */
  const lazyRequires = (file: string, src: string) => {
    if (
      !isFirstParty(file) ||
      file === path.join(outDir, "instrumentation.js")
    ) {
      return src
    }
    let count = 0
    const out = src.replace(LAZY_REQUIRE, (line, kind, name, wrap, spec) => {
      if (
        Module.isBuiltin(spec) ||
        NEVER_LAZY.test(spec) ||
        // The proxy only stands in for property access: a module that's
        // called, constructed or passed around stays as it is
        !usedOnlyThroughMembers(name, src.replace(line, ""))
      ) {
        return line
      }
      count++
      const load = wrap
        ? `${wrap}require(${JSON.stringify(spec)}))`
        : `require(${JSON.stringify(spec)})`
      return `${kind} ${name} = __lazyReq(() => ${load});`
    })
    return count ? LAZY_HELPER + "\n" + out : src
  }

  /**
   * Keep each module's identity: its own __filename/__dirname (resolved for
   * where the bundle runs), the file it's evaluating as for stack-based
   * helpers, and explicit paths for defineFileConfig.
   */
  const keepIdentity = (file: string, src: string) => {
    if (/\b(const|let|var)\s+(__dirname|__filename)\b/.test(src)) {
      return src
    }
    // Requires esbuild can't follow (computed ones, require.resolve) resolve
    // from the file's own location, as they would unbundled. Not in files
    // that bring their own `require` (e.g. browserify-style bundles).
    const ownRequire = SHADOWED_REQUIRE.test(src)
    const header =
      `var __filename = globalThis.__medusaKeyToPath(${JSON.stringify(
        toKey(file)
      )});` +
      ` var __dirname = require("path").dirname(__filename);` +
      (ownRequire
        ? ""
        : ` var __medusaReq = globalThis.__medusaRequireFrom(__filename);`) +
      ` (globalThis.__MEDUSA_FILE_STACK__ ??= []).push(__filename);\n`
    const footer = `\n;globalThis.__MEDUSA_FILE_STACK__.pop();\n`
    if (!ownRequire) {
      src = src
        .replace(COMPUTED_REQUIRE, "__medusaReq(")
        .replace(REQUIRE_RESOLVE, "__medusaReq.resolve(")
    }
    const strict = src.match(/^\s*(["']use strict["'];?)/)
    let out = strict
      ? src.slice(0, strict[0].length) +
        "\n" +
        header +
        src.slice(strict[0].length)
      : header + src
    out = out.replace(
      /(defineFileConfig\)?\s*\(\s*\{)/g,
      "$1 path: __filename,"
    )
    if (file.endsWith(`${path.sep}get-caller-file-path.js`)) {
      const rewritten = out.replace(
        /function getCallerFilePath\(position = 2\) \{/,
        "$& const __stack = globalThis.__MEDUSA_FILE_STACK__; if (position === 2 && __stack && __stack.length) { return __stack[__stack.length - 1]; }"
      )
      // Without this rewrite, files that define workflows or file configs
      // would resolve their own path wrongly in the bundle: fail the build
      // rather than ship that
      if (rewritten === out && packageNameOf(file) === "@medusajs/utils") {
        throw new Error(
          `Unable to bundle the backend: "function getCallerFilePath(position = 2) {" was not found in ${file}. The bundler rewrites it to resolve callers from the bundle; update createTransforms in transforms.ts to match the compiled output.`
        )
      }
      out = rewritten
    }
    return out + footer
  }

  const nativePackages = new Map<string, boolean>()
  const hasNativeAddon = (dir: string): boolean => {
    if (nativePackages.has(dir)) {
      return nativePackages.get(dir)!
    }
    let found = false
    try {
      // The package's own files only, not its nested dependencies
      found = readdirSync(dir, { recursive: true } as any).some(
        (f: any) =>
          String(f).endsWith(".node") && !String(f).includes("node_modules")
      )
    } catch {}
    nativePackages.set(dir, found)
    return found
  }
  // The build resolves many of the same imports: each is resolved by esbuild
  // once
  const resolved = new Map<string, Promise<any>>()
  const transformSource = async (file: string) => {
    if (isBuildOnlyCommand(file)) {
      return BUILD_ONLY_COMMAND_STUB
    }
    // A shebang means nothing inside a bundle
    let src = (await readFile(file, "utf8")).replace(/^#![^\n]*\n/, "\n")
    src = lazyBarrel(file, src) ?? src
    src = lazyRequires(file, src)
    return keepIdentity(file, src)
  }

  const vendorRoots = new Set<string>()

  return {
    vendorRoots,
    /**
     * Resolves imports for the build: what can't be bundled (native addons,
     * build tooling, files that aren't code) stays external.
     */
    externals: () => ({
      name: "medusa-externals",
      setup(build: any) {
        build.onResolve({ filter: /.*/ }, async (args: any) => {
          if (args.pluginData?.skip || args.kind === "entry-point") {
            return
          }
          if (args.path.endsWith(".node")) {
            return { path: args.path, external: true }
          }
          const cacheKey = `${args.kind}\0${args.resolveDir}\0${args.path}`
          let resolving = resolved.get(cacheKey)
          if (!resolving) {
            resolving = build.resolve(args.path, {
              kind: args.kind,
              resolveDir: args.resolveDir,
              importer: args.importer,
              pluginData: { skip: true },
            }) as Promise<any>
            resolved.set(cacheKey, resolving)
          }
          const result = await resolving
          // Not installed at build time (optional dependencies, unused
          // drivers): leave the require as is
          if (result.errors.length) {
            return { path: args.path, external: true }
          }
          // Files that aren't code (e.g. a package requiring an .html file)
          // can't be compiled in: left as runtime requires, of the traced
          // files copied next to the bundle
          if (!/\.(c|m)?(js|ts)x?$|\.json$|\.node$/.test(result.path)) {
            return { path: args.path, external: true }
          }
          // Build tooling (Vite and friends) is only used by the admin's dev
          // server and build, never when serving: left out entirely
          if (BUILD_TOOLING.test(args.path)) {
            return { path: args.path, external: true }
          }
          // Packages shipping native addons can't be bundled: they're copied
          // next to the bundle and loaded from there, by package name
          const root = findPackageRoot(result.path)
          const packageName = root ? readPackageName(root) : undefined
          if (packageName && BUILD_TOOLING.test(packageName)) {
            return { path: args.path, external: true }
          }
          if (root && !isApp(result.path) && hasNativeAddon(root)) {
            const name = packageName
            if (name) {
              vendorRoots.add(root)
              return {
                path: `${EXTERNAL_PREFIX}nm:${name}/${path
                  .relative(root, result.path)
                  .split(path.sep)
                  .join("/")}`,
                external: true,
              }
            }
          }
          return result
        })
      },
    }),
    sources: {
      name: "medusa-sources",
      setup(build: any) {
        build.onLoad({ filter: /\.(c|m)?js$/ }, async (args: any) => {
          if (args.path === entryFile) {
            return
          }
          return {
            contents: await transformSource(args.path),
            loader: "js",
            resolveDir: path.dirname(args.path),
          }
        })
      },
    },
  }
}

/**
 * Whether every use of a binding is a property access (`x.y`, `x?.y`,
 * `x[y]`), so a lazy proxy for it behaves exactly like the value. Matches in
 * strings or comments only make this stricter.
 */
export function usedOnlyThroughMembers(name: string, src: string): boolean {
  const escaped = name.replace(/\$/g, "\\$")
  for (const match of src.matchAll(
    new RegExp(`(?<![\\w$.])${escaped}(?![\\w$])`, "g")
  )) {
    const after = src.slice(match.index! + name.length).trimStart()
    if (!/^(\?\.(?!\()|\.|\[)/.test(after)) {
      return false
    }
  }
  return true
}
