import { asClass, asFunction, asValue } from "awilix"
import { trackInstallation } from "medusa-telemetry"
import { EntitySchema } from "typeorm"
import {
  ClassConstructor,
  ConfigModule,
  LoaderOptions,
  Logger,
  MedusaContainer,
  ModuleExports,
  ModuleResolution,
  MODULE_RESOURCE_TYPE,
  MODULE_SCOPE,
} from "../types/global"
import { ModulesHelper } from "../utils/module-helper"

export const moduleHelper = new ModulesHelper()

const registerModule = async (
  container: MedusaContainer,
  resolution: ModuleResolution,
  configModule: ConfigModule,
  logger: Logger
): Promise<{ error?: Error } | void> => {
  const constainerName = resolution.definition.registrationName

  const { scope, resources } = resolution.moduleDeclaration ?? {}
  if (!scope || (scope === MODULE_SCOPE.INTERNAL && !resources)) {
    let message = `The module ${resolution.definition.label} has to define its scope (internal | external)`
    if (scope && !resources) {
      message = `The module ${resolution.definition.label} is missing its resources config`
    }

    container.register({
      [constainerName]: asValue(undefined),
    })

    return {
      error: new Error(message),
    }
  }

  if (!resolution.resolutionPath) {
    container.register({
      [constainerName]: asValue(undefined),
    })

    return
  }

  let loadedModule: ModuleExports
  try {
    loadedModule = (await import(resolution.resolutionPath!)).default
  } catch (error) {
    return { error }
  }

  const moduleService = loadedModule?.service || null

  if (!moduleService) {
    return {
      error: new Error(
        "No service found in module. Make sure that your module exports a service."
      ),
    }
  }

  if (
    scope === MODULE_SCOPE.INTERNAL &&
    resources === MODULE_RESOURCE_TYPE.SHARED
  ) {
    const moduleModels = loadedModule?.models || null
    if (moduleModels) {
      moduleModels.map((val: ClassConstructor<unknown>) => {
        container.registerAdd("db_entities", asValue(val))
      })
    }
  }

  // TODO: "cradle" should only contain dependent Modules and the EntityManager if module scope is shared
  container.register({
    [constainerName]: asFunction((cradle) => {
      return new moduleService(
        cradle,
        resolution.options,
        resolution.moduleDeclaration
      )
    }).singleton(),
  })

  const moduleLoaders = loadedModule?.loaders || []
  try {
    for (const loader of moduleLoaders) {
      await loader(
        {
          container,
          configModule,
          logger,
          options: resolution.options,
        },
        resolution.moduleDeclaration
      )
    }
  } catch (err) {
    return {
      error: new Error(
        `Loaders for module ${resolution.definition.label} failed: ${err.message}`
      ),
    }
  }

  trackInstallation(
    {
      module: resolution.definition.key,
      resolution: resolution.resolutionPath,
    },
    "module"
  )
}

export default async ({
  container,
  configModule,
  logger,
}: LoaderOptions): Promise<void> => {
  const moduleResolutions = configModule?.moduleResolutions ?? {}

  for (const resolution of Object.values(moduleResolutions)) {
    const registrationResult = await registerModule(
      container,
      resolution,
      configModule,
      logger!
    )
    if (registrationResult?.error) {
      const { error } = registrationResult
      if (resolution.definition.isRequired) {
        logger?.warn(
          `Could not resolve required module: ${resolution.definition.label}. Error: ${error.message}`
        )
        throw error
      }

      logger?.warn(
        `Could not resolve module: ${resolution.definition.label}. Error: ${error.message}`
      )
    }
  }

  moduleHelper.setModules(
    Object.entries(moduleResolutions).reduce((acc, [k, v]) => {
      if (v.resolutionPath) {
        acc[k] = v
      }
      return acc
    }, {})
  )

  container.register({
    modulesHelper: asValue(moduleHelper),
  })
}
