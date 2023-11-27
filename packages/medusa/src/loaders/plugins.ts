import { promiseAll, SearchUtils, upperCaseFirst } from "@medusajs/utils"
import { aliasTo, asFunction, asValue, Lifetime } from "awilix"
import { Express } from "express"
import fs from "fs"
import { sync as existsSync } from "fs-exists-cached"
import glob from "glob"
import _ from "lodash"
import { createRequireFromPath } from "medusa-core-utils"
import { FileService, OauthService } from "medusa-interfaces"
import { trackInstallation } from "medusa-telemetry"
import { EOL } from "os"
import path from "path"
import { EntitySchema } from "typeorm"
import {
  AbstractTaxService,
  isBatchJobStrategy,
  isCartCompletionStrategy,
  isFileService,
  isNotificationService,
  isPriceSelectionStrategy,
  isTaxCalculationStrategy,
} from "../interfaces"
import { MiddlewareService } from "../services"
import {
  ClassConstructor,
  ConfigModule,
  Logger,
  MedusaContainer,
} from "../types/global"
import {
  formatRegistrationName,
  formatRegistrationNameWithoutNamespace,
} from "../utils/format-registration-name"
import { getModelExtensionsMap } from "./helpers/get-model-extension-map"
import ScheduledJobsLoader from "./helpers/jobs"
import {
  registerAbstractFulfillmentServiceFromClass,
  registerFulfillmentServiceFromClass,
  registerPaymentProcessorFromClass,
  registerPaymentServiceFromClass,
} from "./helpers/plugins"
import { RoutesLoader } from "./helpers/routing"
import { SubscriberLoader } from "./helpers/subscribers"
import logger from "./logger"

type Options = {
  rootDirectory: string
  container: MedusaContainer
  configModule: ConfigModule
  app: Express
  activityId: string
}

type PluginDetails = {
  resolve: string
  name: string
  id: string
  options: Record<string, unknown>
  version: string
}

export const isSearchEngineInstalledResolutionKey = "isSearchEngineInstalled"

export const MEDUSA_PROJECT_NAME = "project-plugin"

/**
 * Registers all services in the services directory
 */
export default async ({
  rootDirectory,
  container,
  app,
  configModule,
  activityId,
}: Options): Promise<void> => {
  const resolved = getResolvedPlugins(rootDirectory, configModule) || []

  await promiseAll(
    resolved.map(
      async (pluginDetails) => await runSetupFunctions(pluginDetails)
    )
  )

  await promiseAll(
    resolved.map(async (pluginDetails) => {
      registerRepositories(pluginDetails, container)
      await registerServices(pluginDetails, container)
      await registerMedusaApi(pluginDetails, container)
      await registerApi(
        pluginDetails,
        app,
        rootDirectory,
        container,
        configModule,
        activityId
      )
      registerCoreRouters(pluginDetails, container)
      await registerSubscribers(pluginDetails, container, activityId)
      await registerWorkflows(pluginDetails)
    })
  )

  await promiseAll(
    resolved.map(async (pluginDetails) => runLoaders(pluginDetails, container))
  )

  if (configModule.projectConfig.redis_url) {
    await Promise.all(
      resolved.map(async (pluginDetails) => {
        await registerScheduledJobs(pluginDetails, container)
      })
    )
  } else {
    logger.warn(
      "You don't have Redis configured. Scheduled jobs will not be enabled."
    )
  }

  resolved.forEach((plugin) => trackInstallation(plugin.name, "plugin"))
}

function getResolvedPlugins(
  rootDirectory: string,
  configModule: ConfigModule,
  extensionDirectoryPath = "dist"
): undefined | PluginDetails[] {
  const { plugins } = configModule

  const resolved = plugins.map((plugin) => {
    if (_.isString(plugin)) {
      return resolvePlugin(plugin)
    }

    const details = resolvePlugin(plugin.resolve)
    details.options = plugin.options

    return details
  })

  const extensionDirectory = path.join(rootDirectory, extensionDirectoryPath)
  // Resolve user's project as a plugin for loading purposes
  resolved.push({
    resolve: extensionDirectory,
    name: MEDUSA_PROJECT_NAME,
    id: createPluginId(MEDUSA_PROJECT_NAME),
    options: configModule,
    version: createFileContentHash(process.cwd(), `**`),
  })

  return resolved
}

