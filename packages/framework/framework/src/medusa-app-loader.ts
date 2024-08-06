import {
  MedusaApp,
  MedusaAppGetLinksExecutionPlanner,
  MedusaAppMigrateDown,
  MedusaAppMigrateGenerate,
  MedusaAppMigrateUp,
  MedusaAppOutput,
  ModulesDefinition,
  RegisterModuleJoinerConfig,
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
import { pgConnectionLoader } from "./database"

import { asValue } from "awilix"
import {
  container,
  container as mainContainer,
  MedusaContainer,
} from "./container"
import { configManager } from "./config"

export class MedusaAppLoader {
  /**
   * Container from where to resolve resources
   * @private
   */
  readonly #container: MedusaContainer

  /**
   * Extra links modules config which should be added manually to the links to be loaded
   * @private
   */
  readonly #customLinksModules:
    | RegisterModuleJoinerConfig
    | RegisterModuleJoinerConfig[]

  // TODO: Adjust all loaders to accept an optional container such that in test env it is possible if needed to provide a specific container otherwise use the main container
  // Maybe also adjust the different places to resolve the config from the container instead of the configManager for the same reason
  // To be discussed
  constructor({
    container,
    customLinksModules,
  }: {
    container?: MedusaContainer
    customLinksModules?:
      | RegisterModuleJoinerConfig
      | RegisterModuleJoinerConfig[]
  } = {}) {
    this.#container = container ?? mainContainer
    this.#customLinksModules = customLinksModules ?? []
  }

  protected mergeDefaultModules(
    modulesConfig: CommonTypes.ConfigModule["modules"]
  ) {
    const defaultModules = Object.values(ModulesDefinition).filter(
      (definition: ModuleDefinition) => {
        return !!definition.defaultPackage
      }
    )

    const configModules = { ...modulesConfig } ?? {}

    for (const defaultModule of defaultModules as ModuleDefinition[]) {
      configModules[defaultModule.key] ??=
        defaultModule.defaultModuleDeclaration
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

  protected prepareSharedResourcesAndDeps() {
    const injectedDependencies = {
      [ContainerRegistrationKeys.PG_CONNECTION]: this.#container.resolve(
        ContainerRegistrationKeys.PG_CONNECTION
      ),
      [ContainerRegistrationKeys.LOGGER]: this.#container.resolve(
        ContainerRegistrationKeys.LOGGER
      ),
    }

    const sharedResourcesConfig: ModuleServiceInitializeOptions = {
      database: {
        clientUrl:
          (
            injectedDependencies[
              ContainerRegistrationKeys.PG_CONNECTION
            ] as ReturnType<typeof pgConnectionLoader>
          )?.client?.config?.connection?.connectionString ??
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
   * @param moduleNames
   * @param linkModules
   * @param action
   */
  async runModulesMigrations(
    {
      moduleNames,
      action = "run",
    }:
      | {
          moduleNames?: never
          action: "run"
        }
      | {
          moduleNames: string[]
          action: "revert" | "generate"
        } = {
      action: "run",
    }
  ): Promise<void> {
    const configModules = this.mergeDefaultModules(configManager.config.modules)

    const { sharedResourcesConfig, injectedDependencies } =
      this.prepareSharedResourcesAndDeps()

    const migrationOptions = {
      modulesConfig: configModules,
      sharedContainer: this.#container,
      linkModules: this.#customLinksModules,
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
   */
  async getLinksExecutionPlanner(): Promise<ILinkMigrationsPlanner> {
    const configModules = this.mergeDefaultModules(configManager.config.modules)
    const { sharedResourcesConfig, injectedDependencies } =
      this.prepareSharedResourcesAndDeps()

    const migrationOptions = {
      modulesConfig: configModules,
      sharedContainer: this.#container,
      linkModules: this.#customLinksModules,
      sharedResourcesConfig,
      injectedDependencies,
    }

    return await MedusaAppGetLinksExecutionPlanner(migrationOptions)
  }

  /**
   * Run the modules loader without taking care of anything else. This is useful for running the loader as a separate action or to re run all modules loaders.
   */
  async runModulesLoader(): Promise<void> {
    const { sharedResourcesConfig, injectedDependencies } =
      this.prepareSharedResourcesAndDeps()
    const configModules = this.mergeDefaultModules(configManager.config.modules)

    await MedusaApp({
      modulesConfig: configModules,
      sharedContainer: this.#container,
      linkModules: this.#customLinksModules,
      sharedResourcesConfig,
      injectedDependencies,
      loaderOnly: true,
    })
  }

  /**
   * Load all modules and bootstrap all the modules and links to be ready to be consumed
   * @param config
   */
  async load(config = { registerInContainer: true }): Promise<MedusaAppOutput> {
    const configModule: ConfigModule = this.#container.resolve(
      ContainerRegistrationKeys.CONFIG_MODULE
    )

    const { sharedResourcesConfig, injectedDependencies } =
      this.prepareSharedResourcesAndDeps()

    this.#container.register(
      ContainerRegistrationKeys.REMOTE_QUERY,
      asValue(undefined)
    )
    this.#container.register(
      ContainerRegistrationKeys.REMOTE_LINK,
      asValue(undefined)
    )

    const configModules = this.mergeDefaultModules(configModule.modules)

    const medusaApp = await MedusaApp({
      workerMode: configModule.projectConfig.workerMode,
      modulesConfig: configModules,
      sharedContainer: this.#container,
      linkModules: this.#customLinksModules,
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
        container.register(
          moduleDefinition.registrationName,
          asValue(undefined)
        )
      }
    }

    return medusaApp
  }
}
