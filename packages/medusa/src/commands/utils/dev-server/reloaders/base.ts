import { Logger } from "@medusajs/framework/types"
import { ModuleCacheManager } from "../module-cache-manager"
import { FileChangeAction } from "../types"

export class BaseReloader {
  constructor(
    private readonly cacheManager: ModuleCacheManager,
    private readonly logSource: string,
    private readonly logger: Logger
  ) {}

  clearModuleCache(absoluteFilePath: string) {
    const resolved = require.resolve(absoluteFilePath)
    if (require.cache[resolved]) {
      delete require.cache[resolved]
    }
  }

  async clearParentChildModulesCache(
    absoluteFilePath: string,
    reloaders: Array<() => Promise<void>>,
    reloadResources: (args: {
      logSource: string
      action: FileChangeAction
      absoluteFilePath: string
      keepCache: boolean
      skipRecovery: boolean
      logger: Logger
      rootDirectory: string
    }) => Promise<void>,
    skipRecovery: boolean,
    rootDirectory: string
  ): Promise<void> {
    await this.cacheManager.clear(
      absoluteFilePath,
      this.logger,
      async (modulePath) => {
        // Create deferred reloader for each cleared module
        reloaders.push(async () =>
          reloadResources({
            logSource: this.logSource,
            action: "change",
            absoluteFilePath: modulePath,
            keepCache: true,
            skipRecovery: true, // handled by the main caller
            logger: this.logger,
            rootDirectory,
          })
        )
      },
      !skipRecovery // Track broken modules unless we're in recovery mode
    )
  }
}
