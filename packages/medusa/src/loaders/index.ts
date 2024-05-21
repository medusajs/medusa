import { createDefaultsWorkflow } from "@medusajs/core-flows"
import { ConfigModule, MedusaContainer } from "@medusajs/types"
import { ContainerRegistrationKeys, promiseAll } from "@medusajs/utils"
import { asValue } from "awilix"
import { Express, NextFunction, Request, Response } from "express"
import { createMedusaContainer } from "medusa-core-utils"
import requestIp from "request-ip"
import { v4 } from "uuid"
import path from "path"
import adminLoader from "./admin"
import apiLoader from "./api"
import loadConfig from "./config"
import expressLoader from "./express"
import featureFlagsLoader from "./feature-flags"
import { registerWorkflows } from "./helpers/register-workflows"
import Logger from "./logger"
import loadModules from "./medusa-app"
import registerPgConnection from "./pg-connection"
import { SubscriberLoader } from "./helpers/subscribers"
import { getResolvedPlugins } from "./helpers/resolve-plugins"
import { PluginDetails } from "@medusajs/types"
import glob from "glob"

type Options = {
  directory: string
  expressApp: Express
  isTest: boolean
}

const isWorkerMode = (configModule) => {
  return configModule.projectConfig.worker_mode === "worker"
}

async function subscribersLoader(
  plugins: PluginDetails[],
  container: MedusaContainer
) {
  /**
   * Load subscribers from the medusa/medusa package
   */
  await new SubscriberLoader(
    path.join(__dirname, "../subscribers"),
    container
  ).load()

  /**
   * Load subscribers from all the plugins.
   */
  await Promise.all(
    plugins.map(async (pluginDetails) => {
      const files = glob.sync(
        `${pluginDetails.resolve}/subscribers/*(.js|.ts|.mjs)`,
        {}
      )
      return Promise.all(
        files.map(async (file) => new SubscriberLoader(file, container).load())
      )
    })
  )
}

async function loadEntrypoints(
  plugins: PluginDetails[],
  container: MedusaContainer,
  expressApp: Express
) {
  const configModule: ConfigModule = container.resolve(
    ContainerRegistrationKeys.CONFIG_MODULE
  )

  if (isWorkerMode(configModule)) {
    return async () => {}
  }

  const { shutdown } = await expressLoader({ app: expressApp, configModule })
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

  await adminLoader({ app: expressApp, adminConfig: configModule.admin })
  await subscribersLoader(plugins, container)
  await apiLoader({
    container,
    plugins,
    app: expressApp,
  })

  return shutdown
}

async function initializeContainer(rootDirectory: string) {
  const container = createMedusaContainer()
  const configModule = loadConfig(rootDirectory)
  const featureFlagRouter = featureFlagsLoader(configModule, Logger)

  container.register({
    [ContainerRegistrationKeys.LOGGER]: asValue(Logger),
    [ContainerRegistrationKeys.FEATURE_FLAG_ROUTER]: asValue(featureFlagRouter),
    [ContainerRegistrationKeys.CONFIG_MODULE]: asValue(configModule),
    [ContainerRegistrationKeys.REMOTE_QUERY]: asValue(null),
  })

  await registerPgConnection({ container, configModule })
  return container
}

export default async ({
  directory: rootDirectory,
  expressApp,
}: Options): Promise<{
  container: MedusaContainer
  app: Express
  shutdown: () => Promise<void>
  prepareShutdown: () => Promise<void>
}> => {
  const container = await initializeContainer(rootDirectory)
  const configModule = container.resolve(
    ContainerRegistrationKeys.CONFIG_MODULE
  )

  const plugins = getResolvedPlugins(rootDirectory, configModule, true) || []
  await registerWorkflows(plugins)

  const {
    onApplicationShutdown: medusaAppOnApplicationShutdown,
    onApplicationPrepareShutdown: medusaAppOnApplicationPrepareShutdown,
  } = await loadModules({
    container,
  })

  const entrypointsShutdown = await loadEntrypoints(
    plugins,
    container,
    expressApp
  )
  await createDefaultsWorkflow(container).run()

  const shutdown = async () => {
    const pgConnection = container.resolve(
      ContainerRegistrationKeys.PG_CONNECTION
    )
    await medusaAppOnApplicationShutdown()

    await promiseAll([
      container.dispose(),
      pgConnection?.context?.destroy(),
      entrypointsShutdown(),
      medusaAppOnApplicationShutdown(),
    ])
  }

  return {
    container,
    app: expressApp,
    shutdown,
    prepareShutdown: medusaAppOnApplicationPrepareShutdown,
  }
}
