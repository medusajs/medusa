import {
  JoinerServiceConfig,
  JoinerServiceConfigAlias,
  ModuleJoinerConfig,
} from "@medusajs/types"
import { isObject, isString } from "@medusajs/utils"
import { MedusaModule } from "../medusa-module"

/**
 * Parse and assign filters to remote query object to the corresponding relation level
 * @param entryPoint
 * @param filters
 * @param remoteQueryObject
 * @param isFieldAliasNestedRelation
 */
export function parseAndAssignFilters(
  {
    entryPoint,
    filters,
    remoteQueryObject,
    isFieldAliasNestedRelation,
  }: {
    remoteQueryObject: object
    entryPoint: string
    filters: object
    isFieldAliasNestedRelation?: boolean
  },
  entitiesMap: Map<string, any>
) {
  const joinerConfigs = MedusaModule.getAllJoinerConfigs()

  const joinerConfigMapCache = new Map()

  for (const [filterKey, filterValue] of Object.entries(filters)) {
    let entryAlias!: JoinerServiceConfigAlias
    let entryJoinerConfig!: JoinerServiceConfig

    if (!joinerConfigMapCache.has(filterKey)) {
      const { joinerConfig, alias } = retrieveJoinerConfigFromPropertyName({
        entryPoint: entryPoint,
        joinerConfigs,
      })

      entryAlias = alias
      entryJoinerConfig = joinerConfig

      joinerConfigMapCache.set(joinerConfig.serviceName, {
        alias,
      })
    } else {
      const data = joinerConfigMapCache.get(filterKey)
      entryAlias = data.alias
    }

    const entryEntity = entitiesMap[entryAlias.entity!]
    if (!entryEntity) {
      throw new Error(
        `Entity ${entryAlias.entity} not found in the public schema of the joiner config from ${entryJoinerConfig.serviceName}`
      )
    }

    if (isObject(filterValue)) {
      for (const [nestedFilterKey, nestedFilterValue] of Object.entries(
        filterValue
      )) {
        const { joinerConfig: filterKeyJoinerConfig } =
          retrieveJoinerConfigFromPropertyName({
            entryPoint: nestedFilterKey,
            joinerConfigs,
          })

        if (
          !filterKeyJoinerConfig ||
          filterKeyJoinerConfig.serviceName === entryJoinerConfig.serviceName
        ) {
          assignNestedRemoteQueryObject({
            entryPoint,
            filterKey,
            nestedFilterKey,
            filterValue,
            nestedFilterValue,
            remoteQueryObject,
            isFieldAliasNestedRelation,
          })
        } else {
          const isFieldAliasNestedRelation_ = isFieldAliasNestedRelationHelper({
            nestedFilterKey,
            entryJoinerConfig,
            joinerConfigs,
            filterKeyJoinerConfig,
          })

          parseAndAssignFilters(
            {
              entryPoint: nestedFilterKey,
              filters: nestedFilterValue,
              remoteQueryObject: remoteQueryObject[entryPoint][filterKey],
              isFieldAliasNestedRelation: isFieldAliasNestedRelation_,
            },
            entitiesMap
          )
        }
      }

      continue
    }

    assignRemoteQueryObject({
      entryPoint,
      filterKey,
      filterValue,
      remoteQueryObject,
      isFieldAliasNestedRelation,
    })
  }
}

function retrieveJoinerConfigFromPropertyName({ entryPoint, joinerConfigs }) {
  for (const joinerConfig of joinerConfigs) {
    const aliases = joinerConfig.alias
    const entryPointAlias = aliases.find((alias) => {
      const aliasNames = Array.isArray(alias.name) ? alias.name : [alias.name]
      return aliasNames.includes(entryPoint)
    })

    if (entryPointAlias) {
      return { joinerConfig, alias: entryPointAlias }
    }
  }

  return {}
}

function assignRemoteQueryObject({
  entryPoint,
  filterKey,
  filterValue,
  remoteQueryObject,
  isFieldAliasNestedRelation,
}: {
  entryPoint: string
  filterKey: string
  filterValue: any
  remoteQueryObject: object
  isFieldAliasNestedRelation?: boolean
}) {
  remoteQueryObject[entryPoint] ??= {}
  remoteQueryObject[entryPoint].__args ??= {}
  remoteQueryObject[entryPoint].__args["filters"] ??= {}

  if (!isFieldAliasNestedRelation) {
    remoteQueryObject[entryPoint].__args["filters"][filterKey] = filterValue
  } else {
    // In case of field alias that refers to a relation of linked entity we need to assign the filter on the relation filter itself instead of top level of the args\
    remoteQueryObject[entryPoint].__args["filters"][entryPoint] ??= {}
    remoteQueryObject[entryPoint].__args["filters"][entryPoint][filterKey] =
      filterValue
  }
}

function assignNestedRemoteQueryObject({
  entryPoint,
  filterKey,
  nestedFilterKey,
  nestedFilterValue,
  remoteQueryObject,
  isFieldAliasNestedRelation,
}: {
  entryPoint: string
  filterKey: string
  filterValue: any
  nestedFilterKey: string
  nestedFilterValue: any
  remoteQueryObject: object
  isFieldAliasNestedRelation?: boolean
}) {
  remoteQueryObject[entryPoint] ??= {}
  remoteQueryObject[entryPoint]["__args"] ??= {}
  remoteQueryObject[entryPoint]["__args"]["filters"] ??= {}

  if (!isFieldAliasNestedRelation) {
    remoteQueryObject[entryPoint]["__args"]["filters"][filterKey] ??= {}
    remoteQueryObject[entryPoint]["__args"]["filters"][filterKey][
      nestedFilterKey
    ] = nestedFilterValue
  } else {
    // In case of field alias that refers to a relation of linked entity we need to assign the filter on the relation filter itself instead of top level of the args
    remoteQueryObject[entryPoint]["__args"]["filters"][entryPoint] ??= {}
    remoteQueryObject[entryPoint]["__args"]["filters"][entryPoint][
      filterKey
    ] ??= {}
    remoteQueryObject[entryPoint]["__args"]["filters"][entryPoint][filterKey][
      nestedFilterKey
    ] = nestedFilterValue
  }
}

function isFieldAliasNestedRelationHelper({
  nestedFilterKey,
  entryJoinerConfig,
  joinerConfigs,
  filterKeyJoinerConfig,
}: {
  nestedFilterKey: string
  entryJoinerConfig: ModuleJoinerConfig
  joinerConfigs: ModuleJoinerConfig[]
  filterKeyJoinerConfig: ModuleJoinerConfig
}): boolean {
  const linkJoinerConfig = joinerConfigs.find((joinerConfig) => {
    return joinerConfig.relationships?.every(
      (rel) =>
        rel.serviceName === entryJoinerConfig.serviceName ||
        rel.serviceName === filterKeyJoinerConfig.serviceName
    )
  })

  const relationsAlias = linkJoinerConfig?.relationships?.map((r) => r.alias)

  let isFieldAliasNestedRelation = false

  if (linkJoinerConfig && relationsAlias?.length) {
    const fieldAlias = linkJoinerConfig.extends?.find(
      (extend) => extend.fieldAlias?.[nestedFilterKey]
    )?.fieldAlias

    if (fieldAlias) {
      const path = isString(fieldAlias?.[nestedFilterKey])
        ? fieldAlias?.[nestedFilterKey]
        : (fieldAlias?.[nestedFilterKey] as any).path

      if (!relationsAlias.includes(path.split(".").pop())) {
        isFieldAliasNestedRelation = true
      }
    }
  }

  return isFieldAliasNestedRelation
}
