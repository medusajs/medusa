import {
  MedusaApp,
  MedusaAppGetLinksExecutionPlanner,
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
  ILinkMigrationsPlanner,
  InternalModuleDeclaration,
  LoadedModule,
  ModuleDefinition,
  ModuleServiceInitializeOptions,
} from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  isBoolean,
  isObject,
  isPresent,
  upperCaseFirst,
} from "@medusajs/utils"

import { asValue } from "awilix"
import { container as mainContainer } from "./container"
import { configManager } from "./config"

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
    def.registrationName ??= ModulesDefinition[key]?.registrationName ?? key
    def.label ??= ModulesDefinition[key]?.label ?? upperCaseFirst(key)
    def.isQueryable = ModulesDefinition[key]?.isQueryable ?? true

    const orignalDef = value?.definition ?? ModulesDefinition[key]
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

function prepareSharedResourcesAndDeps(
  container: Required<MedusaAppOptions>["sharedContainer"]
) {
  const injectedDependencies = {
    [ContainerRegistrationKeys.PG_CONNECTION]: container.resolve(
      ContainerRegistrationKeys.PG_CONNECTION
    ),
    [ContainerRegistrationKeys.LOGGER]: container.resolve(
      ContainerRegistrationKeys.LOGGER
    ),
  }

  const sharedResourcesConfig: ModuleServiceInitializeOptions = {
    database: {
      clientUrl:
        injectedDependencies[ContainerRegistrationKeys.PG_CONNECTION]?.client
          ?.config?.connection?.connectionString ??
        configManager.config.projectConfig.databaseUrl,
      driverOptions: configManager.config.projectConfig.databaseDriverOptions,
      debug: configManager.config.projectConfig.databaseLogging ?? false,
      schema: configManager.config.projectConfig.databaseSchema,
      database: configManager.config.projectConfig.databaseName,
    },
  }

  return { sharedResourcesConfig, injectedDependencies }
}

/**
 * Run, Revert or Generate the migrations for the medusa app.
 *
 * @param container
 * @param moduleNames
 * @param linkModules
 * @param action
 */
export async function runMedusaAppMigrations({
  container,
  moduleNames,
  linkModules,
  action = "run",
}: {
  container?: MedusaAppOptions["sharedContainer"]
  linkModules?: MedusaAppOptions["linkModules"]
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
  container ??= mainContainer

  const configModules = mergeDefaultModules(configManager.config.modules)

  const { sharedResourcesConfig, injectedDependencies } =
    prepareSharedResourcesAndDeps(container)

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

/**
 * Return an instance of the link module migration planner.
 *
 * @param container
 * @param linkModules
 */
export async function getLinksExecutionPlanner({
  container,
  linkModules,
}: {
  container?: MedusaAppOptions["sharedContainer"]
  linkModules?: MedusaAppOptions["linkModules"]
}): Promise<ILinkMigrationsPlanner> {
  container ??= mainContainer

  const configModules = mergeDefaultModules(configManager.config.modules)
  const { sharedResourcesConfig, injectedDependencies } =
    prepareSharedResourcesAndDeps(container)

  const migrationOptions = {
    modulesConfig: configModules,
    sharedContainer: container,
    linkModules,
    sharedResourcesConfig,
    injectedDependencies,
  }

  return await MedusaAppGetLinksExecutionPlanner(migrationOptions)
}

export const loadMedusaApp = async (
  {
    container,
    linkModules,
  }: {
    container?: MedusaAppOptions["sharedContainer"]
    linkModules?: MedusaAppOptions["linkModules"]
  } = {},
  config = { registerInContainer: true }
): Promise<MedusaAppOutput> => {
  container ??= mainContainer

  const configModule: ConfigModule = container.resolve(
    ContainerRegistrationKeys.CONFIG_MODULE
  )

  const { sharedResourcesConfig, injectedDependencies } =
    prepareSharedResourcesAndDeps(container)

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

  // Register all unresolved modules as undefined to be present in the container with undefined value by default
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
 * @param linkModules extra link modules to be registered
 * @param container
 */
export async function runModulesLoader({
  linkModules,
  container,
}: {
  linkModules?: MedusaAppOptions["linkModules"]
  container?: MedusaAppOptions["sharedContainer"]
}): Promise<void> {
  container ??= mainContainer

  const { sharedResourcesConfig, injectedDependencies } =
    prepareSharedResourcesAndDeps(container)
  const configModules = mergeDefaultModules(configManager.config.modules)

  await MedusaApp({
    modulesConfig: configModules,
    sharedContainer: container,
    linkModules,
    sharedResourcesConfig,
    injectedDependencies,
    loaderOnly: true,
  })
}
