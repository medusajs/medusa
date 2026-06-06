import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
  ModuleDefinition,
  ModuleExports,
  ModuleResolution,
} from "@zjedene-medusa/types"

import {
  isObject,
  isString,
  normalizeImportPathWithSource,
} from "@zjedene-medusa/utils"
import { ModulesDefinition } from "../definitions"
import { MODULE_SCOPE } from "../types"

export const registerMedusaModule = ({
  moduleKey,
  moduleDeclaration,
  moduleExports,
  definition,
  cwd,
}: {
  moduleKey: string
  moduleDeclaration?:
    | Partial<InternalModuleDeclaration | ExternalModuleDeclaration>
    | string
    | false
  moduleExports?: ModuleExports
  definition?: ModuleDefinition
  cwd?: string
}): Record<string, ModuleResolution> => {
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
      moduleDeclaration as InternalModuleDeclaration,
      cwd
    )
    return moduleResolutions
  }

  moduleResolutions[moduleKey] = getInternalModuleResolution(
    modDefinition,
    moduleDeclaration as InternalModuleDeclaration,
    moduleExports,
    cwd
  )

  return moduleResolutions
}

function getCustomModuleResolution(
  key: string,
  moduleConfig: InternalModuleDeclaration | string,
  cwd: string = process.cwd()
): ModuleResolution {
  const originalPath = normalizeImportPathWithSource(
    (isString(moduleConfig) ? moduleConfig : moduleConfig.resolve) as string,
    cwd
  )
  const resolutionPath = require.resolve(originalPath, {
    paths: [cwd],
  })

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
      defaultModuleDeclaration: {
        scope: MODULE_SCOPE.INTERNAL,
      },
    },
    moduleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
    },
    dependencies,
    options: conf?.options ?? {},
  }
}

export const registerMedusaLinkModule = (
  definition: ModuleDefinition,
  moduleDeclaration: Partial<InternalModuleDeclaration>,
  moduleExports?: ModuleExports,
  cwd: string = process.cwd()
): Record<string, ModuleResolution> => {
  const moduleResolutions = {} as Record<string, ModuleResolution>

  moduleResolutions[definition.key] = getInternalModuleResolution(
    definition,
    moduleDeclaration as InternalModuleDeclaration,
    moduleExports,
    cwd
  )

  return moduleResolutions
}

function getInternalModuleResolution(
  definition: ModuleDefinition,
  moduleConfig: InternalModuleDeclaration | string | false,
  moduleExports?: ModuleExports,
  cwd: string = process.cwd()
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
    const originalPath = normalizeImportPathWithSource(
      (isString(moduleConfig) ? moduleConfig : moduleConfig.resolve) as string,
      cwd
    )
    resolutionPath = require.resolve(originalPath, {
      paths: [cwd],
    })
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
