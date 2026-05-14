import { ApiLoader } from "@medusajs/framework"
import { Logger } from "@medusajs/framework/types"
import { CONFIG, FileChangeAction } from "../types"
import { ModuleCacheManager } from "../module-cache-manager"
import { BaseReloader } from "./base"

/**
 * Handles hot reloading of API resources (routes, middlewares, validators, etc.)
 */
export class RouteReloader extends BaseReloader {
  #cacheManager: ModuleCacheManager
  #logSource: string
  #logger: Logger

  constructor(
    private apiLoader: ApiLoader | undefined,
    cacheManager: ModuleCacheManager,
    logSource: string,
    logger: Logger
  ) {
    super(cacheManager, logSource, logger)
    this.#cacheManager = cacheManager
    this.#logSource = logSource
    this.#logger = logger
  }

  /**
   * Check if a file path is in the API directory
   */
  private isApiPath(filePath: string): boolean {
    return filePath.includes(CONFIG.RESOURCE_PATH_PATTERNS.route)
  }

  /**
   * Reload ALL API resources when any API file changes
   * This clears all Express routes/middleware and reloads everything from scratch
   */
  async reload(
    _action: FileChangeAction,
    absoluteFilePath: string
  ): Promise<void> {
    if (!this.isApiPath(absoluteFilePath)) {
      return
    }

    if (!this.apiLoader) {
      this.#logger.error(
        `${this.#logSource} ApiLoader not available - cannot reload API`
      )
      return
    }

    this.#logger.info(
      `${this.#logSource} API change detected: ${absoluteFilePath}`
    )

    await this.#cacheManager.clear(
      absoluteFilePath,
      this.#logger,
      undefined,
      false // Don't track as broken since we're intentionally reloading
    )

    this.apiLoader.clearAllResources()

    await this.apiLoader.load()
    this.#logger.info(`${this.#logSource} API resources reloaded successfully`)
  }
}
