import { Logger, MedusaContainer, ModuleResolution } from "@medusajs/types"
import { promiseAll } from "@medusajs/utils"
import { asValue } from "@medusajs/deps/awilix"
import { EOL } from "os"
import { MODULE_SCOPE } from "../types"
import { loadInternalModule } from "./utils"

export const moduleLoader = async ({
  container,
  moduleResolutions,
  logger,
  migrationOnly,
  loaderOnly,
  schemaOnly,
}: {
  container: MedusaContainer
  moduleResolutions: Record<string, ModuleResolution>
  logger: Logger
  migrationOnly?: boolean
  loaderOnly?: boolean
  schemaOnly?: boolean
}): Promise<void> => {
  const resolutions = Object.values(moduleResolutions ?? {})
  const results = await promiseAll(
    resolutions.map((resolution) =>
      loadModule(
        container,
        resolution,
        logger!,
        migrationOnly,
        loaderOnly,
        schemaOnly
      )
    )
  )

  results.forEach((registrationResult, idx) => {
    if (registrationResult?.error) {
      const { error } = registrationResult
      logger?.error(
        `Could not resolve module: ${resolutions[idx].definition.label}. Error: ${error.message}${EOL}`
      )
      throw error
    }
  })
}

async function loadModule(
  container: MedusaContainer,
  resolution: ModuleResolution,
  logger: Logger,
  migrationOnly?: boolean,
  loaderOnly?: boolean,
  schemaOnly?: boolean
): Promise<{ error?: Error } | void> {
  const modDefinition = resolution.definition

  if (!modDefinition.key) {
    throw new Error(`Module definition is missing property "key"`)
  }

  const keyName = modDefinition.key
  const { scope } = resolution.moduleDeclaration ?? ({} as any)

  const canSkip =
    !resolution.resolutionPath &&
    !modDefinition.isRequired &&
    !modDefinition.defaultPackage

  if (scope === MODULE_SCOPE.EXTERNAL && !canSkip) {
    // TODO: implement external Resolvers
    // return loadExternalModule(...)
    throw new Error("External Modules are not supported yet.")
  }

  if (!scope) {
    let message = `The module ${resolution.definition.label} has to define its scope (internal | external)`

    container.register(keyName, asValue(undefined))

    return {
      error: new Error(message),
    }
  }

  if (resolution.resolutionPath === false) {
    container.register(keyName, asValue(undefined))

    return
  }

  return await loadInternalModule({
    container,
    resolution,
    logger,
    migrationOnly,
    loaderOnly,
    schemaOnly,
  })
}
