import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
  MODULE_RESOURCE_TYPE,
  MODULE_SCOPE,
  ModuleDefinition,
  ModuleExports,
  ModuleResolution,
} from "@medusajs/types"
import { join } from "path"

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
    // TODO: getExternalModuleResolution(...)
    throw new Error("External Modules are not supported yet.")
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

function normalizePath(path: string) {
  let normalizePath = path

  /**
   * If the project is running on ts-node all relative module resolution
   * will target the src directory and otherwise the dist directory.
   * If the path is not relative, then we can safely import from it and let the resolution
   * happen under the hood.
   */
  if (/\.\//.test(normalizePath)) {
    const sourceDir = process[Symbol.for("ts-node.register.instance")]
      ? "src"
      : "dist"
    normalizePath = join(process.cwd(), sourceDir, normalizePath)
  }

  return normalizePath
}

function getCustomModuleResolution(
  key: string,
  moduleConfig: InternalModuleDeclaration | string
): ModuleResolution {
  const originalPath = normalizePath(
    (isString(moduleConfig) ? moduleConfig : moduleConfig.resolve) as string
  )
  const resolutionPath = resolveCwd(originalPath)

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
  let resolutionPath = definition.defaultPackage

  // If user added a module and it's overridable, we resolve that instead
  const isStr = isString(moduleConfig)
  if (isStr || (isObj && moduleConfig.resolve)) {
    const originalPath = normalizePath(
      (isString(moduleConfig) ? moduleConfig : moduleConfig.resolve) as string
    )
    resolutionPath = resolveCwd(originalPath)
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