export async function registerPluginModels({
  rootDirectory,
  container,
  configModule,
  extensionDirectoryPath = "dist",
  pathGlob = "/models/*.js",
}: {
  rootDirectory: string
  container: MedusaContainer
  configModule: ConfigModule
  extensionDirectoryPath?: string
  pathGlob?: string
}): Promise<void> {
  const resolved =
    getResolvedPlugins(rootDirectory, configModule, extensionDirectoryPath) ||
    []

  await promiseAll(
    resolved.map(async (pluginDetails) => {
      registerModels(pluginDetails, container, rootDirectory, pathGlob)
    })
  )
}

async function runLoaders(
  pluginDetails: PluginDetails,
  container: MedusaContainer
): Promise<void> {
  const loaderFiles = glob.sync(
    `${pluginDetails.resolve}/loaders/[!__]*.js`,
    {}
  )
  await promiseAll(
    loaderFiles.map(async (loader) => {
      try {
        const module = require(loader).default
        if (typeof module === "function") {
          await module(container, pluginDetails.options)
        }
      } catch (err) {
        const logger = container.resolve<Logger>("logger")
        logger.warn(`Running loader failed: ${err.message}`)
        return Promise.resolve()
      }
    })
  )
}

async function registerScheduledJobs(
  pluginDetails: PluginDetails,
  container: MedusaContainer
): Promise<void> {
  await new ScheduledJobsLoader(
    path.join(pluginDetails.resolve, "jobs"),
    container,
    pluginDetails.options
  ).load()
}

async function registerMedusaApi(
  pluginDetails: PluginDetails,
  container: MedusaContainer
): Promise<void> {
  registerMedusaMiddleware(pluginDetails, container)
  registerStrategies(pluginDetails, container)
}

export function registerStrategies(
  pluginDetails: PluginDetails,
  container: MedusaContainer
): void {
  const files = glob.sync(`${pluginDetails.resolve}/strategies/[!__]*.js`, {
    ignore: ["**/__fixtures__/**", "**/index.js", "**/index.ts"],
  })
  const registeredServices = {}

  files.map((file) => {
    const module = require(file).default

    switch (true) {
      case isTaxCalculationStrategy(module.prototype): {
        if (!("taxCalculationStrategy" in registeredServices)) {
          container.register({
            taxCalculationStrategy: asFunction(
              (cradle) => new module(cradle, pluginDetails.options)
            ).singleton(),
          })
          registeredServices["taxCalculationStrategy"] = file
        } else {
          logger.warn(
            `Cannot register ${file}. A tax calculation strategy is already registered`
          )
        }
        break
      }

      case isCartCompletionStrategy(module.prototype): {
        if (!("cartCompletionStrategy" in registeredServices)) {
          container.register({
            cartCompletionStrategy: asFunction(
              (cradle) => new module(cradle, pluginDetails.options)
            ).singleton(),
          })
          registeredServices["cartCompletionStrategy"] = file
        } else {
          logger.warn(
            `Cannot register ${file}. A cart completion strategy is already registered`
          )
        }
        break
      }

      case isBatchJobStrategy(module.prototype): {
        container.registerAdd(
          "batchJobStrategies",
          asFunction((cradle) => new module(cradle, pluginDetails.options))
        )

        const name = formatRegistrationName(file)
        container.register({
          [name]: asFunction(
            (cradle) => new module(cradle, pluginDetails.options)
          ).singleton(),
          [`batch_${module.identifier}`]: aliasTo(name),
          [`batchType_${module.batchType}`]: aliasTo(name),
        })
        break
      }

      case isPriceSelectionStrategy(module.prototype): {
        if (!("priceSelectionStrategy" in registeredServices)) {
          container.register({
            priceSelectionStrategy: asFunction(
              (cradle) => new module(cradle, pluginDetails.options)
            ).singleton(),
          })

          registeredServices["priceSelectionStrategy"] = file
        } else {
          logger.warn(
            `Cannot register ${file}. A price selection strategy is already registered`
          )
        }
        break
      }

      default:
        logger.warn(
          `${file} did not export a class that implements a strategy interface. Your Medusa server will still work, but if you have written custom strategy logic it will not be used. Make sure to implement the proper interface.`
        )
    }
  })
}

