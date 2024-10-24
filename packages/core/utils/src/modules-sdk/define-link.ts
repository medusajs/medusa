import { LinkModulesExtraFields, ModuleJoinerConfig } from "@medusajs/types"
import { camelToSnakeCase, isObject, pluralize, toPascalCase } from "../common"
import { composeLinkName } from "../link/compose-link-name"

export const DefineLinkSymbol = Symbol.for("DefineLink")

export interface DefineLinkExport {
  [DefineLinkSymbol]: boolean
  serviceName: string
  entity?: string
  entryPoint: string
}

type InputSource = {
  serviceName: string
  field: string
  entity?: string
  alias?: string
  linkable: string
  primaryKey: string
  args?: Record<string, any>
  isList?: boolean
}

type RawBaseModuleInput = {
  module: string
  entity?: string
  field: string
  args?: Record<string, any>
}

type ReadOnlyInputFromSource =
  | CombinedSource
  | InputSource
  | {
      linkable: CombinedSource | InputSource
      field?: string
    }
  | RawBaseModuleInput

type ReadOnlyInputToSource =
  | CombinedSource
  | InputSource
  | {
      linkable: CombinedSource | InputSource
      alias?: string
      isList?: boolean
    }
  | (RawBaseModuleInput & {
      alias: string
      isList?: boolean
    })

type InputToJson = {
  toJSON: () => InputSource
}

type CombinedSource = Record<any, any> & InputToJson

type InputOptions = {
  linkable: CombinedSource | InputSource
  field?: string
  alias?: string
  isList?: boolean
  deleteCascade?: boolean
}

type Shortcut = {
  property: string
  path: string
  isList?: boolean
  forwardArguments?: string | string[]
}

type ExtraOptions = {
  pk?: {
    [key: string]: string
  }
  database?: {
    table?: string
    idPrefix?: string
    extraColumns?: LinkModulesExtraFields
  }
  readOnly?: boolean
}

type ReadOnlyOptions = {
  isList?: boolean
  shortcut?: Shortcut | Shortcut[]
}

type ReadOnlyExtraOptions = {
  readOnly: true
} & ReadOnlyOptions

type DefineLinkInputSource = InputSource | InputOptions | CombinedSource

type DefineReadOnlyLinkInputSource = InputOptions | CombinedSource

type ModuleLinkableKeyConfig = {
  module: string
  entity?: string
  key: string
  field: string
  isList?: boolean
  deleteCascade?: boolean
  primaryKey: string
  alias: string
  shortcut?: Shortcut | Shortcut[]
  args?: Record<string, any>
}

function isRawBaseModuleSource(input: any): input is RawBaseModuleInput {
  return isObject(input) && input?.["module"]
}

function isInputOptions(input: any): input is InputOptions {
  return isObject(input) && input?.["linkable"]
}

function isInputSource(input: any): input is InputSource {
  return (isObject(input) && input?.["serviceName"]) || input?.["toJSON"]
}

function isToJSON(input: any): input is InputToJson {
  return isObject(input) && input?.["toJSON"]
}

function buildFieldAlias(fieldAliases?: Shortcut | Shortcut[]) {
  if (!fieldAliases) {
    return
  }

  const fieldAlias = {}

  const shortcuts = Array.isArray(fieldAliases) ? fieldAliases : [fieldAliases]
  for (const sc of shortcuts) {
    const fwArgs = sc.forwardArguments
      ? Array.isArray(sc.forwardArguments)
        ? sc.forwardArguments
        : [sc.forwardArguments]
      : []
    fieldAlias[sc.property] = {
      path: sc.path,
      isList: !!sc.isList,
      forwardArgumentsOnPath: fwArgs,
    }
  }

  return fieldAlias
}

