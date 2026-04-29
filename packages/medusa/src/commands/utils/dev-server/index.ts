import { container } from "@medusajs/framework"
import { logger } from "@medusajs/framework/logger"
import { ModuleCacheManager } from "./module-cache-manager"
import { RecoveryService } from "./recovery-service"
import { RouteReloader } from "./reloaders/routes"
import { SubscriberReloader } from "./reloaders/subscribers"
import { WorkflowReloader } from "./reloaders/workflows"
import { ResourceRegistry } from "./resource-registry"
import { DevServerGlobals, ReloadParams } from "./types"
import { JobReloader } from "./reloaders/jobs"
import { ModuleReloader } from "./reloaders/modules"
import { HMRReloadError } from "./errors"

let sharedCacheManager!: ModuleCacheManager
const sharedRegistry = new ResourceRegistry()

const reloaders = {} as {
  routesReloader: RouteReloader
  subscribersReloader?: SubscriberReloader
  workflowsReloader: WorkflowReloader
  jobsReloader?: JobReloader
  modulesReloader?: ModuleReloader
}

function initializeReloaders(logSource: string, rootDirectory: string) {
  sharedCacheManager ??= new ModuleCacheManager(logSource)

  const globals = global as unknown as DevServerGlobals

  if (!reloaders.routesReloader) {
    const routeReloader = new RouteReloader(
      globals.__MEDUSA_HMR_API_LOADER__,
      sharedCacheManager,
      logSource,
      logger
    )
    reloaders.routesReloader = routeReloader
  }

  if (!reloaders.subscribersReloader) {
    const subscriberReloader = new SubscriberReloader(
      container,
      sharedCacheManager,
      sharedRegistry,
      logSource,
      logger
    )
    reloaders.subscribersReloader = subscriberReloader
  }

  if (!reloaders.workflowsReloader) {
    const workflowReloader = new WorkflowReloader(
      globals.WorkflowManager,
      sharedCacheManager,
      sharedRegistry,
      reloadResources,
      logSource,
      logger,
      rootDirectory
    )
    reloaders.workflowsReloader = workflowReloader
  }

  if (!reloaders.jobsReloader) {
    const jobReloader = new JobReloader(
      globals.WorkflowManager,
      sharedCacheManager,
      container,
      sharedRegistry,
      logSource,
      logger
    )
    reloaders.jobsReloader = jobReloader
  }

  if (!reloaders.modulesReloader) {
    const moduleReloader = new ModuleReloader(
      sharedCacheManager,
      rootDirectory,
      logSource,
      logger
    )
    reloaders.modulesReloader = moduleReloader
  }
}

const unmanagedFiles = ["medusa-config", ".env"]

/**
 * Main entry point for reloading resources (routes, subscribers, workflows, and modules)
 * Orchestrates the reload process and handles recovery of broken modules
 */
export async function reloadResources({
  logSource,
  action,
  absoluteFilePath,
  keepCache,
  logger,
  skipRecovery = false,
  rootDirectory,
}: ReloadParams): Promise<void> {
  if (unmanagedFiles.some((file) => absoluteFilePath.includes(file))) {
    throw new HMRReloadError(
      `File ${absoluteFilePath} is not managed by the dev server HMR. Server restart may be required.`
    )
  }

  initializeReloaders(logSource, rootDirectory)

  // Reload modules first as other resources might depend on them
  await reloaders.modulesReloader?.reload?.(action, absoluteFilePath)

  // Reload in dependency order: workflows → routes → subscribers → jobs
  // Jobs depend on workflows, so workflows must be reloaded first
  await reloaders.workflowsReloader.reload(
    action,
    absoluteFilePath,
    keepCache,
    skipRecovery
  )
  await reloaders.routesReloader.reload(action, absoluteFilePath)
  await reloaders.subscribersReloader?.reload?.(action, absoluteFilePath)
  await reloaders.jobsReloader?.reload?.(action, absoluteFilePath)

  // Attempt recovery of broken modules (unless we're already in recovery mode)
  if (!skipRecovery) {
    const recoveryService = new RecoveryService(
      sharedCacheManager,
      reloadResources,
      logSource,
      logger,
      rootDirectory
    )

    await recoveryService.recoverBrokenModules()
  }
}
