import glob from "glob"
import { EntitySchema } from "typeorm"
import {
  BaseService,
  PaymentService,
  FulfillmentService,
  NotificationService,
  FileService,
  OauthService,
  SearchService,
} from "medusa-interfaces"
import { getConfigFile, createRequireFromPath } from "medusa-core-utils"
import _ from "lodash"
import path from "path"
import fs from "fs"
import { asValue, asClass, asFunction, aliasTo } from "awilix"
import { sync as existsSync } from "fs-exists-cached"

import { isTaxCalculationStrategy } from "../interfaces/tax-calculation-strategy"
import formatRegistrationName from "../utils/format-registration-name"

/**
 * Registers all services in the services directory
 */
export default async ({ rootDirectory, container, app, activityId }) => {
  const resolved = getResolvedPlugins(rootDirectory)

  await Promise.all(
    resolved.map(async (pluginDetails) => {
      registerRepositories(pluginDetails, container)
      await registerServices(pluginDetails, container)
      registerMedusaApi(pluginDetails, container)
      registerApi(pluginDetails, app, rootDirectory, container, activityId)
      registerCoreRouters(pluginDetails, container)
      registerSubscribers(pluginDetails, container)
    })
  )

  await Promise.all(
    resolved.map(async (pluginDetails) => runLoaders(pluginDetails, container))
  )
}

function getResolvedPlugins(rootDirectory) {
  const { configModule } = getConfigFile(rootDirectory, `medusa-config`)

  if (!configModule) {
    return
  }

  const { plugins } = configModule

  const resolved = plugins.map((plugin) => {
    if (_.isString(plugin)) {
      return resolvePlugin(plugin)
    }

    const details = resolvePlugin(plugin.resolve)
    details.options = plugin.options

    return details
  })

  resolved.push({
    resolve: `${rootDirectory}/dist`,
    name: `project-plugin`,
    id: createPluginId(`project-plugin`),
    options: {},
    version: createFileContentHash(process.cwd(), `**`),
  })

  return resolved
}

export async function registerPluginModels({ rootDirectory, container }) {
  const resolved = getResolvedPlugins(rootDirectory)
  await Promise.all(
    resolved.map(async (pluginDetails) => {
      registerModels(pluginDetails, container)
    })
  )
}

async function runLoaders(pluginDetails, container) {
  const loaderFiles = glob.sync(
    `${pluginDetails.resolve}/loaders/[!__]*.js`,
    {}
  )
  await Promise.all(
    loaderFiles.map(async (loader) => {
      try {
        const module = require(loader).default
        if (typeof module === "function") {
          await module(container, pluginDetails.options)
        }
      } catch (err) {
        const logger = container.resolve("logger")
        logger.warn(`Running loader failed: ${err.message}`)
        return Promise.resolve()
      }
    })
  )
}

function registerMedusaApi(pluginDetails, container) {
  registerMedusaMiddleware(pluginDetails, container)
  registerStrategies(pluginDetails, container)
}

function registerStrategies(pluginDetails, container) {
  let module
  try {
    const path = `${pluginDetails.resolve}/strategies/tax-calculation`
    if (existsSync(path)) {
      module = require(path).default
    } else {
      return
    }
  } catch (err) {
    return
  }

  if (isTaxCalculationStrategy(module.prototype)) {
    container.register({
      taxCalculationStrategy: asFunction(
        (cradle) => new module(cradle, pluginDetails.options)
      ).singleton(),
    })
  } else {
    const logger = container.resolve("logger")
    logger.warn(
      `${pluginDetails.resolve}/strategies/tax-calculation did not export a class that implements ITaxCalculationStrategy. Your Medusa server will still work, but if you have written custom tax calculation logic it will not be used. Make sure to implement the ITaxCalculationStrategy interface.`
    )
  }
}

function registerMedusaMiddleware(pluginDetails, container) {
  let module
  try {
    module = require(`${pluginDetails.resolve}/api/medusa-middleware`).default
  } catch (err) {
    return
  }

  const middlewareService = container.resolve("middlewareService")
  if (module.postAuthentication) {
    middlewareService.addPostAuthentication(
      module.postAuthentication,
      pluginDetails.options
    )
  }

  if (module.preAuthentication) {
    middlewareService.addPreAuthentication(
      module.preAuthentication,
      pluginDetails.options
    )
  }

  if (module.preCartCreation) {
    middlewareService.addPreCartCreation(module.preCartCreation)
  }
}

