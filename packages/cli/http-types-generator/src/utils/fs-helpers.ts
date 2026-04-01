import { existsSync, mkdirSync, writeFileSync } from "fs"
import path from "path"

/**
 * Returns the absolute path to the monorepo root by traversing up from
 * the compiled file location:
 * packages/cli/http-types-generator/dist/utils/fs-helpers.js → 5 levels up
 */
export function getMonorepoRoot(): string {
  return path.resolve(__dirname, "..", "..", "..", "..", "..")
}

/**
 * Ensures a directory exists, creating it recursively if needed.
 */
export function ensureDir(dirPath: string): void {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true })
  }
}

/**
 * Writes content to a file, creating intermediate directories as needed.
 */
export function writeFile(filePath: string, content: string): void {
  ensureDir(path.dirname(filePath))
  writeFileSync(filePath, content, "utf-8")
}

/**
 * Resolves a path relative to the monorepo root.
 */
export function fromRoot(...segments: string[]): string {
  return path.join(getMonorepoRoot(), ...segments)
}
