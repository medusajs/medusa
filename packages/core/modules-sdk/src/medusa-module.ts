import {
  ExternalModuleDeclaration,
  IModuleService,
  InternalModuleDeclaration,
  LinkModuleDefinition,
  LoadedModule,
  MedusaContainer,
  ModuleBootstrapDeclaration,
  ModuleDefinition,
  ModuleExports,
  ModuleJoinerConfig,
  ModuleResolution,
} from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  createMedusaContainer,
  promiseAll,
  simpleHash,
  stringifyCircular,
} from "@medusajs/utils"
import { asValue } from "awilix"
import { EOL } from "os"
import {
  moduleLoader,
  registerMedusaLinkModule,
  registerMedusaModule,
} from "./loaders"
import { loadModuleMigrations } from "./loaders/utils"
import { MODULE_SCOPE } from "./types"

const logger: any = {
  log: (a) => console.log(a),
  info: (a) => console.log(a),
  warn: (a) => console.warn(a),
  error: (a) => console.error(a),
}

declare global {
  interface MedusaModule {
    getLoadedModules(
      aliases?: Map<string, string>
    ): { [key: string]: LoadedModule }[]
    getModuleInstance(moduleKey: string, alias?: string): LoadedModule
  }
}

type ModuleAlias = {
  key: string
  hash: string
  isLink: boolean
  alias?: string
  main?: boolean
}

export type MigrationOptions = {
  moduleKey: string
  modulePath: string
  container?: MedusaContainer
  options?: Record<string, any>
  moduleExports?: ModuleExports
}

export type ModuleBootstrapOptions = {
  moduleKey: string
  defaultPath: string
  declaration?: ModuleBootstrapDeclaration
  moduleExports?: ModuleExports
  sharedContainer?: MedusaContainer
  moduleDefinition?: ModuleDefinition
  injectedDependencies?: Record<string, any>
  /**
   * In this mode, all instances are partially loaded, meaning that the module will not be fully loaded and the services will not be available.
   * Don't forget to clear the instances (MedusaModule.clearInstances()) after the migration are done.
   */
  migrationOnly?: boolean
  /**
   * Forces the modules bootstrapper to only run the modules loaders and return prematurely. This
   * is meant for modules that have data loader. In a test env, in order to clear all data
   * and load them back, we need to run those loader again
   */
  loaderOnly?: boolean
  workerMode?: "shared" | "worker" | "server"
}

export type LinkModuleBootstrapOptions = {
  definition: LinkModuleDefinition
  declaration?: InternalModuleDeclaration
  moduleExports?: ModuleExports
  injectedDependencies?: Record<string, any>
}

export type RegisterModuleJoinerConfig =
  | ModuleJoinerConfig
  | ((modules: ModuleJoinerConfig[]) => ModuleJoinerConfig)

class MedusaModule {
  private static instances_: Map<string, { [key: string]: IModuleService }> =
    new Map()
  private static modules_: Map<string, ModuleAlias[]> = new Map()
  private static customLinks_: RegisterModuleJoinerConfig[] = []
  private static loading_: Map<string, Promise<any>> = new Map()
  private static joinerConfig_: Map<string, ModuleJoinerConfig> = new Map()
  private static moduleResolutions_: Map<string, ModuleResolution> = new Map()

  public static getLoadedModules(
    aliases?: Map<string, string>
  ): { [key: string]: LoadedModule }[] {
    return [...MedusaModule.modules_.entries()].map(([key]) => {
      if (aliases?.has(key)) {
        return MedusaModule.getModuleInstance(key, aliases.get(key))
      }

      return MedusaModule.getModuleInstance(key)
    })
  }

  public static onApplicationStart(onApplicationStartCb?: () => void): void {
    for (const instances of MedusaModule.instances_.values()) {
      for (const instance of Object.values(instances) as IModuleService[]) {
        if (instance?.__hooks) {
          instance.__hooks?.onApplicationStart
            ?.bind(instance)()
            .then(() => {
              onApplicationStartCb?.()
            })
            .catch(() => {
              // The module should handle this and log it
              return void 0
            })
        }
      }
    }
  }
  public static async onApplicationShutdown(): Promise<void> {
    await promiseAll(
      [...MedusaModule.instances_.values()]
        .map((instances) => {
          return Object.values(instances).map((instance: IModuleService) => {
            return instance.__hooks?.onApplicationShutdown
              ?.bind(instance)()
              .catch(() => {
                // The module should handle this and log it
                return void 0
              })
          })
        })
        .flat()
    )
  }

