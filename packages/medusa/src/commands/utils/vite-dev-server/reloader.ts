import { container } from "@medusajs/framework"
import { JobLoader } from "@medusajs/framework/jobs"
import { WorkflowManager } from "@medusajs/framework/orchestration"
import { SubscriberLoader } from "@medusajs/framework/subscribers"
import { IEventBusModuleService, Logger } from "@medusajs/framework/types"
import { globalDevServerRegistry, Modules } from "@medusajs/framework/utils"
import path from "path"
import { HMRReloadError } from "../dev-server/errors"
import { DevServerGlobals, FileChangeAction } from "../dev-server/types"
import { ViteModuleLoader } from "./module-loader"

const LOG_SOURCE = "[Vite]"

/**
 * Directories whose files are wired into the container at boot. Changes that
 * reach them can't be applied in place and require a server restart.
 */
const RESTART_DIRECTORIES = ["modules", "links"]
const UNMANAGED_FILES = ["medusa-config", ".env"]

/**
 * Applies file changes to a running server whose project sources are loaded
 * through Vite's module runner. The runner's module graph decides what is
 * affected; this class unregisters what those files registered (workflows,
 * subscribers, jobs, routes) and loads them again.
 */
export class ViteReloader {
  #queue: Promise<unknown> = Promise.resolve()
  #srcDir: string

  constructor(
    private readonly loader: ViteModuleLoader,
    private readonly directory: string,
    private readonly logger: Logger
  ) {
    this.#srcDir = path.join(directory, "src")
  }

  /**
   * Reloads are applied one at a time, in the order the changes arrived.
   */
  reload(action: FileChangeAction, absoluteFilePath: string): Promise<void> {
    const run = this.#queue.then(() => this.#reload(action, absoluteFilePath))
    this.#queue = run.catch(() => {})
    return run
  }

  #isIn(directoryName: string, filePath: string) {
    return filePath.startsWith(
      path.join(this.#srcDir, directoryName) + path.sep
    )
  }

  async #reload(action: FileChangeAction, file: string) {
    if (UNMANAGED_FILES.some((name) => path.basename(file).startsWith(name))) {
      throw new HMRReloadError(`${file} requires a server restart`)
    }

    const affected = this.loader.invalidate(file)
    if (action === "add") {
      affected.add(file)
    }

    const restartFile = [...affected].find((f) =>
      RESTART_DIRECTORIES.some((dir) => this.#isIn(dir, f))
    )
    if (restartFile) {
      throw new HMRReloadError(
        `${path.relative(this.directory, restartFile)} requires a server restart`
      )
    }

    if (!affected.size) {
      return
    }

    const workflowFiles = new Set<string>()
    const subscriberFiles = new Set<string>()
    const jobFiles = new Set<string>()
    const eventBus = container.resolve<IEventBusModuleService>(
      Modules.EVENT_BUS,
      { allowUnregistered: true }
    )

    // 1. Unregister everything the affected files registered
    for (const affectedFile of affected) {
      const resources = globalDevServerRegistry.get(affectedFile)
      for (const [type, entries] of resources ?? []) {
        for (const entry of entries) {
          if (type === "workflow") {
            WorkflowManager.unregister(entry.id)
            workflowFiles.add(affectedFile)
          } else if (type === "step") {
            workflowFiles.add(affectedFile)
          } else if (type === "subscriber") {
            for (const event of entry.events ?? []) {
              const handler = Object.assign(async () => {}, {
                subscriberId: entry.subscriberId,
              })
              eventBus?.unsubscribe(event, handler as any, {
                subscriberId: entry.subscriberId,
              })
            }
            subscriberFiles.add(affectedFile)
          } else if (type === "job") {
            WorkflowManager.unregister(entry.id)
            jobFiles.add(affectedFile)
          }
        }
      }
      globalDevServerRegistry.delete(affectedFile)

      if (this.#isIn("workflows", affectedFile)) {
        workflowFiles.add(affectedFile)
      } else if (this.#isIn("subscribers", affectedFile)) {
        subscriberFiles.add(affectedFile)
      } else if (this.#isIn("jobs", affectedFile)) {
        jobFiles.add(affectedFile)
      }
    }

    if (action === "unlink") {
      workflowFiles.delete(file)
      subscriberFiles.delete(file)
      jobFiles.delete(file)
    }

    // 2. Load them again. Workflows first, everything else depends on them.
    const errors: unknown[] = []
    const attempt = async (fn: () => Promise<unknown>) => {
      try {
        await fn()
      } catch (error) {
        errors.push(error)
      }
    }

    for (const workflowFile of workflowFiles) {
      await attempt(() => this.loader.import(workflowFile))
    }

    for (const subscriberFile of subscriberFiles) {
      await attempt(async () => {
        const exports = await this.loader.import(subscriberFile)
        new SubscriberLoader(subscriberFile, {}, container).createSubscriber({
          fileName: subscriberFile,
          config: exports.config,
          handler: exports.default,
        })
      })
    }

    for (const jobFile of jobFiles) {
      await attempt(() => new JobLoader([], container).loadFile(jobFile))
    }

    if ([...affected].some((f) => this.#isIn("api", f))) {
      const apiLoader = (global as unknown as DevServerGlobals)
        .__MEDUSA_HMR_API_LOADER__
      if (!apiLoader) {
        throw new HMRReloadError("API loader unavailable")
      }
      await attempt(async () => {
        apiLoader.clearAllResources()
        await apiLoader.load()
      })
    }

    // Errors in user code don't restart the server: the next save that fixes
    // them is applied in place.
    for (const error of errors) {
      this.logger.error(`${LOG_SOURCE} Failed to reload`, error as Error)
    }

    this.logger.info(
      `${LOG_SOURCE} Reloaded ${affected.size} module(s) for ${path.relative(
        this.directory,
        file
      )}${errors.length ? " with errors" : ""}`
    )
  }
}