function registerCoreRouters(pluginDetails, container) {
  const middlewareService = container.resolve("middlewareService")
  const { resolve } = pluginDetails
  const adminFiles = glob.sync(`${resolve}/api/admin/[!__]*.js`, {})
  const storeFiles = glob.sync(`${resolve}/api/store/[!__]*.js`, {})

  adminFiles.forEach((fn) => {
    const descriptor = fn.split(".")[0]
    const splat = descriptor.split("/")
    const path = `${splat[splat.length - 2]}/${splat[splat.length - 1]}`
    const loaded = require(fn).default
    middlewareService.addRouter(path, loaded())
  })

  storeFiles.forEach((fn) => {
    const descriptor = fn.split(".")[0]
    const splat = descriptor.split("/")
    const path = `${splat[splat.length - 2]}/${splat[splat.length - 1]}`
    const loaded = require(fn).default
    middlewareService.addRouter(path, loaded())
  })
}

/**
 * Registers the plugin's api routes.
 */
function registerApi(
  pluginDetails,
  app,
  rootDirectory = "",
  container,
  activityId
) {
  const logger = container.resolve("logger")
  logger.progress(
    activityId,
    `Registering custom endpoints for ${pluginDetails.name}`
  )
  try {
    const routes = require(`${pluginDetails.resolve}/api`).default
    if (routes) {
      app.use("/", routes(rootDirectory, pluginDetails.options))
    }
    return app
  } catch (err) {
    if (err.message !== `Cannot find module '${pluginDetails.resolve}/api'`) {
      logger.progress(
        activityId,
        `No customer endpoints registered for ${pluginDetails.name}`
      )
    }
    return app
  }
}

/**
 * Registers a service at the right location in our container. If the service is
 * a BaseService instance it will be available directly from the container.
 * PaymentService instances are added to the paymentProviders array in the
 * container. Names are camelCase formatted and namespaced by the folder i.e:
 * services/example-payments -> examplePaymentsService
 * @param {object} pluginDetails - the plugin details including plugin options,
 *    version, id, resolved path, etc. See resolvePlugin
 * @param {object} container - the container where the services will be
 *    registered
 * @return {void}
 */
async function registerServices(pluginDetails, container) {
  const files = glob.sync(`${pluginDetails.resolve}/services/[!__]*`, {})
  await Promise.all(
    files.map(async (fn) => {
      const loaded = require(fn).default
      const name = formatRegistrationName(fn)

      if (!(loaded.prototype instanceof BaseService)) {
        const logger = container.resolve("logger")
        const message = `Services must inherit from BaseService, please check ${fn}`
        logger.error(message)
        throw new Error(message)
      }

      if (loaded.prototype instanceof PaymentService) {
        // Register our payment providers to paymentProviders
        container.registerAdd(
          "paymentProviders",
          asFunction((cradle) => new loaded(cradle, pluginDetails.options))
        )

        // Add the service directly to the container in order to make simple
        // resolution if we already know which payment provider we need to use
        container.register({
          [name]: asFunction(
            (cradle) => new loaded(cradle, pluginDetails.options)
          ),
          [`pp_${loaded.identifier}`]: aliasTo(name),
        })
      } else if (loaded.prototype instanceof OauthService) {
        const oauthService = container.resolve("oauthService")

        const appDetails = loaded.getAppDetails(pluginDetails.options)
        await oauthService.registerOauthApp(appDetails)

        const name = appDetails.application_name
        container.register({
          [`${name}Oauth`]: asFunction(
            (cradle) => new loaded(cradle, pluginDetails.options)
          ),
        })
      } else if (loaded.prototype instanceof FulfillmentService) {
        // Register our payment providers to paymentProviders
        container.registerAdd(
          "fulfillmentProviders",
          asFunction((cradle) => new loaded(cradle, pluginDetails.options))
        )

        // Add the service directly to the container in order to make simple
        // resolution if we already know which fulfillment provider we need to use
        container.register({
          [name]: asFunction(
            (cradle) => new loaded(cradle, pluginDetails.options)
          ).singleton(),
          [`fp_${loaded.identifier}`]: aliasTo(name),
        })
      } else if (loaded.prototype instanceof NotificationService) {
        container.registerAdd(
          "notificationProviders",
          asFunction((cradle) => new loaded(cradle, pluginDetails.options))
        )

        // Add the service directly to the container in order to make simple
        // resolution if we already know which notification provider we need to use
        container.register({
          [name]: asFunction(
            (cradle) => new loaded(cradle, pluginDetails.options)
          ).singleton(),
          [`noti_${loaded.identifier}`]: aliasTo(name),
        })
      } else if (loaded.prototype instanceof FileService) {
        // Add the service directly to the container in order to make simple
        // resolution if we already know which file storage provider we need to use
        container.register({
          [name]: asFunction(
            (cradle) => new loaded(cradle, pluginDetails.options)
          ),
          [`fileService`]: aliasTo(name),
        })
      } else if (loaded.prototype instanceof SearchService) {
        // Add the service directly to the container in order to make simple
        // resolution if we already know which search provider we need to use
        container.register({
          [name]: asFunction(
            (cradle) => new loaded(cradle, pluginDetails.options)
          ),
          [`searchService`]: aliasTo(name),
        })
      } else {
        container.register({
          [name]: asFunction(
            (cradle) => new loaded(cradle, pluginDetails.options)
          ),
        })
      }
    })
  )
}

