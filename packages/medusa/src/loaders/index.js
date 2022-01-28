import { asValue, createContainer } from "awilix"
import { getConfigFile } from "medusa-core-utils"
import { track } from "medusa-telemetry"
import "reflect-metadata"
import requestIp from "request-ip"
import { getManager } from "typeorm"
import apiLoader from "./api"
import databaseLoader from "./database"
import defaultsLoader from "./defaults"
import expressLoader from "./express"
import Logger from "./logger"
import modelsLoader from "./models"
import passportLoader from "./passport"
import pluginsLoader, { registerPluginModels } from "./plugins"
import redisLoader from "./redis"
import repositoriesLoader from "./repositories"
import searchIndexLoader from "./search-index"
import servicesLoader from "./services"
import strategiesLoader from "./strategies"
import subscribersLoader from "./subscribers"

export default async ({ directory: rootDirectory, expressApp, isTest }) => {
  const { configModule } = getConfigFile(rootDirectory, `medusa-config`)

  const container = createContainer()
  container.registerAdd = function (name, registration) {
    const storeKey = name + "_STORE"

    if (this.registrations[storeKey] === undefined) {
      this.register(storeKey, asValue([]))
    }
    const store = this.resolve(storeKey)

    if (this.registrations[name] === undefined) {
      this.register(name, asArray(store))
    }
    store.unshift(registration)

    return this
  }.bind(container)

  // Add additional information to context of request
  expressApp.use((req, res, next) => {
    const ipAddress = requestIp.getClientIp(req)

    const context = {
      ip_address: ipAddress,
    }

    req.request_context = context
    next()
  })

  container.register({
    logger: asValue(Logger),
  })

  await redisLoader({ container, configModule, logger: Logger })

  const modelsActivity = Logger.activity("Initializing models")
  track("MODELS_INIT_STARTED")
  modelsLoader({ container, activityId: modelsActivity, isTest })
  const mAct = Logger.success(modelsActivity, "Models initialized") || {}
  track("MODELS_INIT_COMPLETED", { duration: mAct.duration })

  const pmActivity = Logger.activity("Initializing plugin models")
  track("PLUGIN_MODELS_INIT_STARTED")
  await registerPluginModels({
    rootDirectory,
    container,
    activityId: pmActivity,
  })
  const pmAct = Logger.success(pmActivity, "Plugin models initialized") || {}
  track("PLUGIN_MODELS_INIT_COMPLETED", { duration: pmAct.duration })

  const repoActivity = Logger.activity("Initializing repositories")
  track("REPOSITORIES_INIT_STARTED")
  repositoriesLoader({ container, activityId: repoActivity, isTest }) || {}
  const rAct = Logger.success(repoActivity, "Repositories initialized") || {}
  track("REPOSITORIES_INIT_COMPLETED", { duration: rAct.duration })

  const dbActivity = Logger.activity("Initializing database")
  track("DATABASE_INIT_STARTED")
  const dbConnection = await databaseLoader({
    container,
    configModule,
    activityId: dbActivity,
    isTest,
  })
  const dbAct = Logger.success(dbActivity, "Database initialized") || {}
  track("DATABASE_INIT_COMPLETED", { duration: dbAct.duration })

  container.register({
    manager: asValue(dbConnection.manager),
  })

  const stratActivity = Logger.activity("Initializing strategies")
  track("STRATEGIES_INIT_STARTED")
  strategiesLoader({
    container,
    configModule,
    activityId: stratActivity,
    isTest,
  })
  const stratAct = Logger.success(stratActivity, "Strategies initialized") || {}
  track("STRATEGIES_INIT_COMPLETED", { duration: stratAct.duration })

  const servicesActivity = Logger.activity("Initializing services")
  track("SERVICES_INIT_STARTED")
  servicesLoader({
    container,
    configModule,
    activityId: servicesActivity,
    isTest,
  })
  const servAct = Logger.success(servicesActivity, "Services initialized") || {}
  track("SERVICES_INIT_COMPLETED", { duration: servAct.duration })

  const expActivity = Logger.activity("Initializing express")
  track("EXPRESS_INIT_STARTED")
  await expressLoader({
    app: expressApp,
    configModule,
    activityId: expActivity,
  })
  await passportLoader({ app: expressApp, container, activityId: expActivity })
  const exAct = Logger.success(expActivity, "Express intialized") || {}
  track("EXPRESS_INIT_COMPLETED", { duration: exAct.duration })

  // Add the registered services to the request scope
  expressApp.use((req, res, next) => {
    container.register({
      manager: asValue(getManager()),
    })
    req.scope = container.createScope()
    next()
  })

  const pluginsActivity = Logger.activity("Initializing plugins")
  track("PLUGINS_INIT_STARTED")
  await pluginsLoader({
    container,
    rootDirectory,
    app: expressApp,
    activityId: pluginsActivity,
  })
  const pAct = Logger.success(pluginsActivity, "Plugins intialized") || {}
  track("PLUGINS_INIT_COMPLETED", { duration: pAct.duration })

  const subActivity = Logger.activity("Initializing subscribers")
  track("SUBSCRIBERS_INIT_STARTED")
  subscribersLoader({ container, activityId: subActivity })
  const subAct = Logger.success(subActivity, "Subscribers initialized") || {}
  track("SUBSCRIBERS_INIT_COMPLETED", { duration: subAct.duration })

  const apiActivity = Logger.activity("Initializing API")
  track("API_INIT_STARTED")
  await apiLoader({
    container,
    rootDirectory,
    app: expressApp,
    activityId: apiActivity,
  })
  const apiAct = Logger.success(apiActivity, "API initialized") || {}
  track("API_INIT_COMPLETED", { duration: apiAct.duration })

  const defaultsActivity = Logger.activity("Initializing defaults")
  track("DEFAULTS_INIT_STARTED")
  await defaultsLoader({ container, activityId: defaultsActivity })
  const dAct = Logger.success(defaultsActivity, "Defaults initialized") || {}
  track("DEFAULTS_INIT_COMPLETED", { duration: dAct.duration })

  const searchActivity = Logger.activity("Initializing search engine indexing")
  track("SEARCH_ENGINE_INDEXING_STARTED")
  searchIndexLoader({ container, activityId: searchActivity })
  const searchAct = Logger.success(searchActivity, "Indexing completed") || {}
  track("SEARCH_ENGINE_INDEXING_COMPLETED", { duration: searchAct.duration })

  return { container, dbConnection, app: expressApp }
}

function asArray(resolvers) {
  return {
    resolve: (container, opts) =>
      resolvers.map((r) => container.build(r, opts)),
  }
}
