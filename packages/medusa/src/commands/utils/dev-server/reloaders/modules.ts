import { container, MedusaAppLoader } from "@medusajs/framework"
import { IModuleService, Logger } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  dynamicImport,
} from "@medusajs/framework/utils"
import { join, relative } from "path"
import { ModuleCacheManager } from "../module-cache-manager"
import { CONFIG, FileChangeAction } from "../types"
import { BaseReloader } from "./base"
import { HMRReloadError } from "../errors"

/**
 * Handles hot reloading of custom modules in the /modules directory
 */
export class ModuleReloader extends BaseReloader {
  #logSource: string
  #logger: Logger
  #rootDirectory: string

  constructor(
    cacheManager: ModuleCacheManager,
    rootDirectory: string,
    logSource: string,
    logger: Logger
  ) {
    super(cacheManager, logSource, logger)
    this.#logSource = logSource
    this.#logger = logger
    this.#rootDirectory = rootDirectory
  }

  /**
   * Check if a file path is within a module directory
   */
  private isModulePath(filePath: string): boolean {
    return filePath.includes("modules/")
  }

  /**
   * Extract module name from file path
   * e.g., "/path/to/project/modules/contact-us/service.ts" -> "contact-us"
   */
  private getModuleNameFromPath(filePath: string): string | null {
    const modulesPattern = "modules/"
    const parts = filePath.split(modulesPattern)

    if (parts.length < 2) {
      return null
    }

    const afterModules = parts[1]
    const moduleName = afterModules.split("/")[0]

    return moduleName || null
  }

  /**
   * Get the module directory path
   */
  private getModuleDirectory(moduleName: string): string {
    return join(this.#rootDirectory, "src", "modules", moduleName)
  }

  /**
   * Get module key and service name from config
   */
  private async getModuleInfo(moduleName: string): Promise<{
    moduleKey: string
    serviceName: string
  } | null> {
    try {
      const configModule = container.resolve(
        ContainerRegistrationKeys.CONFIG_MODULE
      )

      if (!configModule?.modules) {
        return null
      }

      // Find the module in config
      for (const [key, config] of Object.entries(configModule.modules)) {
        if (typeof config === "object" && config !== null) {
          const resolvedPath = (config as any).resolve
          if (
            resolvedPath &&
            (resolvedPath.includes(`/modules/${moduleName}`) ||
              resolvedPath === `./modules/${moduleName}`)
          ) {
            // Load the module to get serviceName from joinerConfig
            const moduleDirectory = this.getModuleDirectory(moduleName)
            const moduleIndexPath = join(moduleDirectory, "index.ts")
            const moduleExports = await dynamicImport(moduleIndexPath)
            const moduleService =
              moduleExports.service ?? moduleExports.default?.service

            const joinerConfig =
              typeof moduleService?.prototype?.__joinerConfig === "function"
                ? moduleService.prototype.__joinerConfig()
                : moduleService?.prototype?.__joinerConfig

            if (!joinerConfig?.serviceName) {
              return null
            }

            return {
              moduleKey: key,
              serviceName: joinerConfig.serviceName,
            }
          }
        }
      }

      return null
    } catch (error: any) {
      this.#logger.warn(
        `${this.#logSource} Failed to get module info for "${moduleName}": ${
          error.message
        }`
      )
      return null
    }
  }

  /**
   * Shutdown a module instance by calling its lifecycle hooks
   */
  private async shutdownModule(moduleInstance: any): Promise<void> {
    try {
      if (moduleInstance?.__hooks?.onApplicationPrepareShutdown) {
        await moduleInstance.__hooks.onApplicationPrepareShutdown
          .bind(moduleInstance)()
          .catch(() => {})
      }

      if (moduleInstance?.__hooks?.onApplicationShutdown) {
        await moduleInstance.__hooks.onApplicationShutdown
          .bind(moduleInstance)()
          .catch(() => {})
      }
    } catch (error) {
      this.#logger.warn(
        `${this.#logSource} Error during module shutdown: ${error.message}`
      )
    }
  }

  /**
   * Clear all module files from require cache
   */
  private clearModuleFilesCache(moduleDirectory: string): void {
    const relativeModuleDirectory = relative(
      this.#rootDirectory,
      moduleDirectory
    )
    Object.keys(require.cache).forEach((cachedPath) => {
      if (
        !CONFIG.EXCLUDED_PATH_PATTERNS.some((pattern) =>
          cachedPath.includes(pattern)
        ) &&
        cachedPath.includes(relativeModuleDirectory)
      ) {
        delete require.cache[cachedPath]
      }
    })
  }

  /**
   * Reload a module when its files change
   */
  async reload(
    action: FileChangeAction,
    absoluteFilePath: string
  ): Promise<void> {
    if (!this.isModulePath(absoluteFilePath)) {
      return
    }

    const moduleName = this.getModuleNameFromPath(absoluteFilePath)
    if (!moduleName) {
      this.#logger.warn(
        `${
          this.#logSource
        } Could not determine module name from path: ${absoluteFilePath}`
      )
      return
    }

    const relativePath = relative(this.#rootDirectory, absoluteFilePath)

    if (action === "unlink") {
      this.#logger.warn(
        `${
          this.#logSource
        } Module file removed: ${relativePath}. Server restart may be required.`
      )
      throw new HMRReloadError(
        `Module file removed: ${relativePath}. Server restart may be required.`
      )
    }

    if (absoluteFilePath.includes("migrations")) {
      this.#logger.warn(
        `${
          this.#logSource
        } Migrations file changed: ${relativePath}. You may need to apply migrations and restart the server.`
      )

      return
    }

    // Get the module information
    const moduleInfo = await this.getModuleInfo(moduleName)
    if (!moduleInfo) {
      this.#logger.warn(
        `${this.#logSource} Could not find module config for: ${moduleName}`
      )
      return
    }

    const { moduleKey, serviceName } = moduleInfo

    this.#logger.info(
      `${
        this.#logSource
      } Reloading module "${serviceName}" (${moduleName}) due to change in ${relativePath}`
    )

    try {
      // Get the current module instance
      const moduleInstance = container.resolve(serviceName) as any

      if (moduleInstance) {
        // Shutdown the module
        await this.shutdownModule(moduleInstance)
      }

      const moduleDirectory = this.getModuleDirectory(moduleName)
      this.clearModuleFilesCache(moduleDirectory)

      const medusaAppLoader = new MedusaAppLoader()
      const newModuleInstance = (await medusaAppLoader.reloadSingleModule({
        moduleKey,
        serviceName,
      })) as unknown as IModuleService

      if (!newModuleInstance) {
        throw new Error(`Failed to reload module "${moduleKey}"`)
      }

      this.#logger.info(
        `${this.#logSource} Successfully reloaded module "${serviceName}"`
      )
    } catch (error: any) {
      this.#logger.error(
        `${this.#logSource} Failed to reload module "${serviceName}": ${
          error.message
        }`
      )
      throw new HMRReloadError(
        `Failed to reload module "${serviceName}": ${error.message}. Server restart may be required.`
      )
    }
  }
}
