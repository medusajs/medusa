import path from "path"
import getMonorepoRoot from "./get-monorepo-root.js"

/**
 * Retrieves the base path to the `oas-output` directory.
 */
export function getOasOutputBasePath() {
  return path.join(getMonorepoRoot(), "www", "utils", "generated", "oas-output")
}

/**
 * Retrieves the base path to the `dml-output` directory
 */
export function getDmlOutputBasePath() {
  return path.join(getMonorepoRoot(), "www", "utils", "generated", "dml-output")
}
