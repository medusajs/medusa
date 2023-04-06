import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
  ModuleDefinition,
  ModuleResolution,
  MODULE_SCOPE,
} from "@medusajs/types"
import resolveCwd from "resolve-cwd"
import MODULE_DEFINITIONS from "../definitions"

export const registerModules = (
  modules?: Record<
    string,
    | false
    | string
    | Partial<InternalModuleDeclaration | ExternalModuleDeclaration>
  >
): Record<string, ModuleResolution> => {
  const moduleResolutions = {} as Record<string, ModuleResolution>
  const projectModules = modules ?? {}

  for (const definition of MODULE_DEFINITIONS) {
    const customConfig = projectModules[definition.key]
    const isObj = typeof customConfig === "object"

    if (isObj && customConfig.scope === MODULE_SCOPE.EXTERNAL) {
      // TODO: getExternalModuleResolution(...)
      throw new Error("External Modules are not supported yet.")
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
  moduleDeclaration: InternalModuleDeclaration | ExternalModuleDeclaration
): Record<string, ModuleResolution> => {
  const moduleResolutions = {} as Record<string, ModuleResolution>

  for (const definition of MODULE_DEFINITIONS) {
    if (definition.key !== moduleKey) {
      continue
    }

    if (moduleDeclaration.scope === MODULE_SCOPE.EXTERNAL) {
      // TODO: getExternalModuleResolution(...)a
      throw new Error("External Modules are not supported yet.")
    }

    moduleResolutions[definition.key] = getInternalModuleResolution(
      definition,
      moduleDeclaration as InternalModuleDeclaration
    )
  }

  return moduleResolutions
}

function getInternalModuleResolution(
  definition: ModuleDefinition,
  moduleConfig: InternalModuleDeclaration | false | string
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
    resolutionPath = resolveCwd(
      isString ? moduleConfig : (moduleConfig.resolve as string)
    )
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
      ...definition.defaultModuleDeclaration,
      ...moduleDeclaration,
    },
    options: isObj ? moduleConfig.options ?? {} : {},
  }
}
