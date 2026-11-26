import { existsSync, readFileSync, realpathSync } from "fs"
import { createRequire } from "module"
import path from "path"

/**
 * Resolves a package the way a file in `@medusajs/medusa`'s dist folder would,
 * whichever node_modules layout the app is installed with.
 */
export function resolveFrom(medusaDist: string, request: string): string {
  return createRequire(path.join(medusaDist, "index.js")).resolve(request)
}

const packageRoots = new Map<string, string | null>()
export function findPackageRoot(file: string): string | null {
  const dir = path.dirname(file)
  if (packageRoots.has(dir)) {
    return packageRoots.get(dir)!
  }
  const root = existsSync(path.join(dir, "package.json"))
    ? dir
    : path.dirname(dir) === dir
      ? null
      : findPackageRoot(dir)
  packageRoots.set(dir, root)
  return root
}

// Asked for every import the build resolves: read each package.json once
const packageNames = new Map<string, string | undefined>()
export function readPackageName(root: string): string | undefined {
  if (packageNames.has(root)) {
    return packageNames.get(root)
  }
  let name: string | undefined
  try {
    name = JSON.parse(
      readFileSync(path.join(root, "package.json"), "utf8")
    ).name
  } catch {}
  packageNames.set(root, name)
  return name
}

/**
 * The name of the package a file belongs to: its closest `package.json`'s.
 */
export function packageNameOf(file: string): string | undefined {
  const root = findPackageRoot(file)
  return root ? readPackageName(root) : undefined
}

/**
 * A module's code directory: its package's `dist`, or the directory itself
 * for modules inside the app.
 */
export function packageDistOf(moduleDir: string) {
  const root = findPackageRoot(path.join(moduleDir, "x"))
  const dist = root && path.join(root, "dist")
  return dist && existsSync(dist) ? dist : moduleDir
}

// The closest directory with a package.json, as a path (not resolved). Unlike
// findPackageRoot, it isn't cached and never looks at the filesystem root.
export function nearestPackageDir(file: string): string | undefined {
  for (let dir = path.dirname(file); path.dirname(dir) !== dir;) {
    if (existsSync(path.join(dir, "package.json"))) {
      return dir
    }
    dir = path.dirname(dir)
  }
  return undefined
}

/**
 * The node_modules directory packages are really installed in: where
 * @medusajs/medusa resolves to (the repository root's in hoisted or pnpm
 * monorepos), falling back to the project's.
 */
export function findNodeModulesRoot(directory: string) {
  const fallback = path.join(directory, "node_modules")
  try {
    const medusa = realpathSync(
      createRequire(path.join(directory, "package.json")).resolve(
        "@medusajs/medusa"
      )
    )
    const marker = `${path.sep}node_modules${path.sep}`
    const at = medusa.indexOf(marker)
    return at === -1 ? fallback : medusa.slice(0, at + marker.length - 1)
  } catch {
    return fallback
  }
}
