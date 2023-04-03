import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
  MODULE_RESOURCE_TYPE,
  MODULE_SCOPE,
} from "@medusajs/types"
import { createMedusaContainer } from "@medusajs/utils"
import { asValue } from "awilix"
import { moduleLoader, registerMedusaModule } from "./loaders"
import { loadModuleMigrations } from "./loaders/utils"

const logger: any = {
  log: (a) => console.log(a),
  info: (a) => console.log(a),
  warn: (a) => console.warn(a),
  error: (a) => console.error(a),
}

export class MedusaModule {
  public static async bootstrap(
    moduleKey: string,
    defaultPath: string,
    declaration?: InternalModuleDeclaration | ExternalModuleDeclaration,
    injectedDependencies?: Record<string, any>
  ): Promise<{
    [key: string]: any
  }> {
    let modDeclaration = declaration
    if (declaration?.scope !== MODULE_SCOPE.EXTERNAL) {
      modDeclaration = {
        scope: MODULE_SCOPE.INTERNAL,
        resources: MODULE_RESOURCE_TYPE.ISOLATED,
        resolve: defaultPath,
        options: declaration,
      }
    }

    const container = createMedusaContainer()

    if (injectedDependencies) {
      for (const service in injectedDependencies) {
        container.register(service, asValue(injectedDependencies[service]))
      }
    }

    const moduleResolutions = registerMedusaModule(moduleKey, modDeclaration!)

    await moduleLoader({ container, moduleResolutions, logger })

    const services = {}

    for (const resolution of Object.values(moduleResolutions)) {
      const keyName = resolution.definition.key
      const registrationName = resolution.definition.registrationName

      services[keyName] = container.resolve(registrationName)
    }

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
