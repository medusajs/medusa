import {
  InternalModuleDeclaration,
  ModulesDefinition,
} from "@medusajs/modules-sdk"
import { MODULE_RESOURCE_TYPE } from "@medusajs/types"
import { Express, NextFunction, Request, Response } from "express"

import databaseLoader, { dataSource } from "./database"
import pluginsLoader, { registerPluginModels } from "./plugins"

import { ContainerRegistrationKeys, isString } from "@medusajs/utils"
import { asValue } from "awilix"
import { createMedusaContainer } from "medusa-core-utils"
import { track } from "medusa-telemetry"
import { EOL } from "os"
import requestIp from "request-ip"
import { Connection } from "typeorm"
import { MedusaContainer } from "../types/global"
import apiLoader from "./api"
import loadConfig from "./config"
import defaultsLoader from "./defaults"
import expressLoader from "./express"
import featureFlagsLoader from "./feature-flags"
import Logger from "./logger"
import loadMedusaApp, { mergeDefaultModules } from "./medusa-app"
import modelsLoader from "./models"
import passportLoader from "./passport"
import pgConnectionLoader from "./pg-connection"
import redisLoader from "./redis"
import repositoriesLoader from "./repositories"
import searchIndexLoader from "./search-index"
import servicesLoader from "./services"
import strategiesLoader from "./strategies"
import subscribersLoader from "./subscribers"

type Options = {
  directory: string
  expressApp: Express
  isTest: boolean
}

async function loadLegacyModulesEntities(configModules, container) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  for (const [moduleName, moduleConfig] of Object.entries(configModules)) {
    const definition = ModulesDefinition[moduleName]

    if (!definition.isLegacy) {
      continue
    }

    let modulePath = isString(moduleConfig)
      ? moduleConfig
      : (moduleConfig as InternalModuleDeclaration).resolve ??
        (definition.defaultPackage as string)

    const resources = isString(moduleConfig)
      ? (definition.defaultModuleDeclaration as InternalModuleDeclaration)
          .resources
      : (moduleConfig as InternalModuleDeclaration).resources ??
        (definition.defaultModuleDeclaration as InternalModuleDeclaration)
          .resources

    if (resources === MODULE_RESOURCE_TYPE.SHARED) {
      if (!modulePath) {
        logger.warn(`Unable to load module entities for ${moduleName}`)
        continue
      }

      const module = await import(modulePath)

      if (module.default?.models) {
        module.default.models.map((model) =>
          container.registerAdd("db_entities", asValue(model))
        )
      }
    }
  }
}