function registerMedusaMiddleware(
  pluginDetails: PluginDetails,
  container: MedusaContainer
): void {
  let module
  try {
    module = require(`${pluginDetails.resolve}/api/medusa-middleware`).default
  } catch (err) {
    return
  }

  const middlewareService =
    container.resolve<MiddlewareService>("middlewareService")
  if (module.postAuthentication) {
    middlewareService.addPostAuthentication(
      module.postAuthentication,
      pluginDetails.options
    )
  }

  if (module.preAuthentication) {
    middlewareService.addPreAuthentication(
      module.preAuthentication,
      pluginDetails.options
    )
  }

  if (module.preCartCreation) {
    middlewareService.addPreCartCreation(module.preCartCreation)
  }
}

function registerCoreRouters(
  pluginDetails: PluginDetails,
  container: MedusaContainer
): void {
  const middlewareService =
    container.resolve<MiddlewareService>("middlewareService")
  const { resolve } = pluginDetails
  const adminFiles = glob.sync(`${resolve}/api/admin/[!__]*.js`, {})
  const storeFiles = glob.sync(`${resolve}/api/store/[!__]*.js`, {})

  adminFiles.forEach((fn) => {
    const descriptor = fn.split(".")[0]
    const splat = descriptor.split("/")
    const path = `${splat[splat.length - 2]}/${splat[splat.length - 1]}`
    const loaded = require(fn).default

    if (loaded && typeof loaded === "function") {
      middlewareService.addRouter(path, loaded())
    }
  })

  storeFiles.forEach((fn) => {
    const descriptor = fn.split(".")[0]
    const splat = descriptor.split("/")
    const path = `${splat[splat.length - 2]}/${splat[splat.length - 1]}`
    const loaded = require(fn).default

    if (loaded && typeof loaded === "function") {
      middlewareService.addRouter(path, loaded())
    }
  })
}

/**
 * Registers the plugin's api routes.
 */
async function registerApi(
  pluginDetails: PluginDetails,
  app: Express,
  rootDirectory = "",
  container: MedusaContainer,
  configmodule: ConfigModule,
  activityId: string
): Promise<Express> {
  const logger = container.resolve<Logger>("logger")
  const projectName =
    pluginDetails.name === MEDUSA_PROJECT_NAME
      ? "your Medusa project"
      : `${pluginDetails.name}`

  logger.progress(activityId, `Registering custom endpoints for ${projectName}`)

  try {
    /**
     * Register the plugin's API routes using the file based routing.
     */
    await new RoutesLoader({
      app,
      rootDir: path.join(pluginDetails.resolve, "api"),
      activityId: activityId,
      configModule: configmodule,
    }).load()
  } catch (err) {
    logger.warn(
      `An error occurred while registering API Routes in ${projectName}${
        err.stack ? EOL + err.stack : ""
      }`
    )
  }

  try {
    /**
     * For backwards compatibility we also support loading routes from
     * `/api/index` if the file exists.
     */
    let apiFolderExists = true

    try {
      require.resolve(`${pluginDetails.resolve}/api`)
    } catch (e) {
      apiFolderExists = false
    }

    if (apiFolderExists) {
      const routes = require(`${pluginDetails.resolve}/api`).default
      if (routes) {
        app.use("/", routes(rootDirectory, pluginDetails.options))
      }
    }
  } catch (err) {
    if (err.code !== "MODULE_NOT_FOUND") {
      logger.warn(
        `An error occurred while registering endpoints in ${projectName}`
      )

      if (err.stack) {
        logger.warn(`${err.stack}`)
      }
    }
  }

  return app
}

/**
 * Registers a service at the right location in our container. If the service is
 * a BaseService instance it will be available directly from the container.
 * PaymentService instances are added to the paymentProviders array in the
 * container. Names are camelCase formatted and namespaced by the folder i.e:
 * services/example-payments -> examplePaymentsService
 * @param {object} pluginDetails - the plugin details including plugin options,
 *    version, id, resolved path, etc. See resolvePlugin
 * @param {object} container - the container where the services will be
 *    registered
 * @return {void}
 */
