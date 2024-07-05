import {
  InternalModuleDeclaration,
  Logger,
  MedusaContainer,
  MODULE_RESOURCE_TYPE,
  ModuleExports,
  ModuleResolution,
} from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  createMedusaContainer,
  MedusaModuleType,
} from "@medusajs/utils"
import { asFunction, asValue } from "awilix"

export async function loadInternalModule(
  container: MedusaContainer,
  resolution: ModuleResolution,
  logger: Logger,
  migrationOnly?: boolean,
  loaderOnly?: boolean
): Promise<{ error?: Error } | void> {
  const registrationName = !loaderOnly
    ? resolution.definition.registrationName
    : resolution.definition.registrationName + "__loaderOnly"

  const { resources } =
    resolution.moduleDeclaration as InternalModuleDeclaration

  let loadedModule: ModuleExports
  try {
    // When loading manually, we pass the exports to be loaded, meaning that we do not need to import the package to find
    // the exports. This is useful when a package export an initialize function which will bootstrap itself and therefore
    // does not need to import the package that is currently being loaded as it would create a
    // circular reference.
    const modulePath = resolution.resolutionPath as string

    if (resolution.moduleExports) {
      loadedModule = resolution.moduleExports
    } else {
      loadedModule = await import(modulePath)
      loadedModule = (loadedModule as any).default
    }
  } catch (error) {
    if (
      resolution.definition.isRequired &&
      resolution.definition.defaultPackage
    ) {
      return {
        error: new Error(
          `Make sure you have installed the default package: ${resolution.definition.defaultPackage}`
        ),
      }
    }

    return { error }
  }

  if (!loadedModule?.service) {
    container.register({
      [registrationName]: asValue(undefined),
    })

    return {
      error: new Error(
        "No service found in module. Make sure your module exports a service."
      ),
    }
  }

  if (migrationOnly) {
    // Partially loaded module, only register the service __joinerConfig function to be able to resolve it later
    const moduleService = {
      __joinerConfig: loadedModule.service.prototype.__joinerConfig,
    }
    container.register({
      [registrationName]: asValue(moduleService),
    })
    return
  }

  const localContainer = createMedusaContainer()

  const dependencies = resolution?.dependencies ?? []
  if (resources === MODULE_RESOURCE_TYPE.SHARED) {
    dependencies.push(
      ContainerRegistrationKeys.MANAGER,
      ContainerRegistrationKeys.CONFIG_MODULE,
      ContainerRegistrationKeys.LOGGER,
      ContainerRegistrationKeys.PG_CONNECTION
    )
  }

  for (const dependency of dependencies) {
    localContainer.register(
      dependency,
      asFunction(() => {
        return container.resolve(dependency, { allowUnregistered: true })
      })
    )
  }

  const moduleLoaders = loadedModule?.loaders ?? []
  try {
    for (const loader of moduleLoaders) {
      await loader(
        {
          container: localContainer,
          logger,
          options: resolution.options,
          dataLoaderOnly: loaderOnly,
        },
        resolution.moduleDeclaration as InternalModuleDeclaration
      )
    }
  } catch (err) {
    container.register({
      [registrationName]: asValue(undefined),
    })

    return {
      error: new Error(
        `Loaders for module ${resolution.definition.label} failed: ${err.message}`
      ),
    }
  }

  const moduleService = loadedModule.service

  container.register({
    [registrationName]: asFunction((cradle) => {
      ;(moduleService as any).__type = MedusaModuleType
      return new moduleService(
        localContainer.cradle,
        resolution.options,
        resolution.moduleDeclaration
      )
    }).singleton(),
  })

  if (loaderOnly) {
    // The expectation is only to run the loader as standalone, so we do not need to register the service and we need to cleanup all services
    const service = container.resolve(registrationName)
    await service.__hooks?.onApplicationPrepareShutdown()
    await service.__hooks?.onApplicationShutdown()
  }
}

export async function loadModuleMigrations(
  resolution: ModuleResolution,
  moduleExports?: ModuleExports
): Promise<[Function | undefined, Function | undefined]> {
  let loadedModule: ModuleExports
  try {
    loadedModule =
      moduleExports ?? (await import(resolution.resolutionPath as string))

    return [loadedModule.runMigrations, loadedModule.revertMigration]
  } catch {
    return [undefined, undefined]
  }
}
