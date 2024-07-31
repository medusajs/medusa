import { createDefaultsWorkflow } from "@medusajs/core-flows"
import { ConfigModule, MedusaContainer, PluginDetails } from "@medusajs/types"
import { ContainerRegistrationKeys, promiseAll } from "@medusajs/utils"
import { asValue } from "awilix"
import { Express, NextFunction, Request, Response } from "express"
import { join } from "path"
import requestIp from "request-ip"
import { v4 } from "uuid"
import adminLoader from "./admin"
import apiLoader from "./api"
import {
  configLoader,
  container,
  expressLoader,
  featureFlagsLoader,
  JobLoader,
  logger,
  pgConnectionLoader,
  SubscriberLoader,
} from "@medusajs/framework"
import { registerWorkflows } from "./helpers/register-workflows"
import { getResolvedPlugins } from "./helpers/resolve-plugins"
import { resolvePluginsLinks } from "./helpers/resolve-plugins-links"
import loadMedusaApp from "./medusa-app"

type Options = {
  directory: string
  expressApp: Express
}

const isWorkerMode = (configModule) => {
  return configModule.projectConfig.workerMode === "worker"
}

const shouldLoadBackgroundProcessors = (configModule) => {
  return (
    configModule.projectConfig.workerMode === "worker" ||
    configModule.projectConfig.workerMode === "shared"
  )
}

async function subscribersLoader(plugins: PluginDetails[]) {
  /**
   * Load subscribers from the medusa/medusa package
   */
  await new SubscriberLoader(join(__dirname, "../subscribers")).load()

  /**
   * Load subscribers from all the plugins.
   */
  await Promise.all(
    plugins.map(async (pluginDetails) => {
      await new SubscriberLoader(
        join(pluginDetails.resolve, "subscribers"),
        pluginDetails.options
      ).load()
    })
  )
}

async function jobsLoader(plugins: PluginDetails[]) {
  const pluginJobSourcePaths = [
    /**
     * Load jobs from the medusa/medusa package. Remove once the medusa core is converted to a plugin
     */
    join(__dirname, "../jobs"),
  ].concat(plugins.map((plugin) => join(plugin.resolve, "jobs")))

  const jobLoader = new JobLoader(pluginJobSourcePaths)
  await jobLoader.load()
}

async function loadEntrypoints(
  plugins: PluginDetails[],
  container: MedusaContainer,
  expressApp: Express,
  rootDirectory: string
) {
  const configModule: ConfigModule = container.resolve(
    ContainerRegistrationKeys.CONFIG_MODULE
  )

  if (shouldLoadBackgroundProcessors(configModule)) {
    await subscribersLoader(plugins)
    await jobsLoader(plugins)
  }

  if (isWorkerMode(configModule)) {
    return async () => {}
  }

  const { shutdown } = await expressLoader({
    app: expressApp,
  })

  expressApp.use((req: Request, res: Response, next: NextFunction) => {
    req.scope = container.createScope() as MedusaContainer
    req.requestId = (req.headers["x-request-id"] as string) ?? v4()
    next()
  })

  // Add additional information to context of request
  expressApp.use((req: Request, res: Response, next: NextFunction) => {
    const ipAddress = requestIp.getClientIp(req) as string
    ;(req as any).request_context = {
      ip_address: ipAddress,
    }
    next()
  })

  await adminLoader({ app: expressApp, configModule, rootDirectory })
  await apiLoader({
    container,
    plugins,
    app: expressApp,
  })

  return shutdown
}

export async function initializeContainer(
  rootDirectory: string
): Promise<MedusaContainer> {
  const configExt = process[Symbol.for("ts-node.register.instance")]
    ? ".ts"
    : ".js"

  configLoader(rootDirectory, `medusa-config${configExt}`)
  await featureFlagsLoader(join(__dirname, "feature-flags"))

  container.register({
    [ContainerRegistrationKeys.LOGGER]: asValue(logger),
    [ContainerRegistrationKeys.REMOTE_QUERY]: asValue(null),
  })

  pgConnectionLoader()
  return container
}

export default async ({
  directory: rootDirectory,
  expressApp,
}: Options): Promise<{
  container: MedusaContainer
  app: Express
  shutdown: () => Promise<void>
}> => {
  const container = await initializeContainer(rootDirectory)
  const configModule = container.resolve(
    ContainerRegistrationKeys.CONFIG_MODULE
  )

  const plugins = getResolvedPlugins(rootDirectory, configModule, true) || []
  const pluginLinks = await resolvePluginsLinks(plugins, container)

  const {
    onApplicationStart,
    onApplicationShutdown,
    onApplicationPrepareShutdown,
  } = await loadMedusaApp({
    container,
    linkModules: pluginLinks,
  })

  await registerWorkflows(plugins)
  const entrypointsShutdown = await loadEntrypoints(
    plugins,
    container,
    expressApp,
    rootDirectory
  )
  await createDefaultsWorkflow(container).run()
  await onApplicationStart()

  const shutdown = async () => {
    const pgConnection = container.resolve(
      ContainerRegistrationKeys.PG_CONNECTION
    )

    await onApplicationPrepareShutdown()
    await onApplicationShutdown()

    await promiseAll([
      container.dispose(),
      // @ts-expect-error "Do we want to call `client.destroy` "
      pgConnection?.context?.destroy(),
      entrypointsShutdown(),
    ])
  }

  return {
    container,
    app: expressApp,
    shutdown,
  }
}
