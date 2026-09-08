import { isAbsolute } from "path"

/**
 * Resolves a module identifier relative to the Medusa project directory
 * instead of relative to the directory `@medusajs/utils` itself happens to
 * be installed in.
 *
 * @param id - a bare specifier, subpath specifier, or absolute path
 * @param projectDir - the root directory of the Medusa application
 * @returns the resolved absolute path, or `id` untouched when it cannot be
 *          resolved from the project. Returning `id` keeps the previous
 *          behaviour (and the previous error message) for callers that pass it
 *          straight to `require`.
 */
export function resolveFromProject(
  id: string,
  projectDir: string = process.cwd()
): string {
  if (isAbsolute(id)) {
    return id
  }

  try {
    return require.resolve(id, { paths: [projectDir] })
  } catch (error) {
    if (
      error?.code !== "MODULE_NOT_FOUND" &&
      error?.code !== "ERR_PACKAGE_PATH_NOT_EXPORTED"
    ) {
      throw error
    }

    /**
     * Fall back to the default resolution algorithm so anything reachable from
     * `@medusajs/utils` itself (for example when Medusa is executed from
     * outside the project directory) keeps resolving.
     */
    return id
  }
}