function prepareServiceConfig(
  input:
    | DefineLinkInputSource
    | DefineReadOnlyLinkInputSource
    | ReadOnlyInputFromSource
    | ReadOnlyInputToSource
) {
  let serviceConfig = {} as ModuleLinkableKeyConfig

  if (isRawBaseModuleSource(input)) {
    const source_ = input as any
    serviceConfig = {
      key: source_.field! ?? source_.alias,
      alias: source_.alias ?? camelToSnakeCase(source_.field ?? ""),
      field: source_.field,
      primaryKey: source_.field,
      isList: source_.isList,
      module: source_.module,
      entity: source_.entity,
      args: source_.args,
    }
  } else if (isInputSource(input)) {
    const source = isToJSON(input) ? input.toJSON() : input

    serviceConfig = {
      key: source.linkable,
      alias: source.alias ?? camelToSnakeCase(source.field ?? ""),
      field: input.field ?? source.field,
      primaryKey: source.primaryKey,
      isList: input.isList ?? false,
      deleteCascade: false,
      module: source.serviceName,
      entity: source.entity,
      args: source.args,
    }
  } else if (isInputOptions(input)) {
    const source = isToJSON(input.linkable)
      ? input.linkable.toJSON()
      : input.linkable

    serviceConfig = {
      key: source.linkable,
      alias:
        input.alias ?? source.alias ?? camelToSnakeCase(source.field ?? ""),
      field: input.field ?? source.field,
      primaryKey: source.primaryKey,
      isList: input.isList ?? false,
      deleteCascade: input.deleteCascade ?? false,
      module: source.serviceName,
      entity: source.entity,
      args: source.args,
    }
  } else {
    throw new Error(
      `Invalid linkable passed for the argument\n${JSON.stringify(
        input,
        null,
        2
      )}`
    )
  }

  return serviceConfig
}

/**
 * Generate a ModuleJoinerConfig for the link definition on the fly.
 * All naming, aliases etc are following our conventional naming.
 *
 * @param leftService
 * @param rightService
 * @param linkServiceOptions
 */
