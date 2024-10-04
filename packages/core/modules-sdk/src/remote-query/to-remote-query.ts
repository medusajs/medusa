import {
  RemoteQueryEntryPoints,
  RemoteQueryFilters,
  RemoteQueryGraph,
  RemoteQueryInput,
} from "@medusajs/types"
import { isObject, QueryContext } from "@medusajs/utils"
import { parseAndAssignFilters } from "./parse-filters"

const FIELDS = "__fields"
const ARGUMENTS = "__args"

/**
 * convert a specific API configuration to a remote query object
 *
 * @param config
 * @param entitiesMap
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
    entity: TEntity | keyof RemoteQueryEntryPoints
    fields: RemoteQueryInput<TEntity>["fields"]
    filters?: RemoteQueryFilters<TEntity>
    pagination?: Partial<RemoteQueryInput<TEntity>["pagination"]>
    context?: Record<string, any>
  },
  entitiesMap: Map<string, any>
): RemoteQueryGraph<TEntity> {
  const { entity, fields = [], filters = {}, context = {} } = config

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
        const normalizedFilters = { ...src } as any
        delete normalizedFilters.__type

        const prop = "context"

        if (topLevel) {
          target[ARGUMENTS] ??= {}
          target[ARGUMENTS][prop] = normalizedFilters
        } else {
          target[key] ??= {}
          target[key][ARGUMENTS] ??= {}
          target[key][ARGUMENTS][prop] = normalizedFilters
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
  processNestedObjects(joinerQuery[entity], context)

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

  parseAndAssignFilters(
    {
      entryPoint: entity,
      filters: filters,
      remoteQueryObject: joinerQuery,
    },
    entitiesMap
  )

  return joinerQuery as RemoteQueryGraph<TEntity>
}
