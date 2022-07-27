import loadConfig from "./config"
import "reflect-metadata"
import Logger from "./logger"
import apiLoader from "./api"
import featureFlagsLoader from "./feature-flags"
import databaseLoader from "./database"
import defaultsLoader from "./defaults"
import expressLoader from "./express"
import modelsLoader from "./models"
import passportLoader from "./passport"
import pluginsLoader, { registerPluginModels } from "./plugins"
import redisLoader from "./redis"
import repositoriesLoader from "./repositories"
import requestIp from "request-ip"
import searchIndexLoader from "./search-index"
import servicesLoader from "./services"
import strategiesLoader from "./strategies"
import subscribersLoader from "./subscribers"
import { ClassOrFunctionReturning } from "awilix/lib/container"
import { Connection, getManager } from "typeorm"
import { Express, NextFunction, Request, Response } from "express"
import {
  asFunction,
  asValue,
  AwilixContainer,
  createContainer,
  Resolver,
} from "awilix"
import { track } from "medusa-telemetry"
import { MedusaContainer } from "../types/global"

type Options = {
  directory: string
  expressApp: Express
  isTest: boolean
}

export default async ({
  directory: rootDirectory,
  expressApp,
  isTest,
}: Options): Promise<{
  container: MedusaContainer
  dbConnection: Connection
  app: Express
}> => {
  const configModule = loadConfig(rootDirectory)

  const container = createContainer() as MedusaContainer
  container.register("configModule", asValue(configModule))

  container.registerAdd = function (
    this: MedusaContainer,
    name: string,
    registration: typeof asFunction | typeof asValue
  ) {
    const storeKey = name + "_STORE"

    if (this.registrations[storeKey] === undefined) {
      this.register(storeKey, asValue([] as Resolver<unknown>[]))
    }
    const store = this.resolve(storeKey) as (
      | ClassOrFunctionReturning<unknown>
      | Resolver<unknown>
    )[]

    if (this.registrations[name] === undefined) {
      this.register(name, asArray(store))
    }
    store.unshift(registration)

    return this
  }.bind(container)

  // Add additional information to context of request
  expressApp.use((req: Request, res: Response, next: NextFunction) => {
    const ipAddress = requestIp.getClientIp(req) as string
    ;(req as any).request_context = {
      ip_address: ipAddress,
    }
    next()
  })

  const featureFlagRouter = featureFlagsLoader(configModule, Logger)

  container.register({
    logger: asValue(Logger),
    featureFlagRouter: asValue(featureFlagRouter),
  })

  await redisLoader({ container, configModule, logger: Logger })

  const modelsActivity = Logger.activity("Initializing models")
  track("MODELS_INIT_STARTED")
  modelsLoader({ container })
  const mAct = Logger.success(modelsActivity, "Models initialized") || {}
  track("MODELS_INIT_COMPLETED", { duration: mAct.duration })

  const pmActivity = Logger.activity("Initializing plugin models")
  track("PLUGIN_MODELS_INIT_STARTED")
  await registerPluginModels({
    rootDirectory,
    container,
    configModule,
  })
  const pmAct = Logger.success(pmActivity, "Plugin models initialized") || {}
  track("PLUGIN_MODELS_INIT_COMPLETED", { duration: pmAct.duration })

  const repoActivity = Logger.activity("Initializing repositories")
  track("REPOSITORIES_INIT_STARTED")
  repositoriesLoader({ container })
  const rAct = Logger.success(repoActivity, "Repositories initialized") || {}
  track("REPOSITORIES_INIT_COMPLETED", { duration: rAct.duration })

  const dbActivity = Logger.activity("Initializing database")
  track("DATABASE_INIT_STARTED")
  const dbConnection = await databaseLoader({ container, configModule })
  const dbAct = Logger.success(dbActivity, "Database initialized") || {}
  track("DATABASE_INIT_COMPLETED", { duration: dbAct.duration })

  container.register({ manager: asValue(dbConnection.manager) })

  const stratActivity = Logger.activity("Initializing strategies")
  track("STRATEGIES_INIT_STARTED")
  strategiesLoader({ container, configModule, isTest })
  const stratAct = Logger.success(stratActivity, "Strategies initialized") || {}
  track("STRATEGIES_INIT_COMPLETED", { duration: stratAct.duration })

  const servicesActivity = Logger.activity("Initializing services")
  track("SERVICES_INIT_STARTED")
  servicesLoader({ container, configModule, isTest })
  const servAct = Logger.success(servicesActivity, "Services initialized") || {}
  track("SERVICES_INIT_COMPLETED", { duration: servAct.duration })

  const expActivity = Logger.activity("Initializing express")
  track("EXPRESS_INIT_STARTED")
  await expressLoader({ app: expressApp, configModule })
  await passportLoader({ app: expressApp, container, configModule })
  const exAct = Logger.success(expActivity, "Express intialized") || {}
  track("EXPRESS_INIT_COMPLETED", { duration: exAct.duration })

  // Add the registered services to the request scope
  expressApp.use((req: Request, res: Response, next: NextFunction) => {
    container.register({ manager: asValue(getManager()) })
    ;(req as any).scope = container.createScope()
    next()
  })

  const pluginsActivity = Logger.activity("Initializing plugins")
  track("PLUGINS_INIT_STARTED")
  await pluginsLoader({
    container,
    rootDirectory,
    configModule,
    app: expressApp,
    activityId: pluginsActivity,
  })
  const pAct = Logger.success(pluginsActivity, "Plugins intialized") || {}
  track("PLUGINS_INIT_COMPLETED", { duration: pAct.duration })

  const subActivity = Logger.activity("Initializing subscribers")
  track("SUBSCRIBERS_INIT_STARTED")
  subscribersLoader({ container })
  const subAct = Logger.success(subActivity, "Subscribers initialized") || {}
  track("SUBSCRIBERS_INIT_COMPLETED", { duration: subAct.duration })

  const apiActivity = Logger.activity("Initializing API")
  track("API_INIT_STARTED")
  await apiLoader({ container, app: expressApp, configModule })
  const apiAct = Logger.success(apiActivity, "API initialized") || {}
  track("API_INIT_COMPLETED", { duration: apiAct.duration })

  const defaultsActivity = Logger.activity("Initializing defaults")
  track("DEFAULTS_INIT_STARTED")
  await defaultsLoader({ container })
  const dAct = Logger.success(defaultsActivity, "Defaults initialized") || {}
  track("DEFAULTS_INIT_COMPLETED", { duration: dAct.duration })

  const searchActivity = Logger.activity("Initializing search engine indexing")
  track("SEARCH_ENGINE_INDEXING_STARTED")
  await searchIndexLoader({ container })
  const searchAct = Logger.success(searchActivity, "Indexing event emitted") || {}
  track("SEARCH_ENGINE_INDEXING_COMPLETED", { duration: searchAct.duration })

  return { container, dbConnection, app: expressApp }
}

function asArray(
  resolvers: (ClassOrFunctionReturning<unknown> | Resolver<unknown>)[]
): { resolve: (container: AwilixContainer) => unknown[] } {
  return {
    resolve: (container: AwilixContainer) =>
      resolvers.map((resolver) => container.build(resolver)),
  }
}
