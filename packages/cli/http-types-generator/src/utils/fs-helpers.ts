import { existsSync, mkdirSync, writeFileSync } from "fs"
import path from "path"
import { Config } from "../config"

export class FsHelpers {
  /**
   * Returns the absolute path to the project root.
   * Determined by searching upward for `http-types.config.json`; falls back
   * to `process.cwd()` when no config file is found.
   */
  static getProjectRoot(): string {
    return Config.get().projectRoot
  }

  /**
   * Ensures a directory exists, creating it recursively if needed.
   */
  static ensureDir(dirPath: string): void {
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true })
    }
  }

  /**
   * Writes content to a file, creating intermediate directories as needed.
   */
  static writeFile(filePath: string, content: string): void {
    FsHelpers.ensureDir(path.dirname(filePath))
    writeFileSync(filePath, content, "utf-8")
  }

  /**
   * Resolves a path relative to the project root.
   */
  static fromRoot(...segments: string[]): string {
    return path.join(FsHelpers.getProjectRoot(), ...segments)
  }
}
