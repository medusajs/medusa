import { MedusaModule, registerModules } from "@medusajs/modules-sdk"
import fs from "fs"
import { sync as existsSync } from "fs-exists-cached"
import glob from "glob"
import { isString } from "lodash"
import {
  createRequireFromPath,
  getConfigFile,
  isDefined,
} from "medusa-core-utils"
import path from "path"
import { handleConfigError } from "../../loaders/config"

function createFileContentHash(path, files) {
  return path + files
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
        // warnOnIncompatiblePeerDependency(name, packageJSON)

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

export function getInternalModules(configModule) {
  const modules = []

  const moduleResolutions = registerModules(configModule.modules)

  for (const moduleResolution of Object.values(moduleResolutions)) {
    if (
      !moduleResolution.resolutionPath ||
      moduleResolution.moduleDeclaration.scope !== "internal"
    ) {
      continue
    }

    let loadedModule = null
    try {
      loadedModule = require(moduleResolution.resolutionPath).default
    } catch (error) {
      console.log("Error loading Module", error)
      continue
    }

    modules.push({
      moduleDeclaration: moduleResolution.moduleDeclaration,
      loadedModule,
    })
  }

  return modules
}

export default (directory, featureFlagRouter) => {
  const { configModule, error } = getConfigFile(directory, `medusa-config`)

  if (error) {
    handleConfigError(error)
  }

  const { plugins } = configModule

  const resolved = plugins.map((plugin) => {
    if (isString(plugin)) {
      return resolvePlugin(plugin)
    }

    const details = resolvePlugin(plugin.resolve)
    details.options = plugin.options

    return details
  })

  resolved.push({
    resolve: `${directory}/dist`,
    name: `project-plugin`,
    id: createPluginId(`project-plugin`),
    options: {},
    version: createFileContentHash(process.cwd(), `**`),
  })

  const migrationDirs = []
  const corePackageMigrations = path.resolve(
    path.join(__dirname, "..", "..", "migrations")
  )

  migrationDirs.push(path.join(corePackageMigrations, "*.js"))

  for (const p of resolved) {
    const exists = existsSync(`${p.resolve}/migrations`)
    if (exists) {
      migrationDirs.push(`${p.resolve}/migrations/*.js`)
    }
  }

  const isFeatureFlagEnabled = (flag) =>
    featureFlagRouter.isFeatureEnabled(flag)

  const coreMigrations = getEnabledMigrations(
    migrationDirs,
    isFeatureFlagEnabled
  )

  return { coreMigrations }
}

export const getEnabledMigrations = (migrationDirs, isFlagEnabled) => {
  const allMigrations = migrationDirs.flatMap((dir) => {
    return glob.sync(dir)
  })
  return allMigrations
    .map((file) => {
      const loaded = require(file)
      if (!isDefined(loaded.featureFlag) || isFlagEnabled(loaded.featureFlag)) {
        delete loaded.featureFlag
        return Object.values(loaded)
      }
    })
    .flat()
    .filter(Boolean)
}

export const getModuleMigrations = (configModule, isFlagEnabled) => {
  const loadedModules = getInternalModules(configModule)

  const allModules = []

  for (const loadedModule of loadedModules) {
    const mod = loadedModule.loadedModule

    const moduleMigrations = (mod.migrations ?? [])
      .map((migration) => {
        if (
          !isDefined(migration.featureFlag) ||
          isFlagEnabled(migration.featureFlag)
        ) {
          delete migration.featureFlag
          return Object.values(migration)
        }
      })
      .flat()
      .filter(Boolean)

    allModules.push({
      moduleDeclaration: loadedModule.moduleDeclaration,
      models: mod.models ?? [],
      migrations: moduleMigrations,
    })
  }

  return allModules
}

export const getModuleSharedResources = (configModule, featureFlagsRouter) => {
  const isFlagEnabled = (flag) =>
    featureFlagsRouter && featureFlagsRouter.isFeatureEnabled(flag)

  const loadedModules = getModuleMigrations(configModule, isFlagEnabled)

  let migrations = []
  let models = []

  for (const mod of loadedModules) {
    if (mod.moduleDeclaration.resources !== "shared") {
      continue
    }

    migrations = migrations.concat(mod.migrations)

    models = models.concat(mod.models ?? [])
  }

  return {
    models,
    migrations,
  }
}

export const runIsolatedModulesMigration = async (configModule) => {
  const moduleResolutions = registerModules(configModule.modules)

  for (const moduleResolution of Object.values(moduleResolutions)) {
    if (
      !moduleResolution.resolutionPath ||
      moduleResolution.moduleDeclaration.scope !== "internal" ||
      moduleResolution.moduleDeclaration.resources !== "isolated"
    ) {
      continue
    }

    await MedusaModule.migrateUp(
      moduleResolution.definition.key,
      moduleResolution.resolutionPath,
      moduleResolution.options
    )
  }
}

export const revertIsolatedModulesMigration = async (configModule) => {
  const moduleResolutions = registerModules(configModule.modules)

  for (const moduleResolution of Object.values(moduleResolutions)) {
    if (
      !moduleResolution.resolutionPath ||
      moduleResolution.moduleDeclaration.scope !== "internal" ||
      moduleResolution.moduleDeclaration.resources !== "isolated"
    ) {
      continue
    }

    await MedusaModule.migrateDown(
      moduleResolution.definition.key,
      moduleResolution.resolutionPath,
      moduleResolution.options
    )
  }
}
