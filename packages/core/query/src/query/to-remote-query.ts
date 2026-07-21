import {
  JoinerServiceConfig,
  ModuleJoinerConfig,
  RemoteQueryFilters,
  RemoteQueryGraph,
  RemoteQueryInput,
} from "@medusajs/types"
import { isObject, isString, QueryContext } from "@medusajs/utils"

const FIELDS = "__fields"
const ARGUMENTS = "__args"

type JoinerConfigLookupResult = {
  joinerConfig?: ModuleJoinerConfig
  alias?: any
}

/**
 * convert a specific API configuration to a remote query object
 *
 * @param config
 * @param joinerConfigs
 *
 * @example
 * const remoteQueryObject = toRemoteQuery({
 *   entity: "product",
 *   fields,
 *   filters: { variants: QueryFilter({ sku: "abc" }) },
 *   context: {
 *     variants: { calculated_price: QueryContext({ region_id: "reg_123" }) }
 *   }
 * });
 *
 * console.log(remoteQueryObject);
 */

export function toRemoteQuery<const TEntity extends string>(
  config: {
    entity: TEntity
    fields: RemoteQueryInput<TEntity>["fields"]
    filters?: RemoteQueryFilters<TEntity>
    pagination?: Partial<RemoteQueryInput<TEntity>["pagination"]>
    context?: Record<string, any>
    withDeleted?: boolean
    strategy?: "joined" | "select-in" | "balanced"
  },
  joinerConfigs: ModuleJoinerConfig[]
): RemoteQueryGraph<TEntity> {
  const {
    entity,
    fields = [],
    filters = {},
    context = {},
    withDeleted,
    strategy,
  } = config

  const joinerQuery: Record<string, any> = {
    [entity]: {
      __fields: [],
    },
  }

  function processNestedObjects(
    target: any,
    source: Record<string, any>,
    topLevel = true
  ) {
    for (const key in source) {
      const src = topLevel ? source : source[key]

      if (!isObject(src)) {
        target[key] = src
        continue
      }

      if (QueryContext.isQueryContext(src)) {
        const { __type, ...normalizedFilters } = src as any

        const prop = "context"

        if (topLevel) {
          target[ARGUMENTS] ??= {}
          target[ARGUMENTS][prop] = normalizedFilters
          if (withDeleted) {
            target[ARGUMENTS]["withDeleted"] = true
          }
        } else {
          target[key] ??= {}
          target[key][ARGUMENTS] ??= {}
          target[key][ARGUMENTS][prop] = normalizedFilters
          if (withDeleted) {
            target[key][ARGUMENTS]["withDeleted"] = true
          }
        }
      } else {
        if (!topLevel) {
          target[key] ??= {}
        }

        const nextTarget = topLevel ? target : target[key]
        processNestedObjects(nextTarget, src, false)
      }
    }
  }

  // Process filters and context recursively
  processNestedObjects(joinerQuery[entity], context, true)

  for (const field of fields) {
    const fieldAsString = field as string
    if (!fieldAsString.includes(".")) {
      joinerQuery[entity][FIELDS].push(field)
      continue
    }

    const fieldSegments = fieldAsString.split(".")
    const fieldProperty = fieldSegments.pop()

    let combinedPath = ""
    const deepConfigRef = fieldSegments.reduce((acc, curr) => {
      combinedPath = combinedPath ? combinedPath + "." + curr : curr
      acc[curr] ??= {}
      return acc[curr]
    }, joinerQuery[entity])

    deepConfigRef[FIELDS] ??= []
    deepConfigRef[FIELDS].push(fieldProperty)
  }

  if (config.pagination) {
    joinerQuery[entity][ARGUMENTS] ??= {} as any
    joinerQuery[entity][ARGUMENTS] = {
      ...joinerQuery[entity][ARGUMENTS],
      ...config.pagination,
    }
  }

  if (strategy) {
    joinerQuery[entity][ARGUMENTS] ??= {} as any
    joinerQuery[entity][ARGUMENTS]["options"] ??= {} as any
    joinerQuery[entity][ARGUMENTS]["options"]["strategy"] = strategy
  }

  if (withDeleted) {
    joinerQuery[entity][ARGUMENTS] ??= {} as any
    joinerQuery[entity][ARGUMENTS]["withDeleted"] = true
  }

  parseAndAssignFilters(
    {
      entryPoint: entity,
      filters: filters,
      remoteQueryObject: joinerQuery,
    },
    joinerConfigs
  )

  return joinerQuery as RemoteQueryGraph<TEntity>
}

