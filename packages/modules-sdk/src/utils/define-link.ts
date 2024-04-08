import { LinkModulesExtraFields, ModuleJoinerConfig } from "@medusajs/types"
import { composeLinkName, toPascalCase } from "@medusajs/utils"
import { MedusaModule } from "../medusa-module"

export function defineLink(
  serviceA,
  serviceAKey,
  serviceB,
  serviceBKey,
  options?: {
    alias?: {
      [key: string]: string
    }
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

    let aliasAOptions = options?.alias?.[serviceA]
      ? options?.alias?.[serviceA]
      : serviceAAliases.find((a) => {
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

    let aliasBOptions = options?.alias?.[serviceB]
      ? options?.alias?.[serviceB]
      : serviceBAliases.find((a) => {
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
            isList: true,
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
            isList: true,
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