  public static async onApplicationPrepareShutdown(): Promise<void> {
    await promiseAll(
      [...MedusaModule.instances_.values()]
        .map((instances) => {
          return Object.values(instances).map((instance: IModuleService) => {
            return instance.__hooks?.onApplicationPrepareShutdown
              ?.bind(instance)()
              .catch(() => {
                // The module should handle this and log it
                return void 0
              })
          })
        })
        .flat()
    )
  }

  public static clearInstances(): void {
    MedusaModule.instances_.clear()
    MedusaModule.modules_.clear()
    MedusaModule.joinerConfig_.clear()
    MedusaModule.moduleResolutions_.clear()
    MedusaModule.customLinks_.length = 0
  }

  public static isInstalled(moduleKey: string, alias?: string): boolean {
    if (alias) {
      return (
        MedusaModule.modules_.has(moduleKey) &&
        MedusaModule.modules_.get(moduleKey)!.some((m) => m.alias === alias)
      )
    }

    return MedusaModule.modules_.has(moduleKey)
  }

  public static getJoinerConfig(moduleKey: string): ModuleJoinerConfig {
    return MedusaModule.joinerConfig_.get(moduleKey)!
  }

  public static getAllJoinerConfigs(): ModuleJoinerConfig[] {
    return [...MedusaModule.joinerConfig_.values()]
  }

  public static getModuleResolutions(moduleKey: string): ModuleResolution {
    return MedusaModule.moduleResolutions_.get(moduleKey)!
  }

  public static getAllModuleResolutions(): ModuleResolution[] {
    return [...MedusaModule.moduleResolutions_.values()]
  }

  public static setModuleResolution(
    moduleKey: string,
    resolution: ModuleResolution
  ): ModuleResolution {
    MedusaModule.moduleResolutions_.set(moduleKey, resolution)

    return resolution
  }

  public static setJoinerConfig(
    moduleKey: string,
    config: ModuleJoinerConfig
  ): ModuleJoinerConfig {
    MedusaModule.joinerConfig_.set(moduleKey, config)

    return config
  }

  public static setCustomLink(config: RegisterModuleJoinerConfig): void {
    MedusaModule.customLinks_.push(config)
  }

  public static getCustomLinks(): RegisterModuleJoinerConfig[] {
    return MedusaModule.customLinks_
  }

  public static getModuleInstance(
    moduleKey: string,
    alias?: string
  ): any | undefined {
    if (!MedusaModule.modules_.has(moduleKey)) {
      return
    }

    let mod
    const modules = MedusaModule.modules_.get(moduleKey)!
    if (alias) {
      mod = modules.find((m) => m.alias === alias)

      return MedusaModule.instances_.get(mod?.hash)
    }

    mod = modules.find((m) => m.main) ?? modules[0]

    return MedusaModule.instances_.get(mod?.hash)
  }

  private static registerModule(
    moduleKey: string,
    loadedModule: ModuleAlias
  ): void {
    if (!MedusaModule.modules_.has(moduleKey)) {
      MedusaModule.modules_.set(moduleKey, [])
    }

    const modules = MedusaModule.modules_.get(moduleKey)!

    if (modules.some((m) => m.alias === loadedModule.alias)) {
      throw new Error(
        `Module ${moduleKey} already registed as '${loadedModule.alias}'. Please choose a different alias.`
      )
    }

    if (loadedModule.main) {
      if (modules.some((m) => m.main)) {
        throw new Error(`Module ${moduleKey} already have a 'main' registered.`)
      }
    }

    modules.push(loadedModule)
    MedusaModule.modules_.set(moduleKey, modules!)
  }

  /**
   * Load all modules and resolve them once they are loaded
   * @param modulesOptions
   * @param migrationOnly
   * @param loaderOnly
   * @param workerMode
   */
  public static async bootstrapAll(
    modulesOptions: Omit<
      ModuleBootstrapOptions,
      "migrationOnly" | "loaderOnly" | "workerMode"
    >[],
    {
      migrationOnly,
      loaderOnly,
      workerMode,
    }: {
      migrationOnly?: boolean
      loaderOnly?: boolean
      workerMode?: ModuleBootstrapOptions["workerMode"]
    }
  ): Promise<
    {
      [key: string]: any
    }[]
  > {
    return await MedusaModule.bootstrap_(modulesOptions, {
      migrationOnly,
      loaderOnly,
      workerMode,
    })
  }

