import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
  MODULE_RESOURCE_TYPE,
  MODULE_SCOPE,
  ModuleDefinition,
  ModuleExports,
  ModuleResolution,
} from "@medusajs/types"

import { isObject, isString } from "@medusajs/utils"
import resolveCwd from "resolve-cwd"
import { ModulesDefinition } from "../definitions"

export const registerMedusaModule = (
  moduleKey: string,
  moduleDeclaration?:
    | Partial<InternalModuleDeclaration | ExternalModuleDeclaration>
    | string
    | false,
  moduleExports?: ModuleExports,
  definition?: ModuleDefinition
): Record<string, ModuleResolution> => {
  const moduleResolutions = {} as Record<string, ModuleResolution>

  const modDefinition = definition ?? ModulesDefinition[moduleKey]

  const modDeclaration =
    moduleDeclaration ??
    (modDefinition?.defaultModuleDeclaration as InternalModuleDeclaration)

  if (modDeclaration !== false && !modDeclaration) {
    throw new Error(`Module: ${moduleKey} has no declaration.`)
  }

  if (
    isObject(modDeclaration) &&
    modDeclaration?.scope === MODULE_SCOPE.EXTERNAL
  ) {
    moduleResolutions[moduleKey] = getExternalModuleResolution(
      modDefinition,
      modDeclaration as ExternalModuleDeclaration
    )

    return moduleResolutions
  }

  if (modDefinition === undefined) {
    moduleResolutions[moduleKey] = getCustomModuleResolution(
      moduleKey,
      moduleDeclaration as InternalModuleDeclaration
    )
    return moduleResolutions
  }

  moduleResolutions[moduleKey] = getInternalModuleResolution(
    modDefinition,
    moduleDeclaration as InternalModuleDeclaration,
    moduleExports
  )

  return moduleResolutions
}

function getCustomModuleResolution(
  key: string,
  moduleConfig: InternalModuleDeclaration | string
): ModuleResolution {
  const resolutionPath = resolveCwd(
    isString(moduleConfig) ? moduleConfig : (moduleConfig.resolve as string)
  )

  const conf = isObject(moduleConfig)
    ? moduleConfig
    : ({} as InternalModuleDeclaration)

  const dependencies = conf?.dependencies ?? []

  return {
    resolutionPath,
    definition: {
      key,
      label: `Custom: ${key}`,
      isRequired: false,
      defaultPackage: "",
      dependencies,
      registrationName: key,
      defaultModuleDeclaration: {
        resources: MODULE_RESOURCE_TYPE.SHARED,
        scope: MODULE_SCOPE.INTERNAL,
      },
    },
    moduleDeclaration: {
      resources: conf?.resources ?? MODULE_RESOURCE_TYPE.SHARED,
      scope: MODULE_SCOPE.INTERNAL,
    },
    dependencies,
    options: conf?.options ?? {},
  }
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

  const isObj = isObject(moduleConfig)
  let resolutionPath = definition?.defaultPackage

  // If user added a module and it's overridable, we resolve that instead
  const isStr = isString(moduleConfig)
  if (isStr || (isObj && moduleConfig.resolve)) {
    resolutionPath = resolveCwd(
      isStr ? moduleConfig : (moduleConfig.resolve as string)
    )
  }

  const moduleDeclaration = isObj ? moduleConfig : {}
  const additionalDependencies = isObj ? moduleConfig.dependencies || [] : []

  return {
    resolutionPath,
    definition,
    dependencies: [
      ...new Set(
        (definition?.dependencies ?? []).concat(additionalDependencies)
      ),
    ],
    moduleDeclaration: {
      ...(definition?.defaultModuleDeclaration ?? {}),
      ...moduleDeclaration,
    },
    moduleExports,
    options: isObj ? moduleConfig.options ?? {} : {},
  }
}

function getExternalModuleResolution(
  definition: ModuleDefinition,
  moduleConfig: ExternalModuleDeclaration
): ModuleResolution {
  if (!moduleConfig.server) {
    throw new Error(
      `Module: External module ${definition.label} is missing server configuration.`
    )
  }

  return {
    resolutionPath: false,
    definition,
    moduleDeclaration: moduleConfig,
  }
}
