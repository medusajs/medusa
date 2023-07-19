import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
  JoinerServiceConfig,
  MODULE_RESOURCE_TYPE,
  MODULE_SCOPE,
  ModuleDefinition,
  ModuleExports,
  ModuleResolution,
} from "@medusajs/types"
import {
  createMedusaContainer,
  simpleHash,
  stringifyCircular,
} from "@medusajs/utils"
import { moduleLoader, registerMedusaModule } from "./loaders"

import { asValue } from "awilix"
import { loadModuleMigrations } from "./loaders/utils"

const logger: any = {
  log: (a) => console.log(a),
  info: (a) => console.log(a),
  warn: (a) => console.warn(a),
  error: (a) => console.error(a),
}

declare global {
  interface MedusaModule {
    getLoadedModules(): Map<string, any>
  }
}

type ModuleAlias = {
  key: string
  hash: string
  alias?: string
  main?: boolean
}

export class MedusaModule {
  private static instances_: Map<string, any> = new Map()
  private static modules_: Map<string, ModuleAlias[]> = new Map()
  private static loading_: Map<string, Promise<any>> = new Map()

  public static getLoadedModules(): Map<
    string,
    any & {
      __joinerConfig: JoinerServiceConfig
      __definition: ModuleDefinition
    }
  > {
    return MedusaModule.instances_
  }

  public static clearInstances(): void {
    MedusaModule.instances_.clear()
    MedusaModule.modules_.clear()
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

  public static async bootstrap<T>(
    moduleKey: string,
    defaultPath: string,
    declaration?: InternalModuleDeclaration | ExternalModuleDeclaration,
    moduleExports?: ModuleExports,
    injectedDependencies?: Record<string, any>
  ): Promise<{
    [key: string]: T
  }> {
    const hashKey = simpleHash(
      stringifyCircular({ moduleKey, defaultPath, declaration })
    )

    if (MedusaModule.instances_.has(hashKey)) {
      return MedusaModule.instances_.get(hashKey)
    }

    if (MedusaModule.loading_.has(hashKey)) {
      return MedusaModule.loading_.get(hashKey)
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
      declaration ??
      ({} as InternalModuleDeclaration | ExternalModuleDeclaration)

    if (declaration?.scope !== MODULE_SCOPE.EXTERNAL) {
      modDeclaration = {
        scope: MODULE_SCOPE.INTERNAL,
        resources: MODULE_RESOURCE_TYPE.ISOLATED,
        resolve: defaultPath,
        options: declaration,
        alias: declaration?.alias,
        main: declaration?.main,
      }
    }

    const container = createMedusaContainer()

    if (injectedDependencies) {
      for (const service in injectedDependencies) {
        container.register(service, asValue(injectedDependencies[service]))
      }
    }

    const moduleResolutions = registerMedusaModule(
      moduleKey,
      modDeclaration!,
      moduleExports
    )

    try {
      await moduleLoader({
        container,
        moduleResolutions,
        logger,
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
      const registrationName = resolution.definition.registrationName

      services[keyName] = container.resolve(registrationName)
      services[keyName].__definition = resolution.definition

      if (resolution.definition.isQueryable) {
        services[keyName].__joinerConfig = await services[
          keyName
        ].__joinerConfig()
      }

      MedusaModule.registerModule(keyName, {
        key: keyName,
        hash: hashKey,
        alias: modDeclaration.alias ?? hashKey,
        main: !!modDeclaration.main,
      })
    }

    MedusaModule.instances_.set(hashKey, services)
    finishLoading(services)
    MedusaModule.loading_.delete(hashKey)

    return services
  }

  public static async migrateUp(
    moduleKey: string,
    modulePath: string,
    options?: Record<string, any>
  ): Promise<void> {
    const moduleResolutions = registerMedusaModule(moduleKey, {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.ISOLATED,
      resolve: modulePath,
      options,
    })

    for (const mod in moduleResolutions) {
      const [migrateUp] = await loadModuleMigrations(moduleResolutions[mod])

      if (typeof migrateUp === "function") {
        await migrateUp({
          options,
          logger,
        })
      }
    }
  }

  public static async migrateDown(
    moduleKey: string,
    modulePath: string,
    options?: Record<string, any>
  ): Promise<void> {
    const moduleResolutions = registerMedusaModule(moduleKey, {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.ISOLATED,
      resolve: modulePath,
      options,
    })

    for (const mod in moduleResolutions) {
      const [, migrateDown] = await loadModuleMigrations(moduleResolutions[mod])

      if (typeof migrateDown === "function") {
        await migrateDown({
          options,
          logger,
        })
      }
    }
  }
}