  /**
   * Load a single module and resolve it once it is loaded
   * @param moduleKey
   * @param defaultPath
   * @param declaration
   * @param moduleExports
   * @param sharedContainer
   * @param moduleDefinition
   * @param injectedDependencies
   * @param migrationOnly
   * @param loaderOnly
   * @param workerMode
   */
  public static async bootstrap<T>({
    moduleKey,
    defaultPath,
    declaration,
    moduleExports,
    sharedContainer,
    moduleDefinition,
    injectedDependencies,
    migrationOnly,
    loaderOnly,
    workerMode,
  }: ModuleBootstrapOptions): Promise<{
    [key: string]: T
  }> {
    const [service] = await MedusaModule.bootstrap_(
      [
        {
          moduleKey,
          defaultPath,
          declaration,
          moduleExports,
          sharedContainer,
          moduleDefinition,
          injectedDependencies,
        },
      ],
      {
        migrationOnly,
        loaderOnly,
        workerMode,
      }
    )

    return service as {
      [key: string]: T
    }
  }

  /**
   * Load all modules and then resolve them once they are loaded
   *
   * @param modulesOptions
   * @param migrationOnly
   * @param loaderOnly
   * @param workerMode
   * @protected
   */
  protected static async bootstrap_<T>(
    modulesOptions: Omit<
      ModuleBootstrapOptions,
      "migrationOnly" | "loaderOnly" | "workerMode"
    >[],
    {
      migrationOnly,
      loaderOnly,
      workerMode,
    }: {
      migrationOnly?: boolean
      loaderOnly?: boolean
      workerMode?: "shared" | "worker" | "server"
    }
  ): Promise<
    {
      [key: string]: T
    }[]
  > {
    let loadedModules: {
      hashKey: string
      modDeclaration: InternalModuleDeclaration | ExternalModuleDeclaration
      moduleResolutions: Record<string, ModuleResolution>
      container: MedusaContainer
      finishLoading: (arg: { [Key: string]: any }) => void
    }[] = []

    const services: { [Key: string]: any }[] = []

    for (const moduleOptions of modulesOptions) {
      const {
        moduleKey,
        defaultPath,
        declaration,
        moduleExports,
        sharedContainer,
        moduleDefinition,
        injectedDependencies,
      } = moduleOptions

      const hashKey = simpleHash(
        stringifyCircular({ moduleKey, defaultPath, declaration })
      )

      let finishLoading: any
      let errorLoading: any

      const loadingPromise = new Promise((resolve, reject) => {
        finishLoading = resolve
        errorLoading = reject
      })

      if (!loaderOnly && MedusaModule.instances_.has(hashKey)) {
        services.push(MedusaModule.instances_.get(hashKey)!)
        continue
      }

      if (!loaderOnly && MedusaModule.loading_.has(hashKey)) {
        services.push(await MedusaModule.loading_.get(hashKey))
        continue
      }

      if (!loaderOnly) {
        MedusaModule.loading_.set(hashKey, loadingPromise)
      }

      let modDeclaration =
        declaration ??
        ({} as InternalModuleDeclaration | ExternalModuleDeclaration)

      if (declaration?.scope !== MODULE_SCOPE.EXTERNAL) {
        modDeclaration = {
          scope: declaration?.scope || MODULE_SCOPE.INTERNAL,
          resolve: defaultPath,
          options: declaration?.options ?? declaration,
          dependencies:
            (declaration as InternalModuleDeclaration)?.dependencies ?? [],
          alias: declaration?.alias,
          main: declaration?.main,
          worker_mode: workerMode,
        } as InternalModuleDeclaration
      }

      const container = sharedContainer ?? createMedusaContainer()

      if (injectedDependencies) {
        for (const service in injectedDependencies) {
          container.register(service, asValue(injectedDependencies[service]))
          if (!container.hasRegistration(service)) {
            container.register(service, asValue(injectedDependencies[service]))
          }
        }
      }

      const moduleResolutions = registerMedusaModule(
        moduleKey,
        modDeclaration!,
        moduleExports,
        moduleDefinition
      )

      const logger_ =
        container.resolve(ContainerRegistrationKeys.LOGGER, {
          allowUnregistered: true,
        }) ?? logger

      try {
        await moduleLoader({
          container,
          moduleResolutions,
          logger: logger_,
          migrationOnly,
          loaderOnly,
        })
      } catch (err) {
        errorLoading(err)
        throw err
      }

      loadedModules.push({
        hashKey,
        modDeclaration,
        moduleResolutions,
        container,
        finishLoading,
      })
    }

    if (loaderOnly) {
      loadedModules.forEach(({ finishLoading }) => finishLoading({}))
      return [{}]
    }

    for (const {
      hashKey,
      modDeclaration,
      moduleResolutions,
      container,
      finishLoading,
    } of loadedModules) {
      const service = await MedusaModule.resolveLoadedModule({
        hashKey,
        modDeclaration,
        moduleResolutions,
        container,
      })

      MedusaModule.instances_.set(hashKey, service)
      finishLoading(service)
      MedusaModule.loading_.delete(hashKey)
      services.push(service)
    }

    return services
  }

