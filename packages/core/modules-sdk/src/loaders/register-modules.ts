import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
  ModuleDefinition,
  ModuleExports,
  ModuleResolution,
} from "@medusajs/types"
import { isObject, isString, upperCaseFirst } from "@medusajs/utils"
import { join } from "path"
import resolveCwd from "resolve-cwd"
import { ModulesDefinition } from "../definitions"
import { MODULE_RESOURCE_TYPE, MODULE_SCOPE } from "../types"

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

  const isCustomModule = !definition && !ModulesDefinition[moduleKey]

  let customModuleConfig
  if (isCustomModule) {
    customModuleConfig = getCustomModuleResolution(
      moduleKey,
      moduleDeclaration as Partial<
        InternalModuleDeclaration | ExternalModuleDeclaration
      >
    )
  }

  let modDefinition =
    definition ?? ModulesDefinition[moduleKey] ?? customModuleConfig.definition

  const modDeclaration =
    moduleDeclaration ?? modDefinition?.defaultModuleDeclaration

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

  if (isCustomModule) {
    moduleResolutions[moduleKey] = customModuleConfig
    return moduleResolutions
  }

  moduleResolutions[moduleKey] = getInternalModuleResolution(
    modDefinition,
    moduleDeclaration as InternalModuleDeclaration,
    moduleExports
  )

  return moduleResolutions
}

function normalizePath(path: string | undefined): string {
  let normalizePath = path

  /**
   * If the project is running on ts-node all relative module resolution
   * will target the src directory and otherwise the dist directory.
   * If the path is not relative, then we can safely import from it and let the resolution
   * happen under the hood.
   */
  if (normalizePath?.startsWith("./")) {
    const sourceDir = process[Symbol.for("ts-node.register.instance")]
      ? "src"
      : "dist"
    normalizePath = join(process.cwd(), sourceDir, normalizePath)
  }

  return normalizePath ?? ""
}

function getCustomModuleResolution(
  key: string,
  moduleConfig?:
    | Partial<InternalModuleDeclaration>
    | Partial<ExternalModuleDeclaration>
): ModuleResolution {
  const conf = isObject(moduleConfig) ? moduleConfig : {}

  const confExt_ = conf as ExternalModuleDeclaration
  if (confExt_?.scope === MODULE_SCOPE.EXTERNAL || confExt_?.server) {
    return {
      definition: {
        key,
        registrationName: key,
        label: `Custom: ${upperCaseFirst(key)}`,
        defaultPackage: "",
        defaultModuleDeclaration: {
          resources: MODULE_RESOURCE_TYPE.SHARED,
          scope: MODULE_SCOPE.INTERNAL,
        },
      },
      moduleDeclaration: {
        scope: MODULE_SCOPE.EXTERNAL,
        server: confExt_?.server!,
      } as ExternalModuleDeclaration,
    }
  }

  const conf_ = conf as InternalModuleDeclaration
  const dependencies: any = conf_?.dependencies ?? []

  const originalPath = normalizePath(
    (isString(moduleConfig) ? moduleConfig : conf_?.resolve) as string
  )
  const resolutionPath = resolveCwd(originalPath)

  return {
    resolutionPath,
    definition: {
      key,
      registrationName: key,
      label: `Custom: ${upperCaseFirst(key)}`,
      defaultPackage: "",
      defaultModuleDeclaration: {
        resources: MODULE_RESOURCE_TYPE.SHARED,
        scope: MODULE_SCOPE.INTERNAL,
      },
    },
    moduleDeclaration: {
      resources: conf_?.resources ?? MODULE_RESOURCE_TYPE.SHARED,
      scope: MODULE_SCOPE.INTERNAL,
    },
    dependencies,
    options: conf_?.options ?? {},
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
