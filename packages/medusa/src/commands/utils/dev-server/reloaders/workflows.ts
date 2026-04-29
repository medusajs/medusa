import { Logger } from "@medusajs/framework/types"
import { ModuleCacheManager } from "../module-cache-manager"
import { ResourceRegistry } from "../resource-registry"
import {
  CONFIG,
  DevServerGlobals,
  ReloadParams,
  FileChangeAction,
} from "../types"
import { ResourceEntry, ResourceMap } from "@medusajs/framework/utils"
import { BaseReloader } from "./base"

/**
 * Handles hot reloading of workflow and step files
 */
export class WorkflowReloader extends BaseReloader {
  #logSource: string
  #logger: Logger
  #rootDirectory: string

  constructor(
    private workflowManager: DevServerGlobals["WorkflowManager"],
    cacheManager: ModuleCacheManager,
    private registry: ResourceRegistry,
    private reloadResources: (params: ReloadParams) => Promise<void>,
    logSource: string,
    logger: Logger,
    rootDirectory: string
  ) {
    super(cacheManager, logSource, logger)
    this.#logSource = logSource
    this.#logger = logger
    this.#rootDirectory = rootDirectory
  }

  /**
   * Check if a file path represents a workflow
   */
  private isWorkflowPath(filePath: string): boolean {
    return filePath.includes(CONFIG.RESOURCE_PATH_PATTERNS.workflow)
  }

  /**
   * Reload a workflow file if necessary
   */
  async reload(
    action: FileChangeAction,
    absoluteFilePath: string,
    keepCache: boolean = false,
    skipRecovery: boolean = false
  ): Promise<void> {
    if (!this.isWorkflowPath(absoluteFilePath)) {
      return
    }

    if (!this.workflowManager) {
      this.#logger.error(
        `${
          this.#logSource
        } WorkflowManager not available - cannot reload workflows`
      )
      return
    }

    const requirableWorkflowPaths = new Set<string>()
    const reloaders: Array<() => Promise<void>> = []

    // Unregister resources and collect affected workflows
    this.unregisterResources(absoluteFilePath, requirableWorkflowPaths)

    if (!keepCache) {
      await this.clearParentChildModulesCache(
        absoluteFilePath,
        reloaders,
        this.reloadResources,
        skipRecovery,
        this.#rootDirectory
      )
    }

    this.clearModuleCache(absoluteFilePath)

    // Reload workflows that were affected
    if (action !== "unlink") {
      this.reloadWorkflowModules(requirableWorkflowPaths, absoluteFilePath)
    }

    // Execute deferred reloaders
    if (reloaders.length) {
      await Promise.all(reloaders.map(async (reloader) => reloader()))
    }
  }

  /**
   * Unregister workflow and step resources
   */
  private unregisterResources(
    absoluteFilePath: string,
    affectedWorkflows: Set<string>
  ): void {
    const resources = this.registry.getResources(absoluteFilePath)
    if (!resources) {
      return
    }

    for (const [type, resourceList] of resources.entries()) {
      for (const resource of resourceList) {
        if (type === "workflow") {
          this.workflowManager!.unregister(resource.id)
        } else if (type === "step") {
          this.handleStepUnregister(resource, affectedWorkflows)
        }
      }
    }
  }

  /**
   * Handle unregistering a step and find affected workflows
   */
  private handleStepUnregister(
    stepResource: ResourceEntry,
    affectedWorkflows: Set<string>
  ): void {
    const workflowSourcePaths = this.registry.getWorkflowSourcePaths(
      stepResource.id
    )

    if (!workflowSourcePaths) {
      return
    }

    for (const sourcePath of workflowSourcePaths) {
      const workflowResources = this.registry.getResources(sourcePath)
      if (!workflowResources) {
        continue
      }

      this.unregisterWorkflowsInResource(
        workflowResources,
        affectedWorkflows,
        sourcePath
      )
    }
  }

  /**
   * Unregister workflows found in a resource and track their paths
   */
  private unregisterWorkflowsInResource(
    workflowResources: ResourceMap,
    affectedWorkflows: Set<string>,
    sourcePath: string
  ): void {
    for (const [type, resourceList] of workflowResources.entries()) {
      if (type !== "workflow") {
        continue
      }

      for (const workflow of resourceList) {
        this.workflowManager!.unregister(workflow.id)
        affectedWorkflows.add(sourcePath)
      }
    }
  }

  /**
   * Reload workflow modules using require
   */
  private reloadWorkflowModules(
    workflowPaths: Set<string>,
    mainFilePath: string
  ): void {
    for (const workflowPath of workflowPaths) {
      require(workflowPath)
    }
    require(mainFilePath)
  }
}