  /**
   * Resolve all the modules once they all have been loaded through the bootstrap
   * and store their references in the instances_ map and return them
   *
   * @param hashKey
   * @param modDeclaration
   * @param moduleResolutions
   * @param container
   * @private
   */
  private static async resolveLoadedModule({
    hashKey,
    modDeclaration,
    moduleResolutions,
    container,
  }: {
    hashKey: string
    modDeclaration: InternalModuleDeclaration | ExternalModuleDeclaration
    moduleResolutions: Record<string, ModuleResolution>
    container: MedusaContainer
  }): Promise<{
    [key: string]: any
  }> {
    const logger_ =
      container.resolve(ContainerRegistrationKeys.LOGGER, {
        allowUnregistered: true,
      }) ?? logger

    const services: { [key: string]: any } = {}

    for (const resolution of Object.values(
      moduleResolutions
    ) as ModuleResolution[]) {
      const keyName = resolution.definition.key

      services[keyName] = container.resolve(keyName)
      services[keyName].__definition = resolution.definition

      if (resolution.definition.isQueryable) {
        let joinerConfig!: ModuleJoinerConfig

        try {
          // TODO: rework that to store on a separate property
          joinerConfig = await services[keyName].__joinerConfig?.()
        } catch {
          // noop
        }

        if (!joinerConfig) {
          throw new Error(
            `Your module is missing a joiner config: ${keyName}. If this module is not queryable, please set { definition: { isQueryable: false } } in your module configuration.`
          )
        }

        if (!joinerConfig.primaryKeys) {
          logger_.warn(
            `Primary keys are not defined by the module ${keyName}. Setting default primary key to 'id'${EOL}`
          )

          joinerConfig.primaryKeys = ["id"]
        }

        services[keyName].__joinerConfig = joinerConfig
        MedusaModule.setJoinerConfig(keyName, joinerConfig)
      }

      MedusaModule.setModuleResolution(keyName, resolution)

      MedusaModule.registerModule(keyName, {
        key: keyName,
        hash: hashKey,
        alias: modDeclaration.alias ?? hashKey,
        main: !!modDeclaration.main,
        isLink: false,
      })
    }

    return services
  }

