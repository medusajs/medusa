import path from "path"
import dirname from "./dirname.js"

/**
 * Retrieves the monorepo root either from the `MONOREPO_ROOT_PATH` environment
 * variable, or by inferring it from the current file path.
 */
export default function getMonorepoRoot(): string {
  return (
    process.env.MONOREPO_ROOT_PATH ||
    path.join(dirname(import.meta.url), "..", "..", "..", "..", "..", "..")
  )
}
