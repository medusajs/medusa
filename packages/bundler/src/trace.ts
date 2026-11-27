import {
  copyFileSync,
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readlinkSync,
  realpathSync,
  Stats,
  symlinkSync,
} from "fs"
import { createRequire } from "module"
import path from "path"
import { findPackageRoot, nearestPackageDir, readPackageName } from "./packages"
import { BUILD_TOOLING } from "./selection"

/**
 * What bundled code can still load from disk that the bundle doesn't contain:
 * native binaries, files read with fs, targets of requires esbuild can't
 * follow. Traced with @vercel/nft (as Next.js's standalone output is) and
 * copied next to the bundle in the same node_modules layout, symlinks
 * included, so lookups resolve as they would unbundled (see the requires
 * rewritten in `keepIdentity`).
 */
export async function copyTracedFiles({
  entries,
  leftOut,
  bundled,
  addressable,
  outDir,
  nodeModulesRoot,
  directory,
}: {
  entries: string[]
  /** Files the build deliberately keeps out of the bundle */
  leftOut: (file: string) => boolean
  /** Files compiled into the bundle */
  bundled: Set<string>
  /** Bundled files the bundle can load by path at runtime */
  addressable: Set<string>
  outDir: string
  nodeModulesRoot: string
  directory: string
}): Promise<{ files: number; bytes: number }> {
  const { nodeFileTrace } = require("@vercel/nft")
  // Only the project, its packages and linked ones: paths built at runtime
  // (e.g. from os.homedir()) would otherwise pull in unrelated folders
  const roots = new Set([nodeModulesRoot, outDir, directory])
  for (const entry of entries) {
    if (!entry.startsWith(nodeModulesRoot + path.sep)) {
      const root = findPackageRoot(entry)
      if (root) {
        roots.add(root)
      }
    }
  }
  const withinRoots = (file: string) =>
    [...roots].some((root) => file === root || file.startsWith(root + path.sep))
  const { fileList, reasons } = await nodeFileTrace(entries, {
    base: "/",
    processCwd: directory,
    mixedModules: true,
    ignore: (relative: string) => {
      const file = path.join("/", relative)
      return !withinRoots(file) || isBuildToolingPath(file) || leftOut(file)
    },
  })

  // Compiled in, but loadable only if nothing reaches it other than through
  // requires esbuild followed too
  const reachedDynamically = (file: string) =>
    (reasons.get(file)?.type ?? []).some(
      (type: string) => !STATIC_TRACE_REASONS.has(type)
    )

  const candidates: { file: string; stat: Stats }[] = []
  // Packages with something to copy besides their manifest and links: only
  // those get a package.json and links. A package that's fully bundled must
  // leave nothing behind, or lookups would find a package without its code
  // (instead of resolving it from the bundle).
  const withContent = new Set<string>()
  for (const relative of fileList as Set<string>) {
    const file = path.join("/", relative)
    if (
      !file.startsWith(nodeModulesRoot + path.sep) ||
      file.startsWith(outDir + path.sep) ||
      /\.(d\.ts|map)$/.test(file) ||
      addressable.has(file) ||
      (bundled.has(file) && !reachedDynamically(relative))
    ) {
      continue
    }
    const stat = lstatSync(file, { throwIfNoEntry: false })
    if (!stat) {
      continue
    }
    candidates.push({ file, stat })
    if (stat.isFile() && path.basename(file) !== "package.json") {
      const root = nearestPackageDir(file)
      if (root) {
        withContent.add(root)
      }
    }
  }

  const target = path.join(outDir, "node_modules")
  let files = 0
  let bytes = 0
  for (const { file, stat } of candidates) {
    if (stat.isSymbolicLink()) {
      const linked = realpathSync(file)
      if (!withContent.has(nearestPackageDir(path.join(linked, "x")) ?? "")) {
        continue
      }
    } else if (
      path.basename(file) === "package.json" &&
      !withContent.has(path.dirname(file))
    ) {
      continue
    }
    const destination = path.join(target, path.relative(nodeModulesRoot, file))
    if (existsSync(destination)) {
      continue
    }
    mkdirSync(path.dirname(destination), { recursive: true })
    if (stat.isSymbolicLink()) {
      // pnpm's links are relative, and stay valid inside the copied tree
      symlinkSync(readlinkSync(file), destination)
    } else if (stat.isFile()) {
      copyFileSync(file, destination)
      files++
      bytes += stat.size
    }
  }
  return { files, bytes }
}

// Reasons @vercel/nft records for a file reached by a plain require/import
const STATIC_TRACE_REASONS = new Set(["initial", "resolve", "dependency"])

// By the path of the package in node_modules (not its package.json's name, as
// readPackageName gives): the trace skips files without reading anything
function isBuildToolingPath(file: string): boolean {
  const match = file.match(/.*node_modules[\\/]((?:@[^\\/]+[\\/])?[^\\/]+)/)
  return !!match && BUILD_TOOLING.test(match[1].split(path.sep).join("/"))
}

/**
 * Copies packages into `<outDir>/node_modules`, with their dependencies.
 */
export function vendorPackages(roots: Iterable<string>, outDir: string) {
  const target = path.join(outDir, "node_modules")
  const queue = [...roots]
  const copied = new Map<string, string>()
  while (queue.length) {
    const root = realpathSync(queue.pop()!)
    const name = readPackageName(root)
    if (!name || copied.has(name)) {
      continue
    }
    copied.set(name, root)
    mkdirSync(path.dirname(path.join(target, name)), { recursive: true })
    cpSync(root, path.join(target, name), {
      recursive: true,
      dereference: true,
      filter: (src) =>
        !src.slice(root.length).includes(`${path.sep}node_modules`),
    })
    const pkg = JSON.parse(
      readFileSync(path.join(root, "package.json"), "utf8")
    )
    const req = createRequire(path.join(root, "package.json"))
    for (const dependency of Object.keys({
      ...pkg.dependencies,
      ...pkg.optionalDependencies,
    })) {
      try {
        queue.push(path.dirname(req.resolve(`${dependency}/package.json`)))
      } catch {
        try {
          const root = findPackageRoot(req.resolve(dependency))
          if (root) {
            queue.push(root)
          }
        } catch {}
      }
    }
  }
  return [...copied.keys()]
}