  public static async bootstrapLink({
    definition,
    declaration,
    moduleExports,
    injectedDependencies,
  }: LinkModuleBootstrapOptions): Promise<{
    [key: string]: unknown
  }> {
    const moduleKey = definition.key
    const hashKey = simpleHash(stringifyCircular({ moduleKey, declaration }))

    if (MedusaModule.instances_.has(hashKey)) {
      return { [moduleKey]: MedusaModule.instances_.get(hashKey) }
    }

    if (MedusaModule.loading_.has(hashKey)) {
      return await MedusaModule.loading_.get(hashKey)
    }

    let finishLoading: any
    let errorLoading: any
    MedusaModule.loading_.set(
      hashKey,
      new Promise((resolve, reject) => {
        finishLoading = resolve
        errorLoading = reject
      })
    )

    let modDeclaration =
      declaration ?? ({} as Partial<InternalModuleDeclaration>)

    const moduleDefinition: ModuleDefinition = {
      key: definition.key,
      dependencies: definition.dependencies,
      defaultPackage: "",
      label: definition.label,
      isRequired: false,
      isQueryable: true,
      defaultModuleDeclaration: definition.defaultModuleDeclaration,
    }

    modDeclaration = {
      resolve: "",
      options: declaration,
      alias: declaration?.alias,
      main: declaration?.main,
    }

    const container = createMedusaContainer()

    if (injectedDependencies) {
      for (const service in injectedDependencies) {
        container.register(service, asValue(injectedDependencies[service]))
      }
    }

    const moduleResolutions = registerMedusaLinkModule(
      moduleDefinition,
      modDeclaration as InternalModuleDeclaration,
      moduleExports
    )

    const logger_ =
      container.resolve(ContainerRegistrationKeys.LOGGER, {
        allowUnregistered: true,
      }) ?? logger

    try {
      await moduleLoader({
        container,
        moduleResolutions,
        logger: logger_,
      })
    } catch (err) {
      errorLoading(err)
      throw err
    }

    const services = {}

    for (const resolution of Object.values(
      moduleResolutions
    ) as ModuleResolution[]) {
      const keyName = resolution.definition.key

      services[keyName] = container.resolve(keyName)
      services[keyName].__definition = resolution.definition

      if (resolution.definition.isQueryable) {
        let joinerConfig!: ModuleJoinerConfig

        try {
          joinerConfig = await services[keyName].__joinerConfig?.()
        } catch {
          // noop
        }

        if (!joinerConfig) {
          throw new Error(
            `Your module is missing a joiner config: ${keyName}. If this module is not queryable, please set { definition: { isQueryable: false } } in your module configuration.`
          )
        }

        services[keyName].__joinerConfig = joinerConfig
        MedusaModule.setJoinerConfig(keyName, joinerConfig)

        if (!joinerConfig.isLink) {
          throw new Error(
            "MedusaModule.bootstrapLink must be used only for Link Modules"
          )
        }
      }

      MedusaModule.setModuleResolution(keyName, resolution)
      MedusaModule.registerModule(keyName, {
        key: keyName,
        hash: hashKey,
        alias: modDeclaration.alias ?? hashKey,
        main: !!modDeclaration.main,
        isLink: true,
      })
    }

    MedusaModule.instances_.set(hashKey, services)
    finishLoading(services)
    MedusaModule.loading_.delete(hashKey)

    return services
  }

  public static async migrateGenerate({
    options,
    container,
    moduleExports,
    moduleKey,
    modulePath,
  }: MigrationOptions): Promise<void> {
    const moduleResolutions = registerMedusaModule(moduleKey, {
      scope: MODULE_SCOPE.INTERNAL,
      resolve: modulePath,
      options,
    })

    const logger_ =
      container?.resolve(ContainerRegistrationKeys.LOGGER, {
        allowUnregistered: true,
      }) ?? logger

    container ??= createMedusaContainer()

    for (const mod in moduleResolutions) {
      const { generateMigration } = await loadModuleMigrations(
        moduleResolutions[mod],
        moduleExports
      )

      if (typeof generateMigration === "function") {
        await generateMigration({
          options,
          container: container!,
          logger: logger_,
        })
      }
    }
  }

  public static async migrateUp({
    options,
    container,
    moduleExports,
    moduleKey,
    modulePath,
  }: MigrationOptions): Promise<void> {
    const moduleResolutions = registerMedusaModule(moduleKey, {
      scope: MODULE_SCOPE.INTERNAL,
      resolve: modulePath,
      options,
    })

    const logger_ =
      container?.resolve(ContainerRegistrationKeys.LOGGER, {
        allowUnregistered: true,
      }) ?? logger

    container ??= createMedusaContainer()

    for (const mod in moduleResolutions) {
      const { runMigrations } = await loadModuleMigrations(
        moduleResolutions[mod],
        moduleExports
      )

      if (typeof runMigrations === "function") {
        await runMigrations({
          options,
          container: container!,
          logger: logger_,
        })
      }
    }
  }

  public static async migrateDown({
    options,
    container,
    moduleExports,
    moduleKey,
    modulePath,
  }: MigrationOptions): Promise<void> {
    const moduleResolutions = registerMedusaModule(moduleKey, {
      scope: MODULE_SCOPE.INTERNAL,
      resolve: modulePath,
      options,
    })

    const logger_ =
      container?.resolve(ContainerRegistrationKeys.LOGGER, {
        allowUnregistered: true,
      }) ?? logger

    container ??= createMedusaContainer()

    for (const mod in moduleResolutions) {
      const { revertMigration } = await loadModuleMigrations(
        moduleResolutions[mod],
        moduleExports
      )

      if (typeof revertMigration === "function") {
        await revertMigration({
          options,
          container: container!,
          logger: logger_,
        })
      }
    }
  }
}

global.MedusaModule ??= MedusaModule
const GlobalMedusaModule = global.MedusaModule as typeof MedusaModule

export { GlobalMedusaModule as MedusaModule }
