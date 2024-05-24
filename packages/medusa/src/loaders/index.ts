import { createDefaultsWorkflow } from "@medusajs/core-flows"
import { ConfigModule, MedusaContainer, PluginDetails } from "@medusajs/types"
import { ContainerRegistrationKeys, promiseAll } from "@medusajs/utils"
import { asValue } from "awilix"
import { Express, NextFunction, Request, Response } from "express"
import glob from "glob"
import { createMedusaContainer } from "medusa-core-utils"
import path from "path"
import requestIp from "request-ip"
import { v4 } from "uuid"
import adminLoader from "./admin"
import apiLoader from "./api"
import loadConfig from "./config"
import expressLoader from "./express"
import featureFlagsLoader from "./feature-flags"
import { registerWorkflows } from "./helpers/register-workflows"
import { getResolvedPlugins } from "./helpers/resolve-plugins"
import { SubscriberLoader } from "./helpers/subscribers"
import Logger from "./logger"
import loadMedusaApp from "./medusa-app"
import registerPgConnection from "./pg-connection"
import { resolvePluginsLinks } from "./helpers/resolve-plugins-links"

type Options = {
  directory: string
  expressApp: Express
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
        `${pluginDetails.resolve}/subscribers/*.{ts,js,mjs,mts}`,
        {
          ignore: ["**/*.d.ts", "**/*.map"],
        }
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
  expressApp: Express,
  rootDirectory: string
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

  await adminLoader({ app: expressApp, configModule, rootDirectory })
  await subscribersLoader(plugins, container)
  await apiLoader({
    container,
    plugins,
    app: expressApp,
  })

  return shutdown
}

export async function initializeContainer(rootDirectory: string) {
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
  } = await loadMedusaApp({
    container,
    linkModules: await resolvePluginsLinks(plugins, container),
  })

  const entrypointsShutdown = await loadEntrypoints(
    plugins,
    container,
    expressApp,
    rootDirectory
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
