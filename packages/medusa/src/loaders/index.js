import { createContainer, asValue } from "awilix"
import expressLoader from "./express"
import mongooseLoader from "./mongoose"
import apiLoader from "./api"
import modelsLoader from "./models"
import servicesLoader from "./services"
import passportLoader from "./passport"
import pluginsLoader from "./plugins"
import Logger from "./logger"

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

  container.register({
    logger: asValue(Logger),
  })

  await modelsLoader({ container })
  Logger.info("Models initialized")

  await servicesLoader({ container })
  Logger.info("Services initialized")

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

  return { container, dbConnection, app: expressApp }
}

function asArray(resolvers) {
  return {
    resolve: (container, opts) => resolvers.map(r => container.build(r, opts)),
  }
}