export function defineLink(
  leftService:
    | DefineLinkInputSource
    | DefineReadOnlyLinkInputSource
    | ReadOnlyInputFromSource,
  rightService:
    | DefineLinkInputSource
    | DefineReadOnlyLinkInputSource
    | ReadOnlyInputToSource,
  linkServiceOptions?: ExtraOptions | ReadOnlyExtraOptions
): DefineLinkExport {
  if (linkServiceOptions?.readOnly) {
    defineReadOnlyLink(
      leftService as ReadOnlyInputFromSource,
      rightService as ReadOnlyInputToSource,
      linkServiceOptions as ReadOnlyExtraOptions
    )
    return undefined as unknown as DefineLinkExport
  }

  const serviceAObj = prepareServiceConfig(leftService)
  const serviceBObj = prepareServiceConfig(rightService)

  const output = {
    [DefineLinkSymbol]: true,
    serviceName: "",
    entity: "",
    entryPoint: "",
  }

  const register = function (
    modules: ModuleJoinerConfig[]
  ): ModuleJoinerConfig {
    const serviceAInfo = modules.find(
      (mod) => mod.serviceName === serviceAObj.module
    )!
    const serviceBInfo = modules.find(
      (mod) => mod.serviceName === serviceBObj.module
    )!

    if (!serviceAInfo) {
      throw new Error(`Service ${serviceAObj.module} was not found. If this is your module, make sure you set isQueryable to true in medusa-config.js:
        
${serviceAObj.module}: {
  // ...
  definition: {
    isQueryable: true
  }
}`)
    }
    if (!serviceBInfo) {
      throw new Error(`Service ${serviceBObj.module} was not found. If this is your module, make sure you set isQueryable to true in medusa-config.js:
        
${serviceBObj.module}: {
  // ...
  definition: {
    isQueryable: true
  }
}`)
    }

    const serviceAKeyEntity = serviceAInfo.linkableKeys?.[serviceAObj.key]
    const serviceBKeyInfo = serviceBInfo.linkableKeys?.[serviceBObj.key]
    if (!serviceAKeyEntity) {
      throw new Error(
        `Key ${serviceAObj.key} is not linkable on service ${serviceAObj.module}`
      )
    }
    if (!serviceBKeyInfo) {
      throw new Error(
        `Key ${serviceBObj.key} is not linkable on service ${serviceBObj.module}`
      )
    }

    let serviceAAliases = serviceAInfo.alias ?? []
    if (!Array.isArray(serviceAAliases)) {
      serviceAAliases = [serviceAAliases]
    }

    let aliasAOptions =
      serviceAObj.alias ??
      serviceAAliases.find((a) => {
        return a.entity == serviceAKeyEntity
      })?.name

    let aliasA = aliasAOptions
    if (Array.isArray(aliasAOptions)) {
      aliasA = aliasAOptions[0]
    }

    if (!aliasA) {
      throw new Error(
        `You need to provide an alias for ${serviceAObj.module}.${serviceAObj.key}`
      )
    }

    const serviceAObjEntryPoint = camelToSnakeCase(serviceAObj.field)
    const serviceAMethodSuffix = serviceAAliases.find((serviceAlias) => {
      return Array.isArray(serviceAlias.name)
        ? serviceAlias.name.includes(serviceAObjEntryPoint)
        : serviceAlias.name === serviceAObjEntryPoint
    })?.args?.methodSuffix

    let serviceBAliases = serviceBInfo.alias ?? []
    if (!Array.isArray(serviceBAliases)) {
      serviceBAliases = [serviceBAliases]
    }

    let aliasBOptions =
      serviceBObj.alias ??
      serviceBAliases.find((a) => {
        return a.entity == serviceBKeyInfo
      })?.name

    let aliasB = aliasBOptions
    if (Array.isArray(aliasBOptions)) {
      aliasB = aliasBOptions[0]
    }

    if (!aliasB) {
      throw new Error(
        `You need to provide an alias for ${serviceBObj.module}.${serviceBObj.key}`
      )
    }

    const serviceBObjEntryPoint = camelToSnakeCase(serviceBObj.field)
    const serviceBMethodSuffix = serviceBAliases.find((serviceAlias) => {
      return Array.isArray(serviceAlias.name)
        ? serviceAlias.name.includes(serviceBObjEntryPoint)
        : serviceAlias.name === serviceBObjEntryPoint
    })?.args?.methodSuffix

    const moduleAPrimaryKeys = serviceAInfo.primaryKeys ?? []
    let serviceAPrimaryKey =
      serviceAObj.primaryKey ??
      linkServiceOptions?.pk?.[serviceAObj.module] ??
      moduleAPrimaryKeys
    if (Array.isArray(serviceAPrimaryKey)) {
      serviceAPrimaryKey = serviceAPrimaryKey[0]
    }

    const isModuleAPrimaryKeyValid =
      moduleAPrimaryKeys.includes(serviceAPrimaryKey)
    if (!isModuleAPrimaryKeyValid) {
      throw new Error(
        `Primary key ${serviceAPrimaryKey} is not defined on service ${serviceAObj.module}`
      )
    }

    const moduleBPrimaryKeys = serviceBInfo.primaryKeys ?? []
    let serviceBPrimaryKey =
      serviceBObj.primaryKey ??
      linkServiceOptions?.pk?.[serviceBObj.module] ??
      moduleBPrimaryKeys
    if (Array.isArray(serviceBPrimaryKey)) {
      serviceBPrimaryKey = serviceBPrimaryKey[0]
    }

    const isModuleBPrimaryKeyValid =
      moduleBPrimaryKeys.includes(serviceBPrimaryKey)
    if (!isModuleBPrimaryKeyValid) {
      throw new Error(
        `Primary key ${serviceBPrimaryKey} is not defined on service ${serviceBObj.module}`
      )
    }

    output.serviceName = composeLinkName(
      serviceAObj.module,
      aliasA,
      serviceBObj.module,
      aliasB
    )

    output.entryPoint = aliasA + "_" + aliasB
    output.entity = toPascalCase(
      ["Link", serviceAObj.module, aliasA, serviceBObj.module, aliasB].join("_")
    )

    const linkDefinition: ModuleJoinerConfig = {
      serviceName: output.serviceName,
      isLink: true,
      alias: [
        {
          name: [output.entryPoint],
          args: {
            entity: output.entity,
          },
        },
      ],
      primaryKeys: ["id", serviceAObj.key, serviceBObj.key],
      relationships: [
        {
          serviceName: serviceAObj.module,
          entity: serviceAObj.entity,
          primaryKey: serviceAPrimaryKey,
          foreignKey: serviceAObj.key,
          alias: aliasA,
          args: {
            methodSuffix: serviceAMethodSuffix,
            ...serviceAObj.args,
          },
          deleteCascade: serviceAObj.deleteCascade,
        },
        {
          serviceName: serviceBObj.module,
          entity: serviceBObj.entity,
          primaryKey: serviceBPrimaryKey!,
          foreignKey: serviceBObj.key,
          alias: aliasB,
          args: {
            methodSuffix: serviceBMethodSuffix,
            ...serviceBObj.args,
          },
          deleteCascade: serviceBObj.deleteCascade,
        },
      ],
      extends: [
        {
          serviceName: serviceAObj.module,
          fieldAlias: buildFieldAlias({
            property: serviceBObj.isList ? pluralize(aliasB) : aliasB,
            path: aliasB + "_link." + aliasB,
            isList: serviceBObj.isList,
            forwardArguments: [aliasB + "_link." + aliasB],
          }),
          relationship: {
            serviceName: output.serviceName,
            entity: output.entity,
            primaryKey: serviceAObj.key,
            foreignKey: serviceAPrimaryKey,
            alias: aliasB + "_link",
            isList: serviceBObj.isList,
          },
        },
        {
          serviceName: serviceBObj.module,
          fieldAlias: buildFieldAlias({
            property: serviceAObj.isList ? pluralize(aliasA) : aliasA,
            path: aliasA + "_link." + aliasA,
            isList: serviceAObj.isList,
            forwardArguments: [aliasA + "_link." + aliasA],
          }),
          relationship: {
            serviceName: output.serviceName,
            entity: output.entity,
            primaryKey: serviceBObj.key,
            foreignKey: serviceBPrimaryKey,
            alias: aliasA + "_link",
            isList: serviceAObj.isList,
          },
        },
      ],
    }

    if (linkServiceOptions?.database) {
      const { table, idPrefix, extraColumns } = linkServiceOptions.database
      linkDefinition.databaseConfig = {
        tableName: table,
        idPrefix,
        extraFields: extraColumns,
      }
    }

    return linkDefinition
  }

  global.MedusaModule.setCustomLink(register)

  return output
}

