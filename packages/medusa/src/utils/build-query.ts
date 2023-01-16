import { ExtendedFindConfig, FindConfig } from "../types/common"
import {
  FindManyOptions,
  FindOperator,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
} from "typeorm"
import { FindOptionsOrder } from "typeorm/find-options/FindOptionsOrder"

/**
 * Used to build TypeORM queries.
 * @param selector The selector
 * @param config The config
 * @return The QueryBuilderConfig
 */
export function buildQuery<TWhereKeys, TEntity = unknown>(
  selector: TWhereKeys,
  config: FindConfig<TEntity> = {}
): ExtendedFindConfig<TEntity> {
  const query: ExtendedFindConfig<TEntity> = {
    where: buildWhere<TWhereKeys, TEntity>(selector),
  }

  if ("deleted_at" in selector) {
    query.withDeleted = true
  }

  if ("skip" in config) {
    ;(query as FindManyOptions<TEntity>).skip = config.skip
  }

  if ("take" in config) {
    ;(query as FindManyOptions<TEntity>).take = config.take
  }

  if (config.relations) {
    query.relations = buildRelations<TEntity>(config.relations)
  }

  if (config.select) {
    query.select = buildSelects(config.select as string[])
  }

  if (config.order) {
    query.order = buildOrder(config.order)
  }

  return query
}

function buildWhere<TWhereKeys, TEntity>(constraints: TWhereKeys): any {
  const where: FindOptionsWhere<TEntity> = {}
  for (const [key, value] of Object.entries(constraints)) {
    if (value === undefined) {
      continue
    }

    if (value === null) {
      where[key] = IsNull()
      continue
    }

    if (value instanceof FindOperator) {
      where[key] = value
      continue
    }

    if (Array.isArray(value)) {
      where[key] = In(value)
      continue
    }

    if (typeof value === "object") {
      where[key] = buildWhere<TWhereKeys[keyof TWhereKeys], TEntity>(value)
      continue
    }

    const allowedModifiers = ["lt", "gt", "lte", "gte"]
    if (allowedModifiers.indexOf(key.toLowerCase()) > -1) {
      switch (key) {
        case "lt":
          where[key] = LessThan(value)
          break
        case "gt":
          where[key] = MoreThan(value)
          break
        case "lte":
          where[key] = LessThanOrEqual(value)
          break
        case "gte":
          where[key] = MoreThanOrEqual(value)
          break
      }
      continue
    }

    where[key] = value
  }

  return where
}

/**
 * Revert new object structure of find options to the legacy structure of previous version
 * @example
 * input: {
 *   test: {
 *     test1: true,
 *     test2: true,
 *     test3: {
 *       test4: true
 *     },
 *   },
 *   test2: true
 * }
 * output: [ [ 'test.test1', 'test.test2', 'test.test3.test4' ], 'test2' ]
 * @param input
 */
export function buildLegacySelectOrRelationsFrom<TEntity>(
  input:
    | FindOptionsWhere<TEntity>
    | FindOptionsSelect<TEntity>
    | FindOptionsRelations<TEntity> = {}
): (keyof TEntity)[] {
  if (!Object.keys(input).length) {
    return []
  }

  const output: string[] = []

  for (const key of Object.keys(input)) {
    if (input[key] != undefined && typeof input[key] === "object") {
      const deepRes = buildLegacySelectOrRelationsFrom(input[key])

      const res = deepRes.reduce((acc, val) => {
        acc.push(`${key}.${val}`)
        return acc
      }, [] as string[])

      output.push(...res)
      continue
    }

    output.push(key)
  }

  return output as (keyof TEntity)[]
}

export function buildSelects<TEntity>(
  selectCollection: string[]
): FindOptionsSelect<TEntity> {
  return buildRelationsOrSelect(selectCollection) as FindOptionsSelect<TEntity>
}

export function buildRelations<TEntity>(
  relationCollection: string[]
): FindOptionsRelations<TEntity> {
  return buildRelationsOrSelect(
    relationCollection
  ) as FindOptionsRelations<TEntity>
}

/**
 * Convert an collection of dot string into a nested object
 * @example
 * input: [
 *    order,
 *    order.items,
 *    order.swaps,
 *    order.swaps.additional_items,
 *    order.discounts,
 *    order.discounts.rule,
 *    order.claims,
 *    order.claims.additional_items,
 *    additional_items,
 *    additional_items.variant,
 *    return_order,
 *    return_order.items,
 *    return_order.shipping_method,
 *    return_order.shipping_method.tax_lines
 * ]
 * output: {
 *   "order": {
 *     "items": true,
 *     "swaps": {
 *       "additional_items": true
 *     },
 *     "discounts": {
 *       "rule": true
 *     },
 *     "claims": {
 *       "additional_items": true
 *     }
 *   },
 *   "additional_items": {
 *     "variant": true
 *   },
 *   "return_order": {
 *     "items": true,
 *     "shipping_method": {
 *       "tax_lines": true
 *     }
 *   }
 * }
 * @param collection
 */
function buildRelationsOrSelect<TEntity>(
  collection: string[]
): FindOptionsRelations<TEntity> | FindOptionsSelect<TEntity> {
  const output: FindOptionsRelations<TEntity> = {}

  for (const relation of collection) {
    if (relation.indexOf(".") > -1) {
      const nestedRelations = relation.split(".")

      let parent = output

      while (nestedRelations.length > 1) {
        const nestedRelation = nestedRelations.shift() as string
        parent = parent[nestedRelation] =
          parent[nestedRelation] !== true &&
          typeof parent[nestedRelation] === "object"
            ? parent[nestedRelation]
            : {}
      }

      parent[nestedRelations[0]] = true

      continue
    }

    output[relation] = true
  }

  return output
}

/**
 * Convert an order of dot string into a nested object
 * @example
 * input: { id: "ASC", "items.title": "ASC", "items.variant.title": "ASC" }
 * output: {
 *   "id": "ASC",
 *   "items": {
 *     "id": "ASC",
 *     "variant": {
 *        "title": "ASC"
 *     }
 *   },
 * }
 * @param orderBy
 */
function buildOrder<TEntity>(orderBy: {
  [k: string]: "ASC" | "DESC"
}): FindOptionsOrder<TEntity> {
  const output: FindOptionsOrder<TEntity> = {}

  const orderKeys = Object.keys(orderBy)

  for (const order of orderKeys) {
    if (order.indexOf(".") > -1) {
      const nestedOrder = order.split(".")

      let parent = output

      while (nestedOrder.length > 1) {
        const nestedRelation = nestedOrder.shift() as string
        parent = parent[nestedRelation] = parent[nestedRelation] ?? {}
      }

      parent[nestedOrder[0]] = orderBy[order]

      continue
    }

    output[order] = orderBy[order]
  }

  return output
}
