import { MedusaModule, registerMedusaModule } from "@medusajs/modules-sdk"
import glob from "glob"
import { isDefined } from "medusa-core-utils"

export function getInternalModules(configModule) {
  const modules = []
  const moduleResolutions = {}

  Object.entries(configModule.modules ?? {}).forEach(([moduleKey, module]) => {
    moduleResolutions[moduleKey] = registerMedusaModule(moduleKey, module)[
      moduleKey
    ]
  })

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
  const moduleResolutions = {}
  Object.entries(configModule.modules ?? {}).forEach(([moduleKey, module]) => {
    moduleResolutions[moduleKey] = registerMedusaModule(moduleKey, module)[
      moduleKey
    ]
  })

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
  const moduleResolutions = {}
  Object.entries(configModule.modules ?? {}).forEach(([moduleKey, module]) => {
    moduleResolutions[moduleKey] = registerMedusaModule(moduleKey, module)[
      moduleKey
    ]
  })

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