/**
 * Parse and assign filters to remote query object to the corresponding relation level
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
  joinerConfigs: ModuleJoinerConfig[]
) {
  for (const [filterKey, filterValue] of Object.entries(filters)) {
    let entryJoinerConfig!: JoinerServiceConfig

    const { joinerConfig } = retrieveJoinerConfigFromPropertyName({
      entryPoint: entryPoint,
      joinerConfigs,
    })

    entryJoinerConfig = joinerConfig as JoinerServiceConfig

    if (isObject(filterValue)) {
      for (const [nestedFilterKey, nestedFilterValue] of Object.entries(
        filterValue
      )) {
        const { joinerConfig: filterKeyJoinerConfig } =
          retrieveJoinerConfigFromPropertyName({
            entryPoint: nestedFilterKey,
            parentJoinerConfig: joinerConfig,
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

          // The filter may target a relation that was not requested in
          // fields, in which case its node does not exist yet.
          remoteQueryObject[entryPoint] ??= {}
          remoteQueryObject[entryPoint][filterKey] ??= {}

          parseAndAssignFilters(
            {
              entryPoint: nestedFilterKey,
              filters: nestedFilterValue as object,
              remoteQueryObject: remoteQueryObject[entryPoint][filterKey],
              isFieldAliasNestedRelation: isFieldAliasNestedRelation_,
            },
            joinerConfigs
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

function retrieveJoinerConfigFromPropertyName({
  entryPoint,
  parentJoinerConfig,
  joinerConfigs,
}: {
  entryPoint: string
  parentJoinerConfig?: ModuleJoinerConfig
  joinerConfigs: ModuleJoinerConfig[]
}): JoinerConfigLookupResult {
  if (parentJoinerConfig) {
    const res = findAliasFromJoinerConfig({
      joinerConfig: parentJoinerConfig,
      entryPoint,
    })
    if (res) {
      return res
    }
  }

  for (const joinerConfig of joinerConfigs) {
    const joinerConfigAlias = joinerConfig.alias ?? []
    const aliases = Array.isArray(joinerConfigAlias)
      ? joinerConfigAlias
      : [joinerConfigAlias]

    const entryPointAlias = aliases.find((alias) => {
      const aliasNames = Array.isArray(alias.name) ? alias.name : [alias.name]
      return aliasNames.some((alias) => alias === entryPoint)
    })

    if (entryPointAlias) {
      return { joinerConfig, alias: entryPointAlias }
    }
  }

  return {}
}

function findAliasFromJoinerConfig({
  joinerConfig,
  entryPoint,
}: {
  joinerConfig: ModuleJoinerConfig
  entryPoint: string
}): JoinerConfigLookupResult | undefined {
  const joinerConfigAlias = joinerConfig.alias ?? []
  const aliases = Array.isArray(joinerConfigAlias)
    ? joinerConfigAlias
    : [joinerConfigAlias]

  const entryPointAlias = aliases.find((alias) => {
    const aliasNames = Array.isArray(alias.name) ? alias.name : [alias.name]
    return aliasNames.some((alias) => alias === entryPoint)
  })

  if (entryPointAlias) {
    return { joinerConfig, alias: entryPointAlias }
  }

  return
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
