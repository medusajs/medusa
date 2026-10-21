import { container, MedusaAppLoader, policiesLoader } from "@medusajs/framework"
import { asValue } from "@medusajs/framework/awilix"
import { configLoader } from "@medusajs/framework/config"
import { pgConnectionLoader } from "@medusajs/framework/database"
import { featureFlagsLoader } from "@medusajs/framework/feature-flags"
import { expressLoader } from "@medusajs/framework/http"
import { JobLoader } from "@medusajs/framework/jobs"
import { LinkLoader } from "@medusajs/framework/links"
import { logger as defaultLogger } from "@medusajs/framework/logger"
import { SubscriberLoader } from "@medusajs/framework/subscribers"
import {
  ConfigModule,
  LoadedModule,
  MedusaContainer,
  PluginDetails,
} from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  getResolvedPlugins,
  GraphQLSchema,
  mergePluginModules,
  promiseAll,
  timeBoot,
  validateModuleName,
} from "@medusajs/framework/utils"
import { WorkflowLoader } from "@medusajs/framework/workflows"
import { Express, NextFunction, Request, Response } from "express"
import { join } from "path"
import requestIp from "request-ip"
import { v4 } from "uuid"
import adminLoader from "./admin"
import apiLoader from "./api"
import { loadSearchIndexes } from "./search"

type Options = {
  directory: string
  expressApp: Express
  skipLoadingEntryPoints?: boolean
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

async function subscribersLoader(
  plugins: PluginDetails[],
  container: MedusaContainer
) {
  const pluginSubscribersSourcePaths = [
    /**
     * Load subscribers from the medusa/medusa package. Remove once the medusa core is converted to a plugin
     */
    join(__dirname, "../subscribers"),
  ].concat(plugins.map((plugin) => join(plugin.resolve, "subscribers")))

  const subscriberLoader = new SubscriberLoader(
    pluginSubscribersSourcePaths,
    undefined,
    container
  )
  await subscriberLoader.load()
}

async function jobsLoader(
  plugins: PluginDetails[],
  container: MedusaContainer
) {
  const pluginJobSourcePaths = [
    /**
     * Load jobs from the medusa/medusa package. Remove once the medusa core is converted to a plugin
     */
    join(__dirname, "../jobs"),
  ].concat(plugins.map((plugin) => join(plugin.resolve, "jobs")))

  const jobLoader = new JobLoader(pluginJobSourcePaths, container)
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

  if (isWorkerMode(configModule)) {
    return async () => {}
  }

  /**
   * The scope and the ip address must be fetched before we execute any other
   * middleware
   */
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

  const [{ shutdown }] = await promiseAll([
    timeBoot("http: express and sessions", () =>
      expressLoader({
        app: expressApp,
        container,
      })
    ),
    timeBoot("http: admin", () =>
      adminLoader({ app: expressApp, configModule, rootDirectory, plugins })
    ),
    timeBoot("http: api routes", () =>
      apiLoader({
        container,
        plugins,
        app: expressApp,
      })
    ),
  ])

  return shutdown
}

export async function initializeContainer(
  rootDirectory: string,
  options?: {
    skipDbConnection?: boolean
    throwOnValidationError?: boolean
  }
): Promise<MedusaContainer> {
  const configDir = await timeBoot("config and feature flags", async () => {
    await featureFlagsLoader(rootDirectory)
    const configDir = await configLoader(rootDirectory, "medusa-config", {
      throwOnValidationError: options?.throwOnValidationError,
    })
    await featureFlagsLoader(join(__dirname, ".."))
    return configDir
  })

  // Load policies from core medusa package and project root
  await timeBoot("policies", async () => {
    await policiesLoader(join(__dirname, ".."))
    await policiesLoader(rootDirectory)
  })

  const customLogger = configDir.logger ?? defaultLogger
  container.register({
    [ContainerRegistrationKeys.LOGGER]: asValue(customLogger),
    [ContainerRegistrationKeys.REMOTE_QUERY]: asValue(null),
  })

  if (!options?.skipDbConnection) {
    await timeBoot("database connection", () => pgConnectionLoader())
  }

  return container
}

export default async ({
  directory: rootDirectory,
  expressApp,
  skipLoadingEntryPoints = false,
}: Options): Promise<{
  container: MedusaContainer
  app: Express
  modules: Record<string, LoadedModule | LoadedModule[]>
  shutdown: () => Promise<void>
  gqlSchema?: GraphQLSchema
}> => {
  const container = await timeBoot("container", () =>
    initializeContainer(rootDirectory)
  )
  const configModule = container.resolve(
    ContainerRegistrationKeys.CONFIG_MODULE
  )
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  const plugins = await getResolvedPlugins(rootDirectory, configModule, true)
  mergePluginModules(configModule, plugins, rootDirectory)

  Object.keys(configModule.modules ?? {}).forEach((key) => {
    validateModuleName(key)
  })

  const linksSourcePaths = plugins.map((plugin) =>
    join(plugin.resolve, "links")
  )
  await timeBoot("links", () => new LinkLoader(linksSourcePaths, logger).load())

  // Before the app boots: the Search Module resolves the definitions when it is
  // constructed, and the seed on application start only fills indexes it knows
  // about. A no-op unless the module is registered.
  await timeBoot("search index definitions", () =>
    loadSearchIndexes({ plugins, configModule, logger })
  )

  // Load policies from all plugins (rootDirectory already loaded in initializeContainer)
  for (const plugin of plugins) {
    await policiesLoader(plugin.resolve)
  }

  const {
    onApplicationStart,
    onApplicationShutdown,
    onApplicationPrepareShutdown,
    modules,
    gqlSchema,
  } = await timeBoot("modules", () => new MedusaAppLoader().load())

  const workflowsSourcePaths = plugins.map((p) => join(p.resolve, "workflows"))
  const workflowLoader = new WorkflowLoader(workflowsSourcePaths, container)
  await timeBoot("workflows", () => workflowLoader.load())

  // Subscribers should be loaded no matter the worker mode, simply they will never handle anything
  // since worker/shared instances only will have a running worker to process events.
  await timeBoot("subscribers", () => subscribersLoader(plugins, container))

  if (shouldLoadBackgroundProcessors(configModule)) {
    await timeBoot("jobs", () => jobsLoader(plugins, container))
  }

  const entrypointsShutdown = skipLoadingEntryPoints
    ? () => {}
    : await timeBoot("http (express, api routes, admin)", () =>
        loadEntrypoints(plugins, container, expressApp, rootDirectory)
      )

  // Import only the defaults workflow: the package root evaluates every
  // workflow in core-flows, which isn't needed to boot.
  const { createDefaultsWorkflow } = await import(
    "@medusajs/core-flows/defaults"
  )
  await timeBoot("defaults workflow", () =>
    createDefaultsWorkflow(container).run()
  )
  await timeBoot("application start hooks", () => onApplicationStart())

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
    modules,
    gqlSchema,
  }
}
