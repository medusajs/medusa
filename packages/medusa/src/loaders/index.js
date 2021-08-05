import { createContainer, asValue } from "awilix"
import Redis from "ioredis"
import requestIp from "request-ip"
import { getManager } from "typeorm"
import { getConfigFile } from "medusa-core-utils"
import { track } from "medusa-telemetry"

import expressLoader from "./express"
import databaseLoader from "./database"
import repositoriesLoader from "./repositories"
import apiLoader from "./api"
import modelsLoader from "./models"
import servicesLoader from "./services"
import subscribersLoader from "./subscribers"
import passportLoader from "./passport"
import pluginsLoader, { registerPluginModels } from "./plugins"
import defaultsLoader from "./defaults"
import Logger from "./logger"

export default async ({ directory: rootDirectory, expressApp }) => {
  const { configModule, configFilePath } = getConfigFile(
    rootDirectory,
    `medusa-config`
  )

  const container = createContainer()
  container.registerAdd = function(name, registration) {
    let storeKey = name + "_STORE"

    if (this.registrations[storeKey] === undefined) {
      this.register(storeKey, asValue([]))
    }
    let store = this.resolve(storeKey)

    if (this.registrations[name] === undefined) {
      this.register(name, asArray(store))
    }
    store.unshift(registration)

    return this
  }.bind(container)

  // Economical way of dealing with redis clients
  const client = new Redis(configModule.projectConfig.redis_url)
  const subscriber = new Redis(configModule.projectConfig.redis_url)

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
    redisClient: asValue(client),
    redisSubscriber: asValue(subscriber),
    logger: asValue(Logger),
  })

  const modelsActivity = Logger.activity("Initializing models")
  track("MODELS_INIT_STARTED")
  modelsLoader({ container, activityId: modelsActivity })
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
  repositoriesLoader({ container, activityId: repoActivity }) || {}
  const rAct = Logger.success(repoActivity, "Repositories initialized") || {}
  track("REPOSITORIES_INIT_COMPLETED", { duration: rAct.duration })

  const dbActivity = Logger.activity("Initializing database")
  track("DATABASE_INIT_STARTED")
  const dbConnection = await databaseLoader({
    container,
    configModule,
    activityId: dbActivity,
  })
  const dbAct = Logger.success(dbActivity, "Database initialized") || {}
  track("DATABASE_INIT_COMPLETED", { duration: dbAct.duration })

  container.register({
    manager: asValue(dbConnection.manager),
  })

  const servicesActivity = Logger.activity("Initializing services")
  track("SERVICES_INIT_STARTED")
  servicesLoader({
    container,
    configModule,
    activityId: servicesActivity,
  })
  const servAct = Logger.success(servicesActivity, "Services initialized") || {}
  track("SERVICES_INIT_COMPLETED", { duration: servAct.duration })

  const subActivity = Logger.activity("Initializing subscribers")
  track("SUBSCRIBERS_INIT_STARTED")
  subscribersLoader({ container, activityId: subActivity })
  const subAct = Logger.success(subActivity, "Subscribers initialized") || {}
  track("SUBSCRIBERS_INIT_COMPLETED", { duration: subAct.duration })

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

  return { container, dbConnection, app: expressApp }
}

function asArray(resolvers) {
  return {
    resolve: (container, opts) => resolvers.map(r => container.build(r, opts)),
  }
}
