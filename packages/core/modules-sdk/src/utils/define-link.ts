import { LinkModulesExtraFields, ModuleJoinerConfig } from "@medusajs/types"
import {
  composeLinkName,
  isObject,
  isString,
  toPascalCase,
} from "@medusajs/utils"
import { MedusaModule } from "../medusa-module"

type ModuleLinkableKeyConfig = {
  module: string
  key: string
  isList?: boolean
  alias?: string
  shortcuts?: {
    [key: string]: string | { path: string; isList?: boolean }
  }
}

export function defineLink(
  serviceAAndKey: string | ModuleLinkableKeyConfig,
  serviceBAndKey: string | ModuleLinkableKeyConfig,
  options?: {
    pk?: {
      [key: string]: string
    }
    database?: {
      table: string
      idPrefix?: string
      extraColumns?: LinkModulesExtraFields
    }
  }
) {
  const register = function (
    modules: ModuleJoinerConfig[]
  ): ModuleJoinerConfig {
    let serviceA: string
    let serviceAKey: string
    let serviceAIsList = false
    let serviceAObj: Partial<ModuleLinkableKeyConfig> = {}

    let serviceB: string
    let serviceBKey: string
    let serviceBIsList = false
    let serviceBObj: Partial<ModuleLinkableKeyConfig> = {}

    if (isString(serviceAAndKey)) {
      let [mod, key] = (serviceAAndKey as string).split(".")
      serviceA = mod
      if (key.endsWith("[]")) {
        serviceAIsList = true
        key = key.slice(0, -2)
      }
      serviceAKey = key
    } else if (isObject(serviceAAndKey)) {
      const objA = serviceAAndKey as ModuleLinkableKeyConfig
      serviceAObj = objA

      serviceA = objA.module
      serviceAKey = objA.key
      serviceAIsList = !!objA.isList
    } else {
      throw new Error("Invalid value for serviceA config")
    }

    if (isString(serviceBAndKey)) {
      let [mod, key] = (serviceBAndKey as string).split(".")
      serviceB = mod
      if (key.endsWith("[]")) {
        serviceBIsList = true
        key = key.slice(0, -2)
      }
      serviceBKey = key
    } else if (isObject(serviceBAndKey)) {
      const objB = serviceBAndKey as ModuleLinkableKeyConfig
      serviceBObj = objB

      serviceB = objB.module
      serviceBKey = objB.key
      serviceBIsList = !!objB.isList
    } else {
      throw new Error("Invalid value for serviceB config")
    }

    const serviceAInfo = modules.find((mod) => mod.serviceName === serviceA)
    const serviceBInfo = modules.find((mod) => mod.serviceName === serviceB)
    if (!serviceAInfo) {
      throw new Error(`Service ${serviceA} was not found`)
    }
    if (!serviceBInfo) {
      throw new Error(`Service ${serviceB} was not found`)
    }

    const serviceAKeyInfo = serviceAInfo.linkableKeys?.[serviceAKey]
    const serviceBKeyInfo = serviceBInfo.linkableKeys?.[serviceBKey]
    if (!serviceAKeyInfo) {
      throw new Error(
        `Key ${serviceAKey} is not linkable on service ${serviceA}`
      )
    }
    if (!serviceBKeyInfo) {
      throw new Error(
        `Key ${serviceBKey} is not linkable on service ${serviceB}`
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
        `You need to provide an alias for ${serviceA}.${serviceAKey}`
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
        `You need to provide an alias for ${serviceB}.${serviceBKey}`
      )
    }

    let serviceAPrimaryKey = options?.pk?.[serviceA] ?? serviceAInfo.primaryKeys
    if (Array.isArray(serviceAPrimaryKey)) {
      serviceAPrimaryKey = serviceAPrimaryKey[0]
    }

    let serviceBPrimaryKey = options?.pk?.[serviceB] ?? serviceBInfo.primaryKeys
    if (Array.isArray(serviceBPrimaryKey)) {
      serviceBPrimaryKey = serviceBPrimaryKey[0]
    }

    const serviceName = composeLinkName(serviceA, aliasA, serviceB, aliasB)

    const linkDefinition: ModuleJoinerConfig = {
      serviceName,
      isLink: true,
      alias: [
        {
          name: [aliasA + "_" + aliasB],
          args: {
            entity: toPascalCase(
              ["Link", serviceA, aliasA, serviceB, aliasB].join("_")
            ),
          },
        },
      ],
      primaryKeys: ["id", serviceAKey, serviceBKey],
      relationships: [
        {
          serviceName: serviceA,
          primaryKey: serviceAPrimaryKey!,
          foreignKey: serviceAKey,
          alias: aliasA,
        },
        {
          serviceName: serviceB,
          primaryKey: serviceBPrimaryKey!,
          foreignKey: serviceBKey,
          alias: aliasB,
        },
      ],
      extends: [
        {
          serviceName: serviceA,
          fieldAlias: {
            [aliasB]: aliasB + "_link." + aliasB, //plural aliasA
          },
          relationship: {
            serviceName,
            primaryKey: serviceAKey,
            foreignKey: serviceBPrimaryKey!,
            alias: aliasB + "_link", // plural alias
            isList: serviceAIsList,
          },
        },
        {
          serviceName: serviceB,
          fieldAlias: {
            [aliasA]: aliasA + "_link." + aliasA,
          },
          relationship: {
            serviceName,
            primaryKey: serviceBKey,
            foreignKey: serviceAPrimaryKey!,
            alias: aliasA + "_link", // plural alias
            isList: serviceBIsList,
          },
        },
      ],
    }

    if (options?.database) {
      const { table, idPrefix, extraColumns } = options.database
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
