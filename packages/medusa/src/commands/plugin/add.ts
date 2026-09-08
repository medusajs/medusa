import { logger } from "@medusajs/framework/logger"
import { execSync } from "child_process"
import fs from "fs"
import path from "path"
import * as yalc from "yalc"

type PackageManager = "yarn" | "pnpm" | "npm"

const LOCK_FILES: Record<PackageManager, string> = {
  yarn: "yarn.lock",
  pnpm: "pnpm-lock.yaml",
  npm: "package-lock.json",
}

const PACKAGE_MANAGERS = Object.keys(LOCK_FILES) as PackageManager[]

const YALC_PACKAGES_FOLDER = ".yalc"

function readPackageJson(directory: string): Record<string, any> | undefined {
  try {
    return JSON.parse(
      fs.readFileSync(path.join(directory, "package.json"), "utf-8")
    )
  } catch {
    return undefined
  }
}

function exists(...segments: string[]): boolean {
  return fs.existsSync(path.join(...segments))
}

/**
 * Returns every directory from "directory" upwards, stopping at "until" when
 * given and at the filesystem root otherwise. Both ends are inclusive.
 */
function ancestors(directory: string, until?: string): string[] {
  const stopAt = until ? path.resolve(until) : undefined
  const result: string[] = []
  let current = path.resolve(directory)

  // eslint-disable-next-line no-constant-condition
  while (true) {
    result.push(current)
    if (current === stopAt || current === path.parse(current).root) {
      return result
    }
    current = path.dirname(current)
  }
}

/**
 * Strips the version from a "name@version" string, keeping a package scope
 * intact: "pkg@1.0.0", "@scope/pkg@1.0.0", and "yarn@4.5.0" become "pkg",
 * "@scope/pkg", and "yarn".
 */
function stripVersion(specifier: string): string {
  const separator = specifier.lastIndexOf("@")
  return separator > 0 ? specifier.slice(0, separator) : specifier
}

/**
 * Returns the package manager whose lockfile is present in the directory.
 */
function lockFilePackageManager(directory: string): PackageManager | undefined {
  return PACKAGE_MANAGERS.find((pm) => exists(directory, LOCK_FILES[pm]))
}

/**
 * Returns the package manager from the "packageManager" field of the
 * directory's package.json.
 */
function declaredPackageManager(directory: string): PackageManager | undefined {
  const declared = readPackageJson(directory)?.packageManager
  if (typeof declared !== "string") {
    return undefined
  }

  const name = stripVersion(declared) as PackageManager
  return PACKAGE_MANAGERS.includes(name) ? name : undefined
}

/**
 * Whether the directory is the root of a workspace monorepo.
 */
function isWorkspaceRoot(directory: string): boolean {
  return (
    exists(directory, "pnpm-workspace.yaml") ||
    !!readPackageJson(directory)?.workspaces
  )
}

/**
 * Finds the directory the package manager install has to be executed in.
 *
 * For a workspace monorepo (the Medusa app sits in for example "apps/backend")
 * this is the workspace root, since that is the only place where an install
 * resolves the whole workspace and hoists the plugin's dependencies. For a
 * standalone project it is the Medusa application itself.
 */
export function findInstallRoot(directory: string): string {
  for (const dir of ancestors(directory)) {
    if (isWorkspaceRoot(dir) || lockFilePackageManager(dir)) {
      return dir
    }
  }

  return path.resolve(directory)
}

/**
 * Detects the package manager used by the project. A lockfile anywhere between
 * the install root and the application directory wins over a "packageManager"
 * field, so the field is only remembered as a fallback while walking.
 */
export function detectPackageManager(
  directory: string,
  installRoot: string
): PackageManager {
  let fallback: PackageManager | undefined

  for (const dir of new Set([
    path.resolve(installRoot),
    ...ancestors(directory, installRoot),
  ])) {
    const fromLockFile = lockFilePackageManager(dir)
    if (fromLockFile) {
      return fromLockFile
    }

    fallback ??= declaredPackageManager(dir)
  }

  return fallback ?? "npm"
}

function yarnMajorVersion(cwd: string): number {
  try {
    const version = execSync("yarn --version", {
      cwd,
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim()
    return Number.parseInt(version.split(".")[0], 10) || 1
  } catch {
    return 1
  }
}

/**
 * Returns the install command for the given package manager.
 *
 * Note we never let yalc run this for us: yalc's update command for yarn is
 * "yarn upgrade", which is not an install at all in yarn 2+.
 */
function getInstallCommand(
  packageManager: PackageManager,
  cwd: string
): string {
  switch (packageManager) {
    case "pnpm":
      return "pnpm install"
    case "yarn":
      /**
       * The install has to be allowed to write the lockfile, since we just
       * added a new dependency to the manifest. Yarn 2+ refuses to do that
       * when it thinks it runs in CI.
       */
      return yarnMajorVersion(cwd) >= 2
        ? "yarn install --no-immutable"
        : "yarn install"
    default:
      return "npm install"
  }
}

/**
 * yalc always writes the package to "<workingDir>/node_modules/<name>". In a
 * workspace monorepo the package manager places its own copy while linking the
 * workspace, which would leave two copies of the plugin on disk. Two copies
 * means "plugin:develop" can end up refreshing the copy the application does
 * not load, and the app then runs stale code. Removing yalc's copy leaves the
 * package manager as the single owner of the installed plugin.
 */
function removeYalcNodeModulesCopies(
  directory: string,
  pluginNames: string[]
): void {
  for (const pluginName of pluginNames) {
    const name = stripVersion(pluginName)

    if (!exists(directory, YALC_PACKAGES_FOLDER, name)) {
      // The package was not actually added, nothing to clean up.
      continue
    }

    const installedPath = path.join(directory, "node_modules", name)
    if (exists(installedPath)) {
      fs.rmSync(installedPath, { recursive: true, force: true })
    }
  }
}

/**
 * Add the specified plugins to the project from the local packages registry
 */
export default async function localAddPlugin({
  directory,
  plugin_names,
}: {
  directory: string
  plugin_names: string[]
}): Promise<void> {
  const installRoot = findInstallRoot(directory)
  const isMonorepo = installRoot !== path.resolve(directory)
  const packageManager = detectPackageManager(directory, installRoot)

  await yalc.addPackages(plugin_names, {
    workingDir: directory,
    replace: true,
    pure: false,
    update: false,
  })

  if (isMonorepo) {
    removeYalcNodeModulesCopies(directory, plugin_names)
  }

  /**
   * Install so that the plugin's own (non-peer) dependencies are installed and,
   * in a monorepo, the workspace root resolves the newly added dependency.
   */
  const command = getInstallCommand(packageManager, installRoot)
  logger.info(`Running "${command}" in ${installRoot}`)

  try {
    execSync(command, { cwd: installRoot, stdio: "inherit" })
  } catch (error) {
    logger.error(
      `Failed to install dependencies with "${command}". Run it manually in ${installRoot} to finish installing the plugin.`
    )
    throw error
  }
}
