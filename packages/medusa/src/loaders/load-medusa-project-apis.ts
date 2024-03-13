import { promiseAll } from "@medusajs/utils"
import { aliasTo, asFunction } from "awilix"
import { Express } from "express"
import glob from "glob"
import _ from "lodash"
import { trackInstallation } from "medusa-telemetry"
import { EOL } from "os"
import path from "path"
import {
  AbstractBatchJobStrategy,
  AbstractCartCompletionStrategy,
  AbstractPriceSelectionStrategy,
  AbstractTaxCalculationStrategy,
} from "../interfaces"
import { ConfigModule, Logger, MedusaContainer } from "../types/global"
import { formatRegistrationName } from "../utils/format-registration-name"
import ScheduledJobsLoader from "./helpers/jobs"
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
      await registerApi(pluginDetails, app, container, configModule, activityId)
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
  const extensionDirectory = path.join(rootDirectory, extensionDirectoryPath)
  return [
    {
      resolve: extensionDirectory,
      name: MEDUSA_PROJECT_NAME,
      id: createPluginId(MEDUSA_PROJECT_NAME),
      options: configModule,
      version: createFileContentHash(process.cwd(), `**`),
    },
  ]
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
      case AbstractTaxCalculationStrategy.isTaxCalculationStrategy(
        module.prototype
      ): {
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

      case AbstractCartCompletionStrategy.isCartCompletionStrategy(
        module.prototype
      ): {
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

      case AbstractBatchJobStrategy.isBatchJobStrategy(module.prototype): {
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

      case AbstractPriceSelectionStrategy.isPriceSelectionStrategy(
        module.prototype
      ): {
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

/**
 * Registers the plugin's api routes.
 */
async function registerApi(
  pluginDetails: PluginDetails,
  app: Express,
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

  return app
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
  await new SubscriberLoader(
    path.join(pluginDetails.resolve, "subscribers"),
    container,
    pluginDetails.options,
    activityId
  ).load()
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

function createFileContentHash(path, files): string {
  return path + files
}
