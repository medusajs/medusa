import fse from "fs-extra"
import path from "path"
import { SHARED_DEPENDENCIES } from "../constants"

/**
 * Discovers extensions that should be externalized.
 * @returns array of dependencies to externalize
 */
export async function getExternalDependencies() {
  const external = [...SHARED_DEPENDENCIES]

  // Validate that the project has a package.json
  const hasPackageJson = await fse.pathExists(
    path.join(process.cwd(), "package.json")
  )

  if (!hasPackageJson) {
    return external
  }

  // Get the package.json of the project
  const pkg = await fse.readJSON(path.join(process.cwd(), "package.json"))

  if (!pkg) {
    return external
  }

  // Get the dependencies of the project
  const dependencies = Object.keys(pkg.dependencies || {})

  // Get the peer dependencies of the project
  const peerDependencies = Object.keys(pkg.peerDependencies || {})

  return [...external, ...dependencies, ...peerDependencies]
}
