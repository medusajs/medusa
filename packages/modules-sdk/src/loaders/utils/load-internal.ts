import { asFunction, asValue } from "awilix"
import { createMedusaContainer } from "medusa-core-utils"
import { trackInstallation } from "medusa-telemetry"
import {
  Constructor,
  InternalModuleDeclaration,
  Logger,
  MedusaContainer,
  ModuleExports,
  ModuleResolution,
  MODULE_RESOURCE_TYPE,
  MODULE_SCOPE,
} from "../../types"

export async function loadInternalModule(
  container: MedusaContainer,
  resolution: ModuleResolution,
  logger: Logger
): Promise<{ error?: Error } | void> {
  const constainerName = resolution.definition.registrationName

  const { scope, resources } =
    resolution.moduleDeclaration as InternalModuleDeclaration

  let loadedModule: ModuleExports
  try {
    loadedModule = (await import(resolution.resolutionPath as string)).default
  } catch (error) {
    return { error }
  }

  if (!loadedModule?.services || !loadedModule?.services.length) {
    container.register({
      [constainerName]: asValue(undefined),
    })

    return {
      error: new Error(
        "No service found in module. Make sure your module exports at least one service."
      ),
    }
  }

  const moduleServices = Array.isArray(loadedModule?.services)
    ? loadedModule.services
    : [loadedModule.services]

  if (
    scope === MODULE_SCOPE.INTERNAL &&
    resources === MODULE_RESOURCE_TYPE.SHARED
  ) {
    const moduleModels = loadedModule?.models || null
    if (moduleModels) {
      moduleModels.map((val: Constructor<unknown>) => {
        container.registerAdd("db_entities", asValue(val))
      })
    }
  }

  const localContainer =
    resources === MODULE_RESOURCE_TYPE.ISOLATED
      ? createMedusaContainer()
      : (container.createScope() as MedusaContainer)

  if (resources === MODULE_RESOURCE_TYPE.ISOLATED) {
    const moduleDependencies = resolution?.dependencies ?? []

    for (const dependency of moduleDependencies) {
      if (!container.hasRegistration(dependency)) {
        continue
      }

      localContainer.register(
        dependency,
        asFunction(() => container.resolve(dependency))
      )
    }
  }

  const moduleLoaders = loadedModule?.loaders || []
  try {
    for (const loader of moduleLoaders) {
      await loader(
        {
          container: localContainer,
          logger,
          options: resolution.options,
        },
        resolution.moduleDeclaration as InternalModuleDeclaration
      )
    }
  } catch (err) {
    container.register({
      [constainerName]: asValue(undefined),
    })

    return {
      error: new Error(
        `Loaders for module ${resolution.definition.label} failed: ${err.message}`
      ),
    }
  }

  for (const moduleService of moduleServices) {
    container.register({
      [constainerName]: asFunction((cradle) => {
        return new moduleService(
          localContainer.cradle,
          resolution.options,
          resolution.moduleDeclaration
        )
      }).singleton(),
    })
  }

  trackInstallation(
    {
      module: resolution.definition.key,
      resolution: resolution.resolutionPath,
    },
    "module"
  )
}
