import { LinkModulesExtraFields, ModuleJoinerConfig } from "@medusajs/types"
import { isObject, pluralize, toPascalCase } from "../common"
import { composeLinkName } from "../link"

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
    throw new Error("Invalid value for serviceA config")
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
    throw new Error("Invalid value for serviceA config")
  }

  const output = { serviceName: "" }

  const register = function (
    modules: ModuleJoinerConfig[]
  ): ModuleJoinerConfig {
    const serviceAInfo = modules
      .map((mod) => mod[serviceAObj.module])
      .filter(Boolean)[0]
    const serviceBInfo = modules
      .map((mod) => mod[serviceBObj.module])
      .filter(Boolean)[0]
    if (!serviceAInfo) {
      throw new Error(`Service ${serviceAObj.module} was not found`)
    }
    if (!serviceBInfo) {
      throw new Error(`Service ${serviceBObj.module} was not found`)
    }

    const serviceAKeyInfo =
      serviceAInfo.__joinerConfig.linkableKeys?.[serviceAObj.key]
    const serviceBKeyInfo =
      serviceBInfo.__joinerConfig.linkableKeys?.[serviceBObj.key]
    if (!serviceAKeyInfo) {
      throw new Error(
        `Key ${serviceAObj.key} is not linkable on service ${serviceAObj.module}`
      )
    }
    if (!serviceBKeyInfo) {
      throw new Error(
        `Key ${serviceBObj.key} is not linkable on service ${serviceBObj.module}`
      )
    }

    let serviceAAliases = serviceAInfo.__joinerConfig.alias ?? []
    if (!Array.isArray(serviceAAliases)) {
      serviceAAliases = [serviceAAliases]
    }

    let aliasAOptions =
      serviceAObj.alias ??
      serviceAAliases.find((a) => {
        return a.args?.entity == serviceAKeyInfo
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

    let serviceBAliases = serviceBInfo.__joinerConfig.alias ?? []
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

    const moduleAPrimaryKeys = serviceAInfo.__joinerConfig.primaryKeys
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

    const moduleBPrimaryKeys = serviceBInfo.__joinerConfig.primaryKeys
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
        },
        {
          serviceName: serviceBObj.module,
          primaryKey: serviceBPrimaryKey!,
          foreignKey: serviceBObj.key,
          alias: aliasB,
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
            primaryKey: serviceBObj.key,
            foreignKey: serviceBPrimaryKey,
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
            primaryKey: serviceAObj.key,
            foreignKey: serviceAPrimaryKey,
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