export async function registerServices(
  pluginDetails: PluginDetails,
  container: MedusaContainer
): Promise<void> {
  const files = glob.sync(`${pluginDetails.resolve}/services/[!__]*.js`, {})
  await promiseAll(
    files.map(async (fn) => {
      const loaded = require(fn).default
      const name = formatRegistrationName(fn)

      const context = { container, pluginDetails, registrationName: name }

      registerPaymentServiceFromClass(loaded, context)
      registerPaymentProcessorFromClass(loaded, context)

      registerFulfillmentServiceFromClass(loaded, context)
      registerAbstractFulfillmentServiceFromClass(loaded, context)

      if (loaded.prototype instanceof OauthService) {
        const appDetails = loaded.getAppDetails(pluginDetails.options)

        const oauthService =
          container.resolve<typeof OauthService>("oauthService")
        await oauthService.registerOauthApp(appDetails)

        const name = appDetails.application_name
        container.register({
          [`${name}Oauth`]: asFunction(
            (cradle) => new loaded(cradle, pluginDetails.options),
            {
              lifetime: loaded.LIFE_TIME || Lifetime.SINGLETON,
            }
          ),
        })
      } else if (isNotificationService(loaded.prototype)) {
        container.registerAdd(
          "notificationProviders",
          asFunction((cradle) => new loaded(cradle, pluginDetails.options), {
            lifetime: loaded.LIFE_TIME || Lifetime.SINGLETON,
          })
        )

        // Add the service directly to the container in order to make simple
        // resolution if we already know which notification provider we need to use
        container.register({
          [name]: asFunction(
            (cradle) => new loaded(cradle, pluginDetails.options),
            {
              lifetime: loaded.LIFE_TIME || Lifetime.SINGLETON,
            }
          ),
          [`noti_${loaded.identifier}`]: aliasTo(name),
        })
      } else if (
        loaded.prototype instanceof FileService ||
        isFileService(loaded.prototype)
      ) {
        // Add the service directly to the container in order to make simple
        // resolution if we already know which file storage provider we need to use
        container.register({
          [name]: asFunction(
            (cradle) => new loaded(cradle, pluginDetails.options),
            {
              lifetime: loaded.LIFE_TIME || Lifetime.SINGLETON,
            }
          ),
          [`fileService`]: aliasTo(name),
        })
      } else if (SearchUtils.isSearchService(loaded.prototype)) {
        // Add the service directly to the container in order to make simple
        // resolution if we already know which search provider we need to use
        container.register({
          [name]: asFunction(
            (cradle) => new loaded(cradle, pluginDetails.options),
            {
              lifetime: loaded.LIFE_TIME || Lifetime.SINGLETON,
            }
          ),
          [`searchService`]: aliasTo(name),
        })

        container.register(isSearchEngineInstalledResolutionKey, asValue(true))
      } else if (loaded.prototype instanceof AbstractTaxService) {
        container.registerAdd(
          "taxProviders",
          asFunction((cradle) => new loaded(cradle, pluginDetails.options), {
            lifetime: loaded.LIFE_TIME || Lifetime.SINGLETON,
          })
        )

        container.register({
          [name]: asFunction(
            (cradle) => new loaded(cradle, pluginDetails.options),
            {
              lifetime: loaded.LIFE_TIME || Lifetime.SINGLETON,
            }
          ),
          [`tp_${loaded.identifier}`]: aliasTo(name),
        })
      } else {
        container.register({
          [name]: asFunction(
            (cradle) => new loaded(cradle, pluginDetails.options),
            {
              lifetime: loaded.LIFE_TIME || Lifetime.SCOPED,
            }
          ),
        })
      }
    })
  )
}

/**
 * Registers a plugin's subscribers at the right location in our container.
 * Subscribers are registered directly in the container.
 * @param {object} pluginDetails - the plugin details including plugin options,
 *    version, id, resolved path, etc. See resolvePlugin
 * @param {object} container - the container where the services will be
 *    registered
 * @return {void}
 */
