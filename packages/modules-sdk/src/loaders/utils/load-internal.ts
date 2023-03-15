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
  const registrationName = resolution.definition.registrationName

  const { scope, resources } =
    resolution.moduleDeclaration as InternalModuleDeclaration

  let loadedModule: ModuleExports
  try {
    loadedModule = (await import(resolution.resolutionPath as string)).default
  } catch (error) {
    return { error }
  }

  if (!loadedModule?.service) {
    container.register({
      [registrationName]: asValue(undefined),
    })

    return {
      error: new Error(
        "No service found in module. Make sure your module exports at least one service."
      ),
    }
  }

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
      localContainer.register(
        dependency,
        asFunction(() => container.resolve(dependency))
      )
    }
  }

  const moduleLoaders = loadedModule?.loaders ?? []
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
      return new moduleService(
        localContainer.cradle,
        resolution.options,
        resolution.moduleDeclaration
      )
    }).singleton(),
  })

  trackInstallation(
    {
      module: resolution.definition.key,
      resolution: resolution.resolutionPath,
    },
    "module"
  )
}
