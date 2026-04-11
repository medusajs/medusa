import { Logger } from "@medusajs/framework/types"
import path from "path"
import { CONFIG } from "./types"

/**
 * Manages Node.js require cache operations and tracks broken modules
 */
export class ModuleCacheManager {
  constructor(private readonly logSource: string) {}

  private brokenModules: Set<string> = new Set()

  /**
   * Check if a module path should be excluded from cache operations
   */
  private shouldExcludePath(modulePath: string): boolean {
    return CONFIG.EXCLUDED_PATH_PATTERNS.some((pattern) =>
      modulePath.includes(pattern)
    )
  }

  /**
   * Clear cache for descendant modules recursively
   */
  private async clearDescendantModules(
    modulePath: string,
    visitedModules: Set<string>,
    logger?: Logger,
    onClear?: (path: string) => Promise<void>
  ): Promise<void> {
    if (this.shouldExcludePath(modulePath) || visitedModules.has(modulePath)) {
      return
    }

    visitedModules.add(modulePath)

    const moduleEntry = require.cache[modulePath]
    if (!moduleEntry) {
      return
    }

    // Recursively clear children first
    if (moduleEntry.children) {
      for (const child of moduleEntry.children) {
        await this.clearDescendantModules(
          child.id,
          visitedModules,
          logger,
          onClear
        )
      }
    }

    delete require.cache[modulePath]

    if (onClear) {
      await onClear(modulePath)
    }

    this.logCacheClear(modulePath, logger, "Cleared cache")
  }

  /**
   * Clear cache for parent modules recursively
   */
  private async clearParentModules(
    targetPath: string,
    visitedModules: Set<string>,
    logger?: Logger,
    onClear?: (path: string) => Promise<void>,
    trackBroken: boolean = true
  ): Promise<void> {
    const parentsToCheck = this.findParentModules(targetPath)

    for (const modulePath of parentsToCheck) {
      if (visitedModules.has(modulePath)) {
        continue
      }

      visitedModules.add(modulePath)

      // Recursively clear parents first
      await this.clearParentModules(
        modulePath,
        visitedModules,
        logger,
        onClear,
        trackBroken
      )

      // Track as potentially broken before deletion
      if (trackBroken) {
        this.brokenModules.add(modulePath)
      }

      delete require.cache[modulePath]

      if (onClear) {
        await onClear(modulePath)
      }

      this.logCacheClear(modulePath, logger, "Cleared parent cache")
    }
  }

  /**
   * Find all parent modules that depend on the target path
   */
  private findParentModules(targetPath: string): Set<string> {
    const parents = new Set<string>()

    for (const [modulePath, moduleEntry] of Object.entries(require.cache)) {
      if (this.shouldExcludePath(modulePath)) {
        continue
      }

      if (moduleEntry?.children?.some((child) => child.id === targetPath)) {
        parents.add(modulePath)
      }
    }

    return parents
  }

  /**
   * Log cache clearing operation
   */
  private logCacheClear(
    modulePath: string,
    logger: Logger | undefined,
    message: string
  ): void {
    if (logger) {
      const relativePath = path.relative(process.cwd(), modulePath)
      logger.debug(`${this.logSource} ${message}: ${relativePath}`)
    }
  }

  /**
   * Clear require cache for a file and all its parent/descendant modules
   */
  async clear(
    filePath: string,
    logger?: Logger,
    onClear?: (modulePath: string) => Promise<void>,
    trackBroken: boolean = true
  ): Promise<number> {
    const absolutePath = path.resolve(filePath)
    const visitedModules = new Set<string>()

    // Clear parents first, then descendants
    await this.clearParentModules(
      absolutePath,
      visitedModules,
      logger,
      onClear,
      trackBroken
    )

    await this.clearDescendantModules(
      absolutePath,
      visitedModules,
      logger,
      onClear
    )

    if (logger) {
      const relativePath = path.relative(process.cwd(), filePath)
      logger.info(
        `${this.logSource} Cleared ${visitedModules.size} module(s) from cache for ${relativePath}`
      )
    }

    return visitedModules.size
  }

  /**
   * Remove a module from the broken modules set
   */
  removeBrokenModule(modulePath: string): void {
    this.brokenModules.delete(modulePath)
  }

  /**
   * Get all broken module paths
   */
  getBrokenModules(): string[] {
    return Array.from(this.brokenModules)
  }

  /**
   * Get the count of broken modules
   */
  getBrokenModuleCount(): number {
    return this.brokenModules.size
  }

  /**
   * Clear a specific module from require cache
   */
  clearSingleModule(modulePath: string): void {
    delete require.cache[modulePath]
  }
}
