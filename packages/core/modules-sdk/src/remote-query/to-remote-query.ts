import { RemoteQueryGraph, RemoteQueryObjectConfig } from "@medusajs/types"
import { QueryContext, QueryFilter, isObject } from "@medusajs/utils"

/**
 * Convert a string fields array to a remote query object
 * @param config - The configuration object
 *
 * @example
 * const remoteQueryObject = toRemoteQuery({
 *   entity: "product",
 *   fields,
 *   filter: { variants: QueryFilter({ sku: "abc" }) },
 *   context: {
 *     variants: { calculated_price: QueryContext({ region_id: "reg_123" }) }
 *   }
 * });
 *
 * console.log(remoteQueryObject);
 */

const FIELDS = "__fields"
const ARGUMENTS = "__args"

export function toRemoteQuery<
  const TEntity extends string,
  const TConfig extends RemoteQueryObjectConfig<TEntity>
>(config: {
  entity: TEntity
  fields: string[]
  filter?: Record<string, any>
  context?: Record<string, any>
}): RemoteQueryGraph<TConfig> {
  const { entity, fields = [], filter = {}, context = {} } = config

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

      if (QueryContext.isQueryContext(src) || QueryFilter.isQueryFilter(src)) {
        const filter = { ...src } as any
        delete filter.__type

        const prop = QueryFilter.isQueryFilter(src) ? "filters" : "context"

        if (topLevel) {
          target[ARGUMENTS] ??= {}
          target[ARGUMENTS][prop] = filter
        } else {
          target[key] ??= {}
          target[key][ARGUMENTS] ??= {}
          target[key][ARGUMENTS][prop] = filter
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

  // Process filter and context recursively
  processNestedObjects(joinerQuery[entity], filter)
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

  return joinerQuery as RemoteQueryGraph<TConfig>
}