/**
 * Registers a plugin's subscribers at the right location in our container.
 * Subscribers are registered directly in the container.
 * @param {object} pluginDetails - the plugin details including plugin options,
 *    version, id, resolved path, etc. See resolvePlugin
 * @param {object} container - the container where the services will be
 *    registered
 * @return {void}
 */
function registerSubscribers(pluginDetails, container) {
  const files = glob.sync(`${pluginDetails.resolve}/subscribers/*.js`, {})
  files.forEach((fn) => {
    const loaded = require(fn).default

    const name = formatRegistrationName(fn)
    container.build(
      asFunction(
        (cradle) => new loaded(cradle, pluginDetails.options)
      ).singleton()
    )
  })
}

/**
 * Registers a plugin's repositories at the right location in our container.
 * repositories are registered directly in the container.
 * @param {object} pluginDetails - the plugin details including plugin options,
 *    version, id, resolved path, etc. See resolvePlugin
 * @param {object} container - the container where the services will be
 *    registered
 * @return {void}
 */
function registerRepositories(pluginDetails, container) {
  const files = glob.sync(`${pluginDetails.resolve}/repositories/*.js`, {})
  files.forEach((fn) => {
    const loaded = require(fn)

    Object.entries(loaded).map(([key, val]) => {
      if (typeof val === "function") {
        const name = formatRegistrationName(fn)
        container.register({
          [name]: asClass(val),
        })
      }
    })
  })
}

/**
 * Registers a plugin's models at the right location in our container. Models
 * must inherit from BaseModel. Models are registered directly in the container.
 * Names are camelCase formatted and namespaced by the folder i.e:
 * models/example-person -> examplePersonModel
 * @param {object} pluginDetails - the plugin details including plugin options,
 *    version, id, resolved path, etc. See resolvePlugin
 * @param {object} container - the container where the services will be
 *    registered
 * @return {void}
 */
function registerModels(pluginDetails, container) {
  const files = glob.sync(`${pluginDetails.resolve}/models/*.js`, {})
  files.forEach((fn) => {
    const loaded = require(fn)

    Object.entries(loaded).map(([key, val]) => {
      if (typeof val === "function" || val instanceof EntitySchema) {
        const name = formatRegistrationName(fn)
        container.register({
          [name]: asValue(val),
        })

        container.registerAdd("db_entities", asValue(val))
      }
    })
  })
}

// TODO: Create unique id for each plugin
function createPluginId(name) {
  return name
}

/**
 * Finds the correct path for the plugin. If it is a local plugin it will be
 * found in the plugins folder. Otherwise we will look for the plugin in the
 * installed npm packages.
 * @param {string} pluginName - the name of the plugin to find. Should match
 *    the name of the folder where the plugin is contained.
 * @return {object} the plugin details
 */
function resolvePlugin(pluginName) {
  // Only find plugins when we're not given an absolute path
  if (!existsSync(pluginName)) {
    // Find the plugin in the local plugins folder
    const resolvedPath = path.resolve(`./plugins/${pluginName}`)

    if (existsSync(resolvedPath)) {
      if (existsSync(`${resolvedPath}/package.json`)) {
        const packageJSON = JSON.parse(
          fs.readFileSync(`${resolvedPath}/package.json`, `utf-8`)
        )
        const name = packageJSON.name || pluginName
        //warnOnIncompatiblePeerDependency(name, packageJSON)

        return {
          resolve: resolvedPath,
          name,
          id: createPluginId(name),
          options: {},
          version:
            packageJSON.version || createFileContentHash(resolvedPath, `**`),
        }
      } else {
        // Make package.json a requirement for local plugins too
        throw new Error(`Plugin ${pluginName} requires a package.json file`)
      }
    }
  }

  const rootDir = path.resolve(".")

  /**
   *  Here we have an absolute path to an internal plugin, or a name of a module
   *  which should be located in node_modules.
   */
  try {
    const requireSource =
      rootDir !== null
        ? createRequireFromPath(`${rootDir}/:internal:`)
        : require

    // If the path is absolute, resolve the directory of the internal plugin,
    // otherwise resolve the directory containing the package.json
    const resolvedPath = path.dirname(
      requireSource.resolve(`${pluginName}/package.json`)
    )

    const packageJSON = JSON.parse(
      fs.readFileSync(`${resolvedPath}/package.json`, `utf-8`)
    )
    // warnOnIncompatiblePeerDependency(packageJSON.name, packageJSON)

    return {
      resolve: resolvedPath,
      id: createPluginId(packageJSON.name),
      name: packageJSON.name,
      version: packageJSON.version,
    }
  } catch (err) {
    throw new Error(
      `Unable to find plugin "${pluginName}". Perhaps you need to install its package?`
    )
  }
}

function createFileContentHash(path, files) {
  return path + files
}
