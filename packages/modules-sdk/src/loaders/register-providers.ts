import { MedusaContainer } from "@medusajs/types"
import { formatRegistrationName, promiseAll } from "@medusajs/utils"
import { Lifetime, asFunction } from "awilix"
import fs from "fs"
import { sync as existsSync } from "fs-exists-cached"
import glob from "glob"
import { createRequireFromPath } from "medusa-core-utils"
import path from "path"

type PluginDetails = {
  resolve: string
  name: string
  id: string
  options: Record<string, unknown>
  version: string
}

export async function moduleProviderLoader({
  container,
  providers,
  registerServiceFn,
}) {
  if (!providers?.length) {
    return
  }

  const resolvedProviders = new Map<string, Record<string, unknown>>()
  const installedPlugins = providers.map((provider) => {
    let resolvedProvider
    if (resolvedProviders.has(provider.resolve)) {
      resolvedProvider = resolvedProviders.get(provider.resolve)
    } else {
      const details = resolvePlugin(provider.resolve)
      details.options = provider.options

      resolvedProviders.set(provider.resolve, details)
      resolvedProvider = details
    }

    return resolvedProvider
  })

  await promiseAll(
    installedPlugins.map(async (pluginDetails) => {
      await registerServices(pluginDetails, container, registerServiceFn)
    })
  )

  return installedPlugins
}

export async function registerServices(
  pluginDetails: PluginDetails,
  container: MedusaContainer,
  registerServiceFn?: (klass, container, pluginDetails) => Promise<void>
): Promise<any[]> {
  const files = glob.sync(`${pluginDetails.resolve}/services/[!__]*.js`, {})
  const klasses: any[] = []

  await promiseAll(
    files.map(async (fn) => {
      const loaded = require(fn).default
      const name = formatRegistrationName(fn)

      if (typeof loaded !== "function") {
        throw new Error(
          `Cannot register ${name}. Make sure to default export a service class in ${fn}`
        )
      }

      if (registerServiceFn) {
        // Used to register the specific type of service in the provider
        await registerServiceFn(loaded, container, pluginDetails.options)
      } else {
        container.register({
          [name]: asFunction(
            (cradle) => new loaded(cradle, pluginDetails.options),
            {
              lifetime: loaded.LIFE_TIME || Lifetime.SCOPED,
            }
          ),
        })
      }

      klasses.push(loaded)
    })
  )

  return klasses
}

function resolvePlugin(pluginName: string): {
  resolve: string
  id: string
  name: string
  options: Record<string, unknown>
  version: string
} {
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

        return {
          resolve: resolvedPath,
          name,
          id: name,
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

    const computedResolvedPath =
      resolvedPath + (process.env.DEV_MODE ? "/src" : "")

    // Add support for a plugin to output the build into a dist directory
    const resolvedPathToDist = resolvedPath + "/dist"
    const isDistExist =
      resolvedPathToDist &&
      !process.env.DEV_MODE &&
      existsSync(resolvedPath + "/dist")

    return {
      resolve: isDistExist ? resolvedPathToDist : computedResolvedPath,
      id: packageJSON.name,
      name: packageJSON.name,
      options: {},
      version: packageJSON.version,
    }
  } catch (err) {
    throw new Error(
      `Unable to find plugin "${pluginName}". Perhaps you need to install its package?`
    )
  }
}

function createFileContentHash(path, files): string {
  return path + files
}
