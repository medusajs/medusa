import glob from "glob"
import { BaseModel, BaseService, PaymentService } from "medusa-interfaces"
import _ from "lodash"
import path from "path"
import fs from "fs"
import { asFunction } from "awilix"
import { sync as existsSync } from "fs-exists-cached"
import { plugins } from "../../medusa-config.js"

/**
 * Registers all services in the services directory
 */
export default ({ container }) => {
  const resolved = plugins.map(plugin => {
    if (_.isString(plugin)) {
      return resolvePlugin(plugin)
    }

    const details = resolvePlugin(plugin.resolve)
    details.options = plugin.options

    return details
  })

  resolved.forEach(pluginDetails => {
    registerServices(pluginDetails, container)
    registerModels(pluginDetails, container)
  })
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
function registerServices(pluginDetails, container) {
  const files = glob.sync(`${pluginDetails.resolve}/services/*`, {})
  files.forEach(fn => {
    const loaded = require(fn).default

    if (!(loaded.prototype instanceof BaseService)) {
      const logger = container.resolve("logger")
      const message = `Models must inherit from BaseModel, please check ${fn}`
      logger.error(message)
      throw new Error(message)
    }

    if (loaded.prototype instanceof PaymentService) {
      // Register our payment providers to paymentProviders
      container.registerAdd(
        "paymentProviders",
        asFunction(cradle => new loaded(cradle, pluginDetails.options))
      )

      // Add the service directly to the container in order to make simple
      // resolution if we already know which payment provider we need to use
      container.register({
        [`pp_${loaded.identifier}`]: asFunction(
          cradle => new loaded(cradle, pluginDetails.options)
        ),
      })
    } else {
      const name = formatRegistrationName(fn)
      container.register({
        [name]: asFunction(cradle => new loaded(cradle, pluginDetails.options)),
      })
    }
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
  const files = glob.sync(`${pluginDetails.resolve}/models/*`, {})
  files.forEach(fn => {
    const loaded = require(fn).default
    if (!(loaded.prototype instanceof BaseModel)) {
      const logger = container.resolve("logger")
      const message = `Models must inherit from BaseModel, please check ${fn}`
      logger.error(message)
      throw new Error(message)
    }

    const name = formatRegistrationName(fn)
    container.register({
      [name]: asFunction(cradle => new loaded(cradle, pluginDetails.options)),
    })
  })
}

/**
 * Formats a filename into the correct container resolution name.
 * Names are camelCase formatted and namespaced by the folder i.e:
 * models/example-person -> examplePersonModel
 * @param {string} fn - the full path of the file
 * @return {string} the formatted name
 */
function formatRegistrationName(fn) {
  const descriptor = fn.split(".")[0]
  const splat = descriptor.split("/")
  const rawname = splat[splat.length - 1]
  const namespace = splat[splat.length - 2]
  const upperNamespace =
    namespace.charAt(0).toUpperCase() + namespace.slice(1, -1)
  const parts = rawname.split("-").map((n, index) => {
    if (index !== 0) {
      return n.charAt(0).toUpperCase() + n.slice(1)
    }
    return n
  })
  return parts.join("") + upperNamespace
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

  /**
   *  Here we have an absolute path to an internal plugin, or a name of a module
   *  which should be located in node_modules.
   */
  try {
    // If the path is absolute, resolve the directory of the internal plugin,
    // otherwise resolve the directory containing the package.json
    const resolvedPath = path.dirname(
      require.resolve(`${pluginName}/package.json`)
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
