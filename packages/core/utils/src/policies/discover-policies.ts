import { readdir } from "fs/promises"
import { join, normalize } from "path"
import { dynamicImport, readDirRecursive } from "../common"
import { MedusaPolicySymbol } from "../modules-sdk"

const excludedFiles = ["index.js", "index.ts"]
const excludedExtensions = [".d.ts", ".d.ts.map", ".js.map"]

function isPolicyExport(value: unknown): boolean {
  return !!value && typeof value === "object" && MedusaPolicySymbol in value
}

/**
 * Discover policy definitions from a directory and subdirectories
 */
export async function discoverPoliciesFromDir(
  sourcePath?: string,
  maxDepth: number = 2
): Promise<void> {
  if (!sourcePath) {
    return
  }

  const root = normalize(sourcePath)

  const allEntries = await readDirRecursive(root, {
    ignoreMissing: true,
    maxDepth,
  })

  const policyDirs = allEntries
    .filter((e) => e.isDirectory() && e.name === "policies")
    .map((e) => join((e as any).path as string, e.name))

  if (!policyDirs.length) {
    return
  }

  await Promise.all(
    policyDirs.map(async (scanDir) => {
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

          // Import the file - this will execute definePolicies() calls
          const fileExports = await dynamicImport(join(scanDir, entry.name))

          // Validate that at least one export is a policy
          const values = Object.values(fileExports)
          const hasPolicies = values.some((value) => isPolicyExport(value))

          if (!hasPolicies) {
            console.warn(
              `File ${entry.name} in policies directory does not export any policies`
            )
          }
        })
      )
    })
  )
}
