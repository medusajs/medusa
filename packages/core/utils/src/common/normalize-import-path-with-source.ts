import { join } from "path"

/**
 * Normalize the import path based on the project running on ts-node or not.
 * @param path
 */
export function normalizeImportPathWithSource(
  path: string | undefined
): string {
  let normalizePath = path

  /**
   * If the project is running on ts-node all relative module resolution
   * will target the src directory and otherwise the dist directory.
   * If the path is not relative, then we can safely import from it and let the resolution
   * happen under the hood.
   */
  if (normalizePath?.startsWith("./")) {
    const sourceDir = process[Symbol.for("ts-node.register.instance")]
      ? "src"
      : "dist"
    normalizePath = join(process.cwd(), sourceDir, normalizePath)
  }

  return normalizePath ?? ""
}