export default async ({
  directory: rootDirectory,
  expressApp,
  isTest,
}: Options): Promise<{
  container: MedusaContainer
  dbConnection: Connection
  app: Express
  pgConnection: unknown
}> => {
  const configModule = loadConfig(rootDirectory)

  const container = createMedusaContainer()
  container.register(
    ContainerRegistrationKeys.CONFIG_MODULE,
    asValue(configModule)
  )

  // Add additional information to context of request
  expressApp.use((req: Request, res: Response, next: NextFunction) => {
    const ipAddress = requestIp.getClientIp(req) as string
    ;(req as any).request_context = {
      ip_address: ipAddress,
    }
    next()
  })

  const featureFlagRouter = featureFlagsLoader(configModule, Logger)
  track("FEATURE_FLAGS_LOADED")

  container.register({
    [ContainerRegistrationKeys.LOGGER]: asValue(Logger),
    featureFlagRouter: asValue(featureFlagRouter),
  })

  await redisLoader({ container, configModule, logger: Logger })

  const modelsActivity = Logger.activity(`Initializing models${EOL}`)
  track("MODELS_INIT_STARTED")
  modelsLoader({ container, rootDirectory })
  const mAct = Logger.success(modelsActivity, "Models initialized") || {}
  track("MODELS_INIT_COMPLETED", { duration: mAct.duration })

  const pmActivity = Logger.activity(`Initializing plugin models${EOL}`)
  track("PLUGIN_MODELS_INIT_STARTED")
  await registerPluginModels({
    rootDirectory,
    container,
    configModule,
  })
  const pmAct = Logger.success(pmActivity, "Plugin models initialized") || {}
  track("PLUGIN_MODELS_INIT_COMPLETED", { duration: pmAct.duration })

  const stratActivity = Logger.activity(`Initializing strategies${EOL}`)
  track("STRATEGIES_INIT_STARTED")
  strategiesLoader({ container, configModule, isTest })
  const stratAct = Logger.success(stratActivity, "Strategies initialized") || {}
  track("STRATEGIES_INIT_COMPLETED", { duration: stratAct.duration })

  const pgConnection = await pgConnectionLoader({ container, configModule })

  const configModules = mergeDefaultModules(configModule.modules)
  await loadLegacyModulesEntities(configModules, container)

  const dbActivity = Logger.activity(`Initializing database${EOL}`)
  track("DATABASE_INIT_STARTED")
  const dbConnection = await databaseLoader({
    container,
    configModule,
  })
  const dbAct = Logger.success(dbActivity, "Database initialized") || {}
  track("DATABASE_INIT_COMPLETED", { duration: dbAct.duration })

  const repoActivity = Logger.activity(`Initializing repositories${EOL}`)
  track("REPOSITORIES_INIT_STARTED")
  repositoriesLoader({ container })
  const rAct = Logger.success(repoActivity, "Repositories initialized") || {}
  track("REPOSITORIES_INIT_COMPLETED", { duration: rAct.duration })

  container.register({
    [ContainerRegistrationKeys.MANAGER]: asValue(dataSource.manager),
  })

  container.register("remoteQuery", asValue(null)) // ensure remoteQuery is always registered

  const servicesActivity = Logger.activity(`Initializing services${EOL}`)
  track("SERVICES_INIT_STARTED")
  servicesLoader({ container, configModule, isTest })
  const servAct = Logger.success(servicesActivity, "Services initialized") || {}
  track("SERVICES_INIT_COMPLETED", { duration: servAct.duration })

  const modulesActivity = Logger.activity(`Initializing modules${EOL}`)
  track("MODULES_INIT_STARTED")

  // Move before services init once all modules are migrated and do not rely on core resources anymore
  await loadMedusaApp({
    configModule,
    container,
  })

  const modAct = Logger.success(modulesActivity, "Modules initialized") || {}
  track("MODULES_INIT_COMPLETED", { duration: modAct.duration })

  const expActivity = Logger.activity(`Initializing express${EOL}`)
  track("EXPRESS_INIT_STARTED")
  await expressLoader({ app: expressApp, configModule })
  await passportLoader({ app: expressApp, configModule })
  const exAct = Logger.success(expActivity, "Express intialized") || {}
  track("EXPRESS_INIT_COMPLETED", { duration: exAct.duration })

  // Add the registered services to the request scope
  expressApp.use((req: Request, res: Response, next: NextFunction) => {
    container.register({ manager: asValue(dataSource.manager) })
    ;(req as any).scope = container.createScope()
    next()
  })

  const pluginsActivity = Logger.activity(`Initializing plugins${EOL}`)
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

  const subActivity = Logger.activity(`Initializing subscribers${EOL}`)
  track("SUBSCRIBERS_INIT_STARTED")
  subscribersLoader({ container })
  const subAct = Logger.success(subActivity, "Subscribers initialized") || {}
  track("SUBSCRIBERS_INIT_COMPLETED", { duration: subAct.duration })

  const apiActivity = Logger.activity(`Initializing API${EOL}`)
  track("API_INIT_STARTED")
  await apiLoader({ container, app: expressApp, configModule })
  const apiAct = Logger.success(apiActivity, "API initialized") || {}
  track("API_INIT_COMPLETED", { duration: apiAct.duration })

  const defaultsActivity = Logger.activity(`Initializing defaults${EOL}`)
  track("DEFAULTS_INIT_STARTED")
  await defaultsLoader({ container })
  const dAct = Logger.success(defaultsActivity, "Defaults initialized") || {}
  track("DEFAULTS_INIT_COMPLETED", { duration: dAct.duration })

  const searchActivity = Logger.activity(
    `Initializing search engine indexing${EOL}`
  )
  track("SEARCH_ENGINE_INDEXING_STARTED")
  await searchIndexLoader({ container })
  const searchAct =
    Logger.success(searchActivity, "Indexing event emitted") || {}
  track("SEARCH_ENGINE_INDEXING_COMPLETED", { duration: searchAct.duration })

  return {
    container,
    dbConnection,
    app: expressApp,
    pgConnection,
  }
}
