import { FlagSettings } from "@zjedene-medusa/types"
import { readdir } from "fs/promises"
import { join, normalize } from "path"
import { dynamicImport, isString, readDirRecursive } from "../common"

const excludedFiles = ["index.js", "index.ts"]
const excludedExtensions = [".d.ts", ".d.ts.map", ".js.map"]

function isFeatureFlag(flag: unknown): flag is FlagSettings {
  const f = flag as any
  return !!f && isString(f.key) && isString(f.env_key)
}

/**
 * Discover feature flag definitions from a directory and subdirectories
 */
export async function discoverFeatureFlagsFromDir(
  sourcePath?: string,
  maxDepth: number = 2
): Promise<FlagSettings[]> {
  if (!sourcePath) {
    return []
  }

  const root = normalize(sourcePath)
  const discovered: FlagSettings[] = []

  const allEntries = await readDirRecursive(root, {
    ignoreMissing: true,
    maxDepth,
  })

  const featureFlagDirs = allEntries
    .filter((e) => e.isDirectory() && e.name === "feature-flags")
    .map((e) => join((e as any).path as string, e.name))

  if (!featureFlagDirs.length) {
    return discovered
  }

  await Promise.all(
    featureFlagDirs.map(async (scanDir) => {
      const entries = await readdir(scanDir, { withFileTypes: true })
      await Promise.all(
        entries.map(async (entry) => {
          if (entry.isDirectory()) {
            return
          }

          if (
            excludedExtensions.some((ext) => entry.name.endsWith(ext)) ||
            excludedFiles.includes(entry.name)
          ) {
            return
          }

          const fileExports = await dynamicImport(join(scanDir, entry.name))
          const values = Object.values(fileExports)
          for (const value of values) {
            if (isFeatureFlag(value)) {
              discovered.push(value)
            }
          }
        })
      )
    })
  )

  return discovered
}
