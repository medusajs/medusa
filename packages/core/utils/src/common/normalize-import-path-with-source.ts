import { join } from "path"

/**
 * Normalize the import path based on the project running on ts-node or not.
 * @param path
 */
export function normalizeImportPathWithSource(
  path: string | undefined
): string {
  let normalizePath = path

  if (normalizePath?.startsWith("./")) {
    /**
     * If someone is using the correct path pointing to the "src" directory
     * then we are all good. Otherwise we will point to the "src" directory.
     *
     * In case of the production output. The app should be executed from within
     * the "./build" directory and the "./build" directory will have the
     * "./src" directory inside it.
     */
    let sourceDir = normalizePath.startsWith("./src") ? "./" : "./src"
    normalizePath = join(process.cwd(), sourceDir, normalizePath)
  }

  return normalizePath ?? ""
}
