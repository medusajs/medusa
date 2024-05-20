import { createDefaultsWorkflow } from "@medusajs/core-flows"
import { ConfigModule } from "@medusajs/types"
import { ContainerRegistrationKeys, promiseAll } from "@medusajs/utils"
import { asValue } from "awilix"
import { Express, NextFunction, Request, Response } from "express"
import { createMedusaContainer } from "medusa-core-utils"
import requestIp from "request-ip"
import { v4 } from "uuid"
import path from "path"
import { MedusaContainer } from "../types/global"
import adminLoader from "./admin"
import apiLoader from "./api"
import loadConfig from "./config"
import expressLoader from "./express"
import featureFlagsLoader from "./feature-flags"
import { registerProjectWorkflows } from "./helpers/register-workflows"
import Logger from "./logger"
import loadMedusaApp from "./medusa-app"
import pgConnectionLoader from "./pg-connection"
import { SubscriberLoader } from "./helpers/subscribers"

type Options = {
  directory: string
  expressApp: Express
}

const isWorkerMode = (configModule) => {
  return configModule.projectConfig.worker_mode === "worker"
}

async function subscribersLoader(container) {
  const subscribersPath = path.join(__dirname, "../subscribers")
  await new SubscriberLoader(subscribersPath, container).load()
}

async function loadEntrypoints(
  configModule,
  container,
  expressApp,
  featureFlagRouter
) {
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

  await adminLoader({ app: expressApp, configModule })
  await subscribersLoader(container)
  await apiLoader({
    container,
    app: expressApp,
    configModule,
    featureFlagRouter,
  })

  return shutdown
}

export default async ({
  directory: rootDirectory,
  expressApp,
}: Options): Promise<{
  configModule: ConfigModule
  container: MedusaContainer
  app: Express
  pgConnection: unknown
  shutdown: () => Promise<void>
  prepareShutdown: () => Promise<void>
}> => {
  const configModule = loadConfig(rootDirectory)
  const featureFlagRouter = featureFlagsLoader(configModule, Logger)
  const container = createMedusaContainer()
  const pgConnection = await pgConnectionLoader({ container, configModule })
  container.register({
    [ContainerRegistrationKeys.LOGGER]: asValue(Logger),
    [ContainerRegistrationKeys.FEATURE_FLAG_ROUTER]: asValue(featureFlagRouter),
    [ContainerRegistrationKeys.CONFIG_MODULE]: asValue(configModule),
    [ContainerRegistrationKeys.REMOTE_QUERY]: asValue(null),
  })

  // Workflows are registered before the app to allow modules to run workflows as part of bootstrapping
  //  e.g. the workflow engine will resume workflows that were running when the server was shut down
  await registerProjectWorkflows({ rootDirectory, configModule })

  const {
    onApplicationShutdown: medusaAppOnApplicationShutdown,
    onApplicationPrepareShutdown: medusaAppOnApplicationPrepareShutdown,
  } = await loadMedusaApp({
    configModule,
    container,
  })

  const entrypointsShutdown = await loadEntrypoints(
    configModule,
    container,
    expressApp,
    featureFlagRouter
  )

  await createDefaultsWorkflow(container).run()

  const shutdown = async () => {
    await medusaAppOnApplicationShutdown()

    await promiseAll([
      container.dispose(),
      pgConnection?.context?.destroy(),
      entrypointsShutdown(),
      medusaAppOnApplicationShutdown(),
    ])
  }

  return {
    configModule,
    container,
    app: expressApp,
    pgConnection,
    shutdown,
    prepareShutdown: medusaAppOnApplicationPrepareShutdown,
  }
}
