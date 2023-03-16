import resolveCwd from "resolve-cwd"

import {
  MedusaModuleConfig,
  InternalModuleDeclaration,
  ModuleDefinition,
  ModuleResolution,
  MODULE_SCOPE,
} from "../types"
import MODULE_DEFINITIONS from "../definitions"

export const registerModules = ({
  modules,
}: MedusaModuleConfig): Record<string, ModuleResolution> => {
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
      projectModules[definition.key] as
        | InternalModuleDeclaration
        | false
        | string
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
