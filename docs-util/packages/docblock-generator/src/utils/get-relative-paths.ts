import path from "path"

/**
 * Get relative path of multiple file paths to a specified path.
 *
 * @param {string[]} filePaths - The file paths to retrieve their relative path.
 * @param {string} pathPrefix - The path to retrieve paths relative to.
 * @returns {string[]} The relative file paths.
 */
export default function getRelativePaths(
  filePaths: string[],
  pathPrefix: string
): string[] {
  return filePaths.map((filePath) => path.resolve(pathPrefix, filePath))
}
