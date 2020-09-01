import { createContainer, asValue } from "awilix"
import Redis from "ioredis"

import expressLoader from "./express"
import mongooseLoader from "./mongoose"
import apiLoader from "./api"
import modelsLoader from "./models"
import servicesLoader from "./services"
import subscribersLoader from "./subscribers"
import passportLoader from "./passport"
import pluginsLoader from "./plugins"
import defaultsLoader from "./defaults"
import Logger from "./logger"
import config from "../config"

export default async ({ directory: rootDirectory, expressApp }) => {
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
  const client = new Redis(config.redisURI)
  const subscriber = new Redis(config.redisURI)

  container.register({
    redisClient: client,
    redisSubscriber: subscriber,
    logger: asValue(Logger),
  })

  await modelsLoader({ container })
  Logger.info("Models initialized")

  await servicesLoader({ container })
  Logger.info("Services initialized")

  await subscribersLoader({ container })
  Logger.info("Subscribers initialized")

  const dbConnection = await mongooseLoader({ container })
  Logger.info("MongoDB Intialized")

  await expressLoader({ app: expressApp })
  Logger.info("Express Intialized")

  await passportLoader({ app: expressApp, container })
  Logger.info("Passport initialized")

  // Add the registered services to the request scope
  expressApp.use((req, res, next) => {
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
