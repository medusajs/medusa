import { promiseAll } from "@medusajs/utils"
import { Express } from "express"
import glob from "glob"
import { trackInstallation } from "medusa-telemetry"
import { EOL } from "os"
import path from "path"
import { ConfigModule, Logger, MedusaContainer } from "../types/global"
import { getResolvedPlugins } from "./helpers/resolve-plugins"
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

  const shouldStartAPI = configModule.projectConfig.worker_mode !== "worker"

  await promiseAll(
    resolved.map(async (pluginDetails) => {
      if (shouldStartAPI) {
        await registerApi(
          pluginDetails,
          app,
          container,
          configModule,
          activityId
        )
      }
      await registerSubscribers(pluginDetails, container, activityId)
    })
  )

  await promiseAll(
    resolved.map(async (pluginDetails) => runLoaders(pluginDetails, container))
  )

  if (configModule.projectConfig.redis_url) {
    await Promise.all(
      resolved.map(async (pluginDetails) => {
        // await registerScheduledJobs(pluginDetails, container)
        // TODO: Decide how scheduled jobs will be loaded and handled
      })
    )
  } else {
    logger.warn(
      "You don't have Redis configured. Scheduled jobs will not be enabled."
    )
  }

  resolved.forEach((plugin) => trackInstallation(plugin.name, "plugin"))
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