export function defineReadOnlyLink(
  from: ReadOnlyInputFromSource,
  to: ReadOnlyInputToSource,
  readOnlyLinkOptions?: ReadOnlyOptions
): (...args) => ModuleJoinerConfig {
  const serviceAObj = prepareServiceConfig(from)
  const serviceBObj = prepareServiceConfig(to)

  const register = function (
    modules: ModuleJoinerConfig[]
  ): ModuleJoinerConfig {
    const serviceAInfo = modules.find(
      (mod) => mod.serviceName === serviceAObj.module
    )!
    const serviceBInfo = modules.find(
      (mod) => mod.serviceName === serviceBObj.module
    )!

    if (!serviceAInfo) {
      throw new Error(`Service ${serviceAObj.module} was not found. If this is your module, make sure you set isQueryable to true in medusa-config.js:
        
${serviceAObj.module}: {
  // ...
  definition: {
    isQueryable: true
  }
}`)
    }
    if (!serviceBInfo) {
      throw new Error(`Service ${serviceBObj.module} was not found. If this is your module, make sure you set isQueryable to true in medusa-config.js:
        
${serviceBObj.module}: {
  // ...
  definition: {
    isQueryable: true
  }
}`)
    }

    return {
      isLink: true,
      isReadOnlyLink: true,
      extends: [
        {
          serviceName: serviceAObj.module,
          entity: serviceAObj.entity,
          fieldAlias: buildFieldAlias(readOnlyLinkOptions?.shortcut),
          relationship: {
            serviceName: serviceBObj.module,
            entity: serviceBObj.entity,
            primaryKey: serviceBObj.primaryKey,
            foreignKey: serviceAObj.field,
            alias: serviceBObj.alias,
            isList: readOnlyLinkOptions?.isList ?? serviceBObj.isList ?? false,
            args: serviceBObj.args,
          },
        },
      ],
    }
  }

  global.MedusaModule.setCustomLink(register)

  return register
}
