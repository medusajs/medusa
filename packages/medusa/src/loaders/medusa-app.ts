import {
  MedusaApp,
  MedusaAppMigrateDown,
  MedusaAppMigrateGenerate,
  MedusaAppMigrateUp,
  MedusaAppOptions,
  MedusaAppOutput,
  ModulesDefinition,
} from "@medusajs/modules-sdk"
import {
  CommonTypes,
  ConfigModule,
  InternalModuleDeclaration,
  LoadedModule,
  MedusaContainer,
  ModuleDefinition,
} from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  isBoolean,
  isObject,
  isPresent,
  upperCaseFirst,
} from "@medusajs/utils"

import { asValue } from "awilix"

export function mergeDefaultModules(
  modulesConfig: CommonTypes.ConfigModule["modules"]
) {
  const defaultModules = Object.values(ModulesDefinition).filter(
    (definition: ModuleDefinition) => {
      return !!definition.defaultPackage
    }
  )

  const configModules = { ...modulesConfig } ?? {}

  for (const defaultModule of defaultModules as ModuleDefinition[]) {
    configModules[defaultModule.key] ??= defaultModule.defaultModuleDeclaration
  }

  for (const [key, value] of Object.entries(
    configModules as Record<string, InternalModuleDeclaration>
  )) {
    const def = {} as ModuleDefinition
    def.key ??= key
    def.registrationName ??= key
    def.label ??= upperCaseFirst(key)
    def.isQueryable = ModulesDefinition[key]?.isQueryable ?? true

    const orignalDef = value?.definition
    if (
      !isBoolean(value) &&
      (isObject(orignalDef) || !isPresent(value.definition))
    ) {
      value.definition = {
        ...def,
        ...orignalDef,
      }
    }
  }

  return configModules
}

/**
 * Run, Revert or Generate the migrations for the medusa app.
 *
 * @param configModule
 * @param container
 * @param moduleNames
 * @param linkModules
 * @param action
 */
export async function runMedusaAppMigrations({
  configModule,
  container,
  moduleNames,
  linkModules,
  action = "run",
}: {
  configModule: {
    modules?: CommonTypes.ConfigModule["modules"]
    projectConfig: CommonTypes.ConfigModule["projectConfig"]
  }
  linkModules?: MedusaAppOptions["linkModules"]
  container: MedusaContainer
} & (
  | {
      moduleNames?: never
      action: "run"
    }
  | {
      moduleNames: string[]
      action: "revert" | "generate"
    }
)): Promise<void> {
  const injectedDependencies = {
    [ContainerRegistrationKeys.PG_CONNECTION]: container.resolve(
      ContainerRegistrationKeys.PG_CONNECTION
    ),
    [ContainerRegistrationKeys.LOGGER]: container.resolve(
      ContainerRegistrationKeys.LOGGER
    ),
  }

  const sharedResourcesConfig = {
    database: {
      clientUrl:
        injectedDependencies[ContainerRegistrationKeys.PG_CONNECTION]?.client
          ?.config?.connection?.connectionString ??
        configModule.projectConfig.databaseUrl,
      driverOptions: configModule.projectConfig.databaseDriverOptions,
      debug: !!(configModule.projectConfig.databaseLogging ?? false),
    },
  }
  const configModules = mergeDefaultModules(configModule.modules)

  const migrationOptions = {
    modulesConfig: configModules,
    sharedContainer: container,
    linkModules,
    sharedResourcesConfig,
    injectedDependencies,
  }

  if (action === "revert") {
    await MedusaAppMigrateDown(moduleNames!, migrationOptions)
  } else if (action === "run") {
    await MedusaAppMigrateUp(migrationOptions)
  } else {
    await MedusaAppMigrateGenerate(moduleNames!, migrationOptions)
  }
}

export const loadMedusaApp = async (
  {
    container,
    linkModules,
  }: {
    container: MedusaContainer
    linkModules?: MedusaAppOptions["linkModules"]
  },
  config = { registerInContainer: true }
): Promise<MedusaAppOutput> => {
  const injectedDependencies = {
    [ContainerRegistrationKeys.PG_CONNECTION]: container.resolve(
      ContainerRegistrationKeys.PG_CONNECTION
    ),
    [ContainerRegistrationKeys.LOGGER]: container.resolve(
      ContainerRegistrationKeys.LOGGER
    ),
  }

  const configModule: ConfigModule = container.resolve(
    ContainerRegistrationKeys.CONFIG_MODULE
  )

  const sharedResourcesConfig = {
    database: {
      clientUrl: configModule.projectConfig.databaseUrl,
      driverOptions: configModule.projectConfig.databaseDriverOptions,
      debug: !!(configModule.projectConfig.databaseLogging ?? false),
    },
  }

  container.register(ContainerRegistrationKeys.REMOTE_QUERY, asValue(undefined))
  container.register(ContainerRegistrationKeys.REMOTE_LINK, asValue(undefined))

  const configModules = mergeDefaultModules(configModule.modules)

  const medusaApp = await MedusaApp({
    workerMode: configModule.projectConfig.workerMode,
    modulesConfig: configModules,
    sharedContainer: container,
    linkModules,
    sharedResourcesConfig,
    injectedDependencies,
  })

  if (!config.registerInContainer) {
    return medusaApp
  }

  container.register(
    ContainerRegistrationKeys.REMOTE_LINK,
    asValue(medusaApp.link)
  )
  container.register(
    ContainerRegistrationKeys.REMOTE_QUERY,
    asValue(medusaApp.query)
  )

  for (const moduleService of Object.values(medusaApp.modules)) {
    const loadedModule = moduleService as LoadedModule
    container.register(
      loadedModule.__definition.registrationName,
      asValue(moduleService)
    )
  }

  // Register all unresolved modules as undefined to be present in the container with undefined value by defaul
  // but still resolvable
  for (const moduleDefinition of Object.values(ModulesDefinition)) {
    if (!container.hasRegistration(moduleDefinition.registrationName)) {
      container.register(moduleDefinition.registrationName, asValue(undefined))
    }
  }

  return medusaApp
}

/**
 * Run the modules loader without taking care of anything else. This is useful for running the loader as a separate action or to re run all modules loaders.
 *
 * @param configModule
 * @param container
 */
export async function runModulesLoader({
  configModule,
  linkModules,
  container,
}: {
  configModule: {
    modules?: CommonTypes.ConfigModule["modules"]
    projectConfig: CommonTypes.ConfigModule["projectConfig"]
  }
  container: MedusaContainer
  linkModules?: MedusaAppOptions["linkModules"]
}): Promise<void> {
  const injectedDependencies = {
    [ContainerRegistrationKeys.PG_CONNECTION]: container.resolve(
      ContainerRegistrationKeys.PG_CONNECTION
    ),
    [ContainerRegistrationKeys.LOGGER]: container.resolve(
      ContainerRegistrationKeys.LOGGER
    ),
  }

  const sharedResourcesConfig = {
    database: {
      clientUrl: configModule.projectConfig.databaseUrl,
      driverOptions: configModule.projectConfig.databaseDriverOptions,
      debug: !!(configModule.projectConfig.databaseLogging ?? false),
    },
  }

  const configModules = mergeDefaultModules(configModule.modules)

  await MedusaApp({
    modulesConfig: configModules,
    sharedContainer: container,
    linkModules,
    sharedResourcesConfig,
    injectedDependencies,
    loaderOnly: true,
  })
}

export default loadMedusaApp