async function registerSubscribers(
  pluginDetails: PluginDetails,
  container: MedusaContainer,
  activityId: string
): Promise<void> {
  const loadedFiles = await new SubscriberLoader(
    path.join(pluginDetails.resolve, "subscribers"),
    container,
    pluginDetails.options,
    activityId
  ).load()

  /**
   * Exclude any files that have already been loaded by the subscriber loader
   */
  const normalizedLoadedFiles =
    loadedFiles?.map((file) => file.replace(/\\/g, "/")) ?? []

  const files = glob.sync(`${pluginDetails.resolve}/subscribers/*.js`, {})
  files
    .filter((file) => !normalizedLoadedFiles.includes(file))
    .forEach((fn) => {
      const loaded = require(fn).default

      container.build(
        asFunction(
          (cradle) => new loaded(cradle, pluginDetails.options)
        ).singleton()
      )
    })
}

/**
 * Registers a plugin's repositories at the right location in our container.
 * repositories are registered directly in the container.
 * @param {object} pluginDetails - the plugin details including plugin options,
 *    version, id, resolved path, etc. See resolvePlugin
 * @param {object} container - the container where the services will be
 *    registered
 * @return {void}
 */
function registerRepositories(
  pluginDetails: PluginDetails,
  container: MedusaContainer
): void {
  const files = glob.sync(`${pluginDetails.resolve}/repositories/*.js`, {})
  files.forEach((fn) => {
    const loaded = require(fn)

    Object.entries(loaded).map(([, val]: [string, any]) => {
      if (typeof loaded === "object") {
        const name = formatRegistrationName(fn)
        container.register({
          [name]: asValue(val),
        })
      }
    })
  })
}

/**
 * import files from the workflows directory to run the registration of the wofklows
 * @param pluginDetails
 */
async function registerWorkflows(pluginDetails: PluginDetails): Promise<void> {
  const files = glob.sync(`${pluginDetails.resolve}/workflows/*.js`, {})
  await Promise.all(files.map(async (file) => import(file)))
}

/**
 * Registers a plugin's models at the right location in our container. Models
 * must inherit from BaseModel. Models are registered directly in the container.
 * Names are camelCase formatted and namespaced by the folder i.e:
 * models/example-person -> examplePersonModel
 * @param {object} pluginDetails - the plugin details including plugin options,
 *    version, id, resolved path, etc. See resolvePlugin
 * @param {object} container - the container where the services will be
 *    registered
 * @param rootDirectory
 * @param pathGlob
 * @return {void}
 */
function registerModels(
  pluginDetails: PluginDetails,
  container: MedusaContainer,
  rootDirectory: string,
  pathGlob = "/models/*.js"
): void {
  const pluginFullPathGlob = path.join(pluginDetails.resolve, pathGlob)

  const modelExtensionsMap = getModelExtensionsMap({
    directory: pluginDetails.resolve,
    pathGlob: pathGlob,
    config: { register: true },
  })

  const pluginModels = glob.sync(pluginFullPathGlob, {
    ignore: ["index.js", "index.js.map"],
  })

  const coreModelsFullGlob = path.join(__dirname, "../models/*.js")
  const coreModels = glob.sync(coreModelsFullGlob, {
    cwd: __dirname,
    ignore: ["index.js", "index.ts", "index.js.map"],
  })

  // Apply the extended models to the core models first to ensure that
  // when relationships are created, the extended models are used
  coreModels.forEach((modelPath) => {
    const loaded = require(modelPath) as
      | ClassConstructor<unknown>
      | EntitySchema

    if (loaded) {
      const name = formatRegistrationName(modelPath)
      const mappedExtensionModel = modelExtensionsMap.get(name)
      if (mappedExtensionModel) {
        const modelName = upperCaseFirst(
          formatRegistrationNameWithoutNamespace(modelPath)
        )

        loaded[modelName] = mappedExtensionModel
      }
    }
  })

  pluginModels.forEach((coreOrPluginModelPath) => {
    const loaded = require(coreOrPluginModelPath) as
      | ClassConstructor<unknown>
      | EntitySchema

    if (loaded) {
      Object.entries(loaded).map(
        ([, val]: [string, ClassConstructor<unknown> | EntitySchema]) => {
          if (typeof val === "function" || val instanceof EntitySchema) {
            const name = formatRegistrationName(coreOrPluginModelPath)

            container.register({
              [name]: asValue(val),
            })

            container.registerAdd("db_entities", asValue(val))
          }
        }
      )
    }
  })
}

