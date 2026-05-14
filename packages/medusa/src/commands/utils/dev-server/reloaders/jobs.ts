import { JobLoader } from "@medusajs/framework/jobs"
import { Logger, MedusaContainer } from "@medusajs/framework/types"
import { ModuleCacheManager } from "../module-cache-manager"
import { ResourceRegistry } from "../resource-registry"
import { CONFIG, DevServerGlobals, FileChangeAction } from "../types"
import { BaseReloader } from "./base"

/**
 * Metadata for a registered subscriber
 */
interface JobMetadata {
  name: string
  [key: string]: any
}

export class JobReloader extends BaseReloader {
  #logSource: string
  #logger: Logger

  constructor(
    private workflowManager: DevServerGlobals["WorkflowManager"],
    cacheManager: ModuleCacheManager,
    private container: MedusaContainer,
    private registry: ResourceRegistry,
    logSource: string,
    logger: Logger
  ) {
    super(cacheManager, logSource, logger)
    this.#logSource = logSource
    this.#logger = logger
  }

  /**
   * Check if a file path represents a subscriber
   */
  private isJobPath(filePath: string): boolean {
    return filePath.includes(CONFIG.RESOURCE_PATH_PATTERNS.job)
  }

  /**
   * Unregister a subscriber from the event-bus
   */
  private unregisterJob(metadata: JobMetadata): void {
    this.workflowManager?.unregister(metadata.name)
    this.#logger.debug(`${this.#logSource} Unregistered job ${metadata.name}`)
  }

  /**
   * Register a subscriber by loading the file and extracting its metadata
   */
  private async registerJob(absoluteFilePath: string) {
    const jobLoader = new JobLoader([], this.container)
    await jobLoader.loadFile(absoluteFilePath)
    this.#logger.debug(`${this.#logSource} Registered job ${absoluteFilePath}`)
  }

  /**
   * Reload a subscriber file if necessary
   */
  async reload(
    action: FileChangeAction,
    absoluteFilePath: string
  ): Promise<void> {
    if (!this.isJobPath(absoluteFilePath)) {
      return
    }

    const existingResources = this.registry.getResources(absoluteFilePath)
    if (existingResources) {
      for (const [_, resources] of existingResources) {
        for (const resource of resources) {
          this.unregisterJob({
            name: resource.id,
            config: resource.config,
          })
        }
      }
    }

    if (action === "add" || action === "change") {
      this.clearModuleCache(absoluteFilePath)
      await this.registerJob(absoluteFilePath)
    }
  }
}
