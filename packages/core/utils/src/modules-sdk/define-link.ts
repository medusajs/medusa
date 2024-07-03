import { LinkModulesExtraFields, ModuleJoinerConfig } from "@medusajs/types"
import { isObject, toPascalCase } from "../common"
import { MedusaModule } from "@medusajs/modules-sdk"
import { composeLinkName } from "../link"

type InputSource = {
  serviceName: string
  field: string
  linkable: string
  primaryKey: string
}

type InputOptions = {
  source: InputSource
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

type DefineLinkInputSource = InputSource | InputOptions

type ModuleLinkableKeyConfig = {
  module: string
  key: string
  isList?: boolean
  alias: string
  shortcuts?: {
    [key: string]: string | { path: string; isList?: boolean }
  }
}

function isInputOptions(input: any): input is InputOptions {
  return isObject(input) && "source" in input
}

function isInputSource(input: any): input is InputSource {
  return isObject(input) && "serviceName" in input
}

export function defineLink(
  leftService: DefineLinkInputSource,
  rightService: DefineLinkInputSource,
  linkServiceOptions?: ExtraOptions
) {
  const register = function (
    modules: ModuleJoinerConfig[]
  ): ModuleJoinerConfig {
    let serviceAObj = {} as ModuleLinkableKeyConfig
    let serviceBObj = {} as ModuleLinkableKeyConfig

    if (isInputSource(leftService)) {
      serviceAObj = {
        key: leftService.linkable,
        alias: leftService.field,
        isList: false,
        module: leftService.serviceName,
      }
    } else if (isInputOptions(leftService)) {
      serviceAObj = {
        key: leftService.source.linkable,
        alias: leftService.source.field,
        isList: leftService.isList ?? false,
        module: leftService.source.serviceName,
      }
    } else {
      throw new Error("Invalid value for serviceA config")
    }

    if (isInputSource(rightService)) {
      serviceBObj = {
        key: rightService.linkable,
        alias: rightService.field,
        isList: false,
        module: rightService.serviceName,
      }
    } else if (isInputOptions(rightService)) {
      serviceBObj = {
        key: rightService.source.linkable,
        alias: rightService.source.field,
        isList: rightService.isList ?? false,
        module: rightService.source.serviceName,
      }
    } else {
      throw new Error("Invalid value for serviceA config")
    }

    const serviceAInfo = modules.find(
      (mod) => mod.serviceName === serviceAObj.module
    )
    const serviceBInfo = modules.find(
      (mod) => mod.serviceName === serviceBObj.module
    )
    if (!serviceAInfo) {
      throw new Error(`Service ${serviceAObj.module} was not found`)
    }
    if (!serviceBInfo) {
      throw new Error(`Service ${serviceBObj.module} was not found`)
    }

    const serviceAKeyInfo = serviceAInfo.linkableKeys?.[serviceAObj.key]
    const serviceBKeyInfo = serviceBInfo.linkableKeys?.[serviceBObj.key]
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

    let serviceAAliases = serviceAInfo.alias ?? []
    if (!Array.isArray(serviceAAliases)) {
      serviceAAliases = [serviceAAliases]
    }

    let aliasAOptions =
      serviceAObj.alias ??
      serviceAAliases.find((a) => {
        return a.args?.entity == serviceAKeyInfo
      })?.name

    let aliasA = ""
    if (Array.isArray(aliasAOptions)) {
      aliasA = aliasAOptions[0]
    }
    if (!aliasA) {
      throw new Error(
        `You need to provide an alias for ${serviceAObj.module}.${serviceAObj.key}`
      )
    }

    let serviceBAliases = serviceBInfo.alias ?? []
    if (!Array.isArray(serviceBAliases)) {
      serviceBAliases = [serviceBAliases]
    }

    let aliasBOptions =
      serviceBObj.alias ??
      serviceBAliases.find((a) => {
        return a.args?.entity == serviceBKeyInfo
      })?.name

    let aliasB = ""
    if (Array.isArray(aliasBOptions)) {
      aliasB = aliasBOptions[0]
    }
    if (!aliasB) {
      throw new Error(
        `You need to provide an alias for ${serviceBObj.module}.${serviceBObj.key}`
      )
    }

    let serviceAPrimaryKey =
      linkServiceOptions?.pk?.[serviceAObj.module] ?? serviceAInfo.primaryKeys
    if (Array.isArray(serviceAPrimaryKey)) {
      serviceAPrimaryKey = serviceAPrimaryKey[0]
    }

    let serviceBPrimaryKey =
      linkServiceOptions?.pk?.[serviceBObj.module] ?? serviceBInfo.primaryKeys
    if (Array.isArray(serviceBPrimaryKey)) {
      serviceBPrimaryKey = serviceBPrimaryKey[0]
    }

    const serviceName = composeLinkName(
      serviceAObj.module,
      aliasA,
      serviceBObj.module,
      aliasB
    )

    const linkDefinition: ModuleJoinerConfig = {
      serviceName,
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
          primaryKey: serviceAPrimaryKey!,
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
            [aliasB]: aliasB + "_link." + aliasB, //plural aliasA
          },
          relationship: {
            serviceName,
            primaryKey: serviceAObj.key,
            foreignKey: serviceBPrimaryKey!,
            alias: aliasB + "_link", // plural alias
            isList: serviceAObj.isList,
          },
        },
        {
          serviceName: serviceBObj.module,
          fieldAlias: {
            [aliasA]: aliasA + "_link." + aliasA,
          },
          relationship: {
            serviceName,
            primaryKey: serviceBObj.key,
            foreignKey: serviceAPrimaryKey!,
            alias: aliasA + "_link", // plural alias
            isList: serviceBObj.isList,
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

  MedusaModule.setCustomLink(register)
}