/**
 * Runs all setup functions in a plugin. Setup functions are run before anything from the plugin is
 * registered to the container. This is useful for running custom build logic, fetching remote
 * configurations, etc.
 * @param pluginDetails The plugin details including plugin options, version, id, resolved path, etc.
 */
async function runSetupFunctions(pluginDetails: PluginDetails): Promise<void> {
  const files = glob.sync(`${pluginDetails.resolve}/setup/*.js`, {})
  await promiseAll(
    files.map(async (fn) => {
      const loaded = require(fn).default
      try {
        await loaded()
      } catch (err) {
        throw new Error(
          `A setup function from ${pluginDetails.name} failed. ${err}`
        )
      }
    })
  )
}

// TODO: Create unique id for each plugin
function createPluginId(name: string): string {
  return name
}

/**
 * Finds the correct path for the plugin. If it is a local plugin it will be
 * found in the plugins folder. Otherwise we will look for the plugin in the
 * installed npm packages.
 * @param {string} pluginName - the name of the plugin to find. Should match
 *    the name of the folder where the plugin is contained.
 * @return {object} the plugin details
 */
function resolvePlugin(pluginName: string): {
  resolve: string
  id: string
  name: string
  options: Record<string, unknown>
  version: string
} {
  // Only find plugins when we're not given an absolute path
  if (!existsSync(pluginName)) {
    // Find the plugin in the local plugins folder
    const resolvedPath = path.resolve(`./plugins/${pluginName}`)

    if (existsSync(resolvedPath)) {
      if (existsSync(`${resolvedPath}/package.json`)) {
        const packageJSON = JSON.parse(
          fs.readFileSync(`${resolvedPath}/package.json`, `utf-8`)
        )
        const name = packageJSON.name || pluginName
        // warnOnIncompatiblePeerDependency(name, packageJSON)

        return {
          resolve: resolvedPath,
          name,
          id: createPluginId(name),
          options: {},
          version:
            packageJSON.version || createFileContentHash(resolvedPath, `**`),
        }
      } else {
        // Make package.json a requirement for local plugins too
        throw new Error(`Plugin ${pluginName} requires a package.json file`)
      }
    }
  }

  const rootDir = path.resolve(".")

  /**
   *  Here we have an absolute path to an internal plugin, or a name of a module
   *  which should be located in node_modules.
   */
  try {
    const requireSource =
      rootDir !== null
        ? createRequireFromPath(`${rootDir}/:internal:`)
        : require

    // If the path is absolute, resolve the directory of the internal plugin,
    // otherwise resolve the directory containing the package.json
    const resolvedPath = path.dirname(
      requireSource.resolve(`${pluginName}/package.json`)
    )

    const packageJSON = JSON.parse(
      fs.readFileSync(`${resolvedPath}/package.json`, `utf-8`)
    )
    // warnOnIncompatiblePeerDependency(packageJSON.name, packageJSON)

    const computedResolvedPath =
      resolvedPath + (process.env.DEV_MODE ? "/src" : "")

    // Add support for a plugin to output the build into a dist directory
    const resolvedPathToDist = resolvedPath + "/dist"
    const isDistExist =
      resolvedPathToDist &&
      !process.env.DEV_MODE &&
      existsSync(resolvedPath + "/dist")

    return {
      resolve: isDistExist ? resolvedPathToDist : computedResolvedPath,
      id: createPluginId(packageJSON.name),
      name: packageJSON.name,
      options: {},
      version: packageJSON.version,
    }
  } catch (err) {
    throw new Error(
      `Unable to find plugin "${pluginName}". Perhaps you need to install its package?`
    )
  }
}

function createFileContentHash(path, files): string {
  return path + files
}
