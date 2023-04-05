import {
  Logger,
  MedusaContainer,
  ModuleResolution,
  MODULE_SCOPE,
} from "@medusajs/types"
import { asValue } from "awilix"
import { EOL } from "os"
import { ModulesHelper } from "../module-helper"
import { loadInternalModule } from "./utils"

export const moduleHelper = new ModulesHelper()

async function loadModule(
  container: MedusaContainer,
  resolution: ModuleResolution,
  logger: Logger
): Promise<{ error?: Error } | void> {
  const registrationName = resolution.definition.registrationName

  const { scope, resources } = resolution.moduleDeclaration ?? ({} as any)

  if (scope === MODULE_SCOPE.EXTERNAL) {
    // TODO: implement external Resolvers
    // return loadExternalModule(...)
    throw new Error("External Modules are not supported yet.")
  }

  if (!scope || (scope === MODULE_SCOPE.INTERNAL && !resources)) {
    let message = `The module ${resolution.definition.label} has to define its scope (internal | external)`
    if (scope === MODULE_SCOPE.INTERNAL && !resources) {
      message = `The module ${resolution.definition.label} is missing its resources config`
    }

    container.register({
      [registrationName]: asValue(undefined),
    })

    return {
      error: new Error(message),
    }
  }

  if (!resolution.resolutionPath) {
    container.register({
      [registrationName]: asValue(undefined),
    })

    return
  }

  return await loadInternalModule(container, resolution, logger)
}

export const moduleLoader = async ({
  container,
  moduleResolutions,
  logger,
}: {
  container: MedusaContainer
  moduleResolutions: Record<string, ModuleResolution>
  logger: Logger
}): Promise<void> => {
  for (const resolution of Object.values(moduleResolutions ?? {})) {
    const registrationResult = await loadModule(container, resolution, logger!)

    if (registrationResult?.error) {
      const { error } = registrationResult
      if (resolution.definition.isRequired) {
        logger?.error(
          `Could not resolve required module: ${resolution.definition.label}. Error: ${error.message}${EOL}`
        )
        throw error
      }

      logger?.warn(
        `Could not resolve module: ${resolution.definition.label}. Error: ${error.message}${EOL}`
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
