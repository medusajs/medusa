import { discoverPoliciesFromDir } from "@medusajs/utils"
import { normalize } from "path"

/**
 * Load RBAC policies from a directory
 * @param sourcePath - Path to scan for policies directories
 */
export async function policiesLoader(sourcePath?: string): Promise<void> {
  if (!sourcePath) {
    return
  }

  const policyDir = normalize(sourcePath)

  await discoverPoliciesFromDir(policyDir)
}
