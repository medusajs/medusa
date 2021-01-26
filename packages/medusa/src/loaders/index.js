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
import pluginsLoader from "./plugins"
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

  await modelsLoader({ container })
  Logger.info("Models initialized")

  await repositoriesLoader({ container })
  Logger.info("Repositories initialized")

  const dbConnection = await databaseLoader({ container, configModule })
  Logger.info("Database initialized")

  container.register({
    manager: asValue(dbConnection.manager),
  })

  await servicesLoader({ container, configModule })
  Logger.info("Services initialized")

  await subscribersLoader({ container })
  Logger.info("Subscribers initialized")

  await expressLoader({ app: expressApp, configModule })
  Logger.info("Express Intialized")

  await passportLoader({ app: expressApp, container })
  Logger.info("Passport initialized")

  // Add the registered services to the request scope
  expressApp.use((req, res, next) => {
    container.register({
      manager: asValue(getManager()),
    })
    req.scope = container.createScope()
    next()
  })

  await pluginsLoader({ container, rootDirectory, app: expressApp })
  Logger.info("Plugins Intialized")

  await apiLoader({ container, rootDirectory, app: expressApp })
  Logger.info("API initialized")

  await defaultsLoader({ container })
  Logger.info("Defaults initialized")

  return { container, dbConnection, app: expressApp }
}

function asArray(resolvers) {
  return {
    resolve: (container, opts) => resolvers.map(r => container.build(r, opts)),
  }
}
