import { LinkModulesExtraFields, ModuleJoinerConfig } from "@medusajs/types"
import { isObject, pluralize, toPascalCase } from "../common"
import { composeLinkName } from "../link"

export const DefineLinkSymbol = Symbol.for("DefineLink")

type InputSource = {
  serviceName: string
  field: string
  linkable: string
  primaryKey: string
}

type InputToJson = {
  toJSON: () => InputSource
}

type CombinedSource = Record<any, any> & InputToJson

type InputOptions = {
  source: CombinedSource | InputSource
  isList?: boolean
}

type ExtraOptions = {
  pk?: {
    [key: string]: string
  }
  database?: {
    table: string
    idPrefix?: string
    extraColumns?: LinkModulesExtraFields
  }
}

type DefineLinkInputSource = InputSource | InputOptions | CombinedSource

type ModuleLinkableKeyConfig = {
  module: string
  key: string
  isList?: boolean
  primaryKey: string
  alias: string
  shortcuts?: {
    [key: string]: string | { path: string; isList?: boolean }
  }
}

function isInputOptions(input: any): input is InputOptions {
  return isObject(input) && "source" in input
}

function isInputSource(input: any): input is InputSource {
  return (isObject(input) && "serviceName" in input) || "toJSON" in input
}

function isToJSON(input: any): input is InputToJson {
  return isObject(input) && "toJSON" in input
}

export function defineLink(
  leftService: DefineLinkInputSource,
  rightService: DefineLinkInputSource,
  linkServiceOptions?: ExtraOptions
) {
  let serviceAObj = {} as ModuleLinkableKeyConfig
  let serviceBObj = {} as ModuleLinkableKeyConfig

  if (isInputSource(leftService)) {
    const source = isToJSON(leftService) ? leftService.toJSON() : leftService

    serviceAObj = {
      key: source.linkable,
      alias: source.field,
      primaryKey: source.primaryKey,
      isList: false,
      module: source.serviceName,
    }
  } else if (isInputOptions(leftService)) {
    const source = isToJSON(leftService.source)
      ? leftService.source.toJSON()
      : leftService.source

    serviceAObj = {
      key: source.linkable,
      alias: source.field,
      primaryKey: source.primaryKey,
      isList: leftService.isList ?? false,
      module: source.serviceName,
    }
  } else {
    throw new Error("Invalid linkable passed for the first argument")
  }

  if (isInputSource(rightService)) {
    const source = isToJSON(rightService) ? rightService.toJSON() : rightService

    serviceBObj = {
      key: source.linkable,
      alias: source.field,
      primaryKey: source.primaryKey,
      isList: false,
      module: source.serviceName,
    }
  } else if (isInputOptions(rightService)) {
    const source = isToJSON(rightService.source)
      ? rightService.source.toJSON()
      : rightService.source

    serviceBObj = {
      key: source.linkable,
      alias: source.field,
      primaryKey: source.primaryKey,
      isList: rightService.isList ?? false,
      module: source.serviceName,
    }
  } else {
    throw new Error(`Invalid linkable passed for the second argument`)
  }

  const output = { [DefineLinkSymbol]: true, serviceName: "" }

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
      throw new Error(`Service ${serviceAObj.module} was not found`)
    }
    if (!serviceBInfo) {
      throw new Error(`Service ${serviceBObj.module} was not found`)
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
        return a.args?.entity == serviceAKeyEntity
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

    const serviceAMethodSuffix = serviceAAliases.find((serviceAlias) => {
      return Array.isArray(serviceAlias.name)
        ? serviceAlias.name.includes(aliasA)
        : serviceAlias.name === aliasA
    })?.args?.methodSuffix

    let serviceBAliases = serviceBInfo.alias ?? []
    if (!Array.isArray(serviceBAliases)) {
      serviceBAliases = [serviceBAliases]
    }

    let aliasBOptions =
      serviceBObj.alias ??
      serviceBAliases.find((a) => {
        return a.args?.entity == serviceBKeyInfo
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

    const serviceBMethodSuffix = serviceBAliases.find((serviceAlias) => {
      return Array.isArray(serviceAlias.name)
        ? serviceAlias.name.includes(aliasB)
        : serviceAlias.name === aliasB
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

    const linkDefinition: ModuleJoinerConfig = {
      serviceName: output.serviceName,
      isLink: true,
      alias: [
        {
          name: [aliasA + "_" + aliasB],
          args: {
            entity: toPascalCase(
              [
                "Link",
                serviceAObj.module,
                aliasA,
                serviceBObj.module,
                aliasB,
              ].join("_")
            ),
          },
        },
      ],
      primaryKeys: ["id", serviceAObj.key, serviceBObj.key],
      relationships: [
        {
          serviceName: serviceAObj.module,
          primaryKey: serviceAPrimaryKey,
          foreignKey: serviceAObj.key,
          alias: aliasA,
          args: {
            methodSuffix: serviceAMethodSuffix,
          },
        },
        {
          serviceName: serviceBObj.module,
          primaryKey: serviceBPrimaryKey!,
          foreignKey: serviceBObj.key,
          alias: aliasB,
          args: {
            methodSuffix: serviceBMethodSuffix,
          },
        },
      ],
      extends: [
        {
          serviceName: serviceAObj.module,
          fieldAlias: {
            [serviceBObj.isList ? pluralize(aliasB) : aliasB]:
              aliasB + "_link." + aliasB, //plural aliasA
          },
          relationship: {
            serviceName: output.serviceName,
            primaryKey: serviceAObj.key,
            foreignKey: serviceAPrimaryKey,
            alias: aliasB + "_link", // plural alias
            isList: serviceBObj.isList,
          },
        },
        {
          serviceName: serviceBObj.module,
          fieldAlias: {
            [serviceAObj.isList ? pluralize(aliasA) : aliasA]:
              aliasA + "_link." + aliasA,
          },
          relationship: {
            serviceName: output.serviceName,
            primaryKey: serviceBObj.key,
            foreignKey: serviceBPrimaryKey,
            alias: aliasA + "_link", // plural alias
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
