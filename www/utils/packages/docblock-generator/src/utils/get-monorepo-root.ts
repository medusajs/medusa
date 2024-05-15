import path from "path"
import dirname from "./dirname.js"

/**
 * Retrieves the monorepo root either from the `MONOREPO_ROOT_PATH` environment
 * variable, or inferring it from the path.
 *
 * @returns {string} The absolute path to the monorepository.
 */
export default function getMonorepoRoot() {
  return (
    process.env.MONOREPO_ROOT_PATH ||
    path.join(dirname(import.meta.url), "..", "..", "..", "..", "..", "..")
  )
}
