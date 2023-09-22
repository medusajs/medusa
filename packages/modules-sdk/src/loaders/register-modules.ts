import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
  MODULE_SCOPE,
  ModuleDefinition,
  ModuleExports,
  ModuleResolution,
} from "@medusajs/types"

import { isObject } from "@medusajs/utils"
import resolveCwd from "resolve-cwd"
import { MODULE_DEFINITIONS, ModulesDefinition } from "../definitions"

/**
 *
 * @param modules
 * @param isolatedModules Will be removed once the isolated flag is being removed
 */
// TODO: Remove once we have all modules migrated + rename to something like getResolutions
export const registerModules = (
  modules?: Record<
    string,
    | false
    | string
    | Partial<InternalModuleDeclaration | ExternalModuleDeclaration>
  >,
  { loadLegacyOnly } = { loadLegacyOnly: false }
): Record<string, ModuleResolution> => {
  const moduleResolutions = {} as Record<string, ModuleResolution>
  const projectModules = modules ?? {}

  for (const definition of MODULE_DEFINITIONS) {
    // Skip non legacy modules
    if (loadLegacyOnly && !definition.isLegacy) {
      continue
    }

    const customConfig = projectModules[definition.key]

    const canSkip =
      !customConfig && !definition.isRequired && !definition.defaultPackage

    const isObj = isObject(customConfig)
    if (isObj && customConfig.scope === MODULE_SCOPE.EXTERNAL) {
      // TODO: getExternalModuleResolution(...)
      if (!canSkip) {
        throw new Error("External Modules are not supported yet.")
      }
    }

    moduleResolutions[definition.key] = getInternalModuleResolution(
      definition,
      customConfig as InternalModuleDeclaration
    )
  }

  return moduleResolutions
}

export const registerMedusaModule = (
  moduleKey: string,
  moduleDeclaration:
    | Partial<InternalModuleDeclaration | ExternalModuleDeclaration>
    | string
    | false,
  moduleExports?: ModuleExports,
  definition?: ModuleDefinition
): Record<string, ModuleResolution> => {
  const moduleResolutions = {} as Record<string, ModuleResolution>

  const modDefinition = definition ?? ModulesDefinition[moduleKey]

  if (modDefinition === undefined) {
    throw new Error(`Module: ${moduleKey} is not defined.`)
  }

  if (
    isObject(moduleDeclaration) &&
    moduleDeclaration?.scope === MODULE_SCOPE.EXTERNAL
  ) {
    // TODO: getExternalModuleResolution(...)
    throw new Error("External Modules are not supported yet.")
  }

  moduleResolutions[moduleKey] = getInternalModuleResolution(
    modDefinition,
    moduleDeclaration as InternalModuleDeclaration,
    moduleExports
  )

  return moduleResolutions
}

export const registerMedusaLinkModule = (
  definition: ModuleDefinition,
  moduleDeclaration: Partial<InternalModuleDeclaration>,
  moduleExports?: ModuleExports
): Record<string, ModuleResolution> => {
  const moduleResolutions = {} as Record<string, ModuleResolution>

  moduleResolutions[definition.key] = getInternalModuleResolution(
    definition,
    moduleDeclaration as InternalModuleDeclaration,
    moduleExports
  )

  return moduleResolutions
}

function getInternalModuleResolution(
  definition: ModuleDefinition,
  moduleConfig: InternalModuleDeclaration | string | false,
  moduleExports?: ModuleExports
): ModuleResolution {
  if (typeof moduleConfig === "boolean") {
    if (!moduleConfig && definition.isRequired) {
      throw new Error(`Module: ${definition.label} is required`)
    }

    if (!moduleConfig) {
      return {
        resolutionPath: false,
        definition,
        dependencies: [],
        options: {},
      }
    }
  }

  const isObj = typeof moduleConfig === "object"
  let resolutionPath = definition.defaultPackage

  // If user added a module and it's overridable, we resolve that instead
  const isString = typeof moduleConfig === "string"
  if (definition.canOverride && (isString || (isObj && moduleConfig.resolve))) {
    resolutionPath = !moduleExports
      ? resolveCwd(isString ? moduleConfig : (moduleConfig.resolve as string))
      : // Explicitly assign an empty string, later, we will check if the value is exactly false.
        // This allows to continue the module loading while using the module exports instead of re importing the module itself during the process.
        ""
  }

  const moduleDeclaration = isObj ? moduleConfig : {}
  const additionalDependencies = isObj ? moduleConfig.dependencies || [] : []

  return {
    resolutionPath,
    definition,
    dependencies: [
      ...new Set(
        (definition.dependencies || []).concat(additionalDependencies)
      ),
    ],
    moduleDeclaration: {
      ...(definition.defaultModuleDeclaration ?? {}),
      ...moduleDeclaration,
    },
    moduleExports,
    options: isObj ? moduleConfig.options ?? {} : {},
  }
}
