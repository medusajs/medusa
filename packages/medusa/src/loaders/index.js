import { createContainer, asValue } from "awilix"
import Redis from "ioredis"
import { getConfigFile } from "medusa-core-utils"
import requestIp from "request-ip"

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
import { getManager } from "typeorm"

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
  await modelsLoader({ container, activityId: modelsActivity })
  Logger.success(modelsActivity, "Models initialized")

  const pmActivity = Logger.activity("Initializing plugin models")
  await registerPluginModels({
    rootDirectory,
    container,
    activityId: pmActivity,
  })
  Logger.success(pmActivity, "Plugin models initialized")

  const repoActivity = Logger.activity("Initializing repositories")
  await repositoriesLoader({ container, activityId: repoActivity })
  Logger.success(repoActivity, "Repositories initialized")

  const dbActivity = Logger.activity("Initializing database")
  const dbConnection = await databaseLoader({
    container,
    configModule,
    activityId: dbActivity,
  })
  Logger.success(dbActivity, "Database initialized")

  container.register({
    manager: asValue(dbConnection.manager),
  })

  const servicesActivity = Logger.activity("Initializing services")
  await servicesLoader({
    container,
    configModule,
    activityId: servicesActivity,
  })
  Logger.success(servicesActivity, "Services initialized")

  const subActivity = Logger.activity("Initializing subscribers")
  await subscribersLoader({ container, activityId: subActivity })
  Logger.success(subActivity, "Subscribers initialized")

  const expActivity = Logger.activity("Initializing express")
  await expressLoader({
    app: expressApp,
    configModule,
    activityId: expActivity,
  })
  await passportLoader({ app: expressApp, container, activityId: expActivity })
  Logger.success(expActivity, "Express intialized")

  // Add the registered services to the request scope
  expressApp.use((req, res, next) => {
    container.register({
      manager: asValue(getManager()),
    })
    req.scope = container.createScope()
    next()
  })

  const pluginsActivity = Logger.activity("Initializing plugins")
  await pluginsLoader({
    container,
    rootDirectory,
    app: expressApp,
    activityId: pluginsActivity,
  })
  Logger.success(pluginsActivity, "Plugins intialized")

  const apiActivity = Logger.activity("Initializing API")
  await apiLoader({
    container,
    rootDirectory,
    app: expressApp,
    activityId: apiActivity,
  })
  Logger.success(apiActivity, "API initialized")

  const defaultsActivity = Logger.activity("Initializing defaults")
  await defaultsLoader({ container, activityId: defaultsActivity })
  Logger.success(defaultsActivity, "Defaults initialized")

  return { container, dbConnection, app: expressApp }
}

function asArray(resolvers) {
  return {
    resolve: (container, opts) => resolvers.map(r => container.build(r, opts)),
  }
}
