import { ExtendedFindConfig, FilterQuery, FindConfig } from "@medusajs/types"
import {
  FindManyOptions,
  FindOperator,
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
} from "typeorm"
import { buildOrder, buildRelations, buildSelects } from "@medusajs/utils"

const getOperator = (key, value) => {
  switch (key) {
    case "lt":
      return { $lt: value }
    case "gt":
      return { $gt: value }
    case "lte":
      return { $lte: value }
    case "gte":
      return { $gte: value }
    case "contains":
      return { $ilike: `%${value}%` }
    case "starts_with":
      return { $ilike: `${value}%` }
    case "ends_with":
      return { $ilike: `%${value}` }
    default:
      return undefined
  }
}

/**
 * Used to build TypeORM queries.
 * @param selector The selector
 * @param config The config
 * @return The QueryBuilderConfig
 */
// export function buildQuery<TWhereKeys extends object, TEntity = unknown>(
//   selector: TWhereKeys,
//   config: FindConfig<TEntity> = {}
// ) {
//   const query: ExtendedFindConfig<TEntity> = {
//     where: buildWhere<TWhereKeys, TEntity>(selector),
//   }

//   if ("deleted_at" in selector) {
//     query.withDeleted = true
//   }

//   if ("skip" in config) {
//     (query as FindManyOptions<TEntity>).skip = config.skip
//   }

//   if ("take" in config) {
//     (query as FindManyOptions<TEntity>).take = config.take
//   }

//   if (config.relations) {
//     query.relations = buildRelations(
//       config.relations
//     ) as FindOptionsRelations<TEntity>
//   }

//   if (config.select) {
//     query.select = buildSelects(
//       config.select as string[]
//     ) as FindOptionsSelect<TEntity>
//   }

//   if (config.order) {
//     query.order = buildOrder(config.order) as FindOptionsOrder<TEntity>
//   }

//   return query
// }

/**
 * @param constraints
 *
 * @example
 * const q = buildWhere(
 *   {
 *     id: "1234",
 *     test1: ["123", "12", "1"],
 *     test2: Not("this"),
 *     date: { gt: date },
 *     amount: { gt: 10 },
 *   },
 *)
 *
 * // Output
 * {
 *    id: "1234",
 *    test1: In(["123", "12", "1"]),
 *    test2: Not("this"),
 *    date: MoreThan(date),
 *    amount: MoreThan(10)
 * }
 */
export function buildWhere<TWhereKeys extends object, TEntity>(
  constraints: TWhereKeys
): FilterQuery<TEntity> {
  const where: FilterQuery<TEntity> = {}
  for (const [key, value] of Object.entries(constraints)) {
    if (value === undefined) {
      continue
    }

    if (value === null) {
      where[key] = { $eq: null }
      continue
    }

    if (value instanceof FindOperator) {
      where[key] = value
      continue
    }

    if (Array.isArray(value)) {
      where[key] = { $in: value }
      continue
    }

    if (typeof value === "object") {
      Object.entries(value).forEach(([objectKey, objectValue]) => {
        where[key] = where[key] || []
        const operator = getOperator(objectKey, objectValue)
        if (operator) {
          where[key].push(operator)
        } else {
          if (objectValue != undefined && typeof objectValue === "object") {
            where[key] = buildWhere<any, TEntity>(objectValue)
            return
          }
          where[key] = value
        }
        return
      })

      if (!Array.isArray(where[key])) {
        continue
      }

      if (where[key].length === 1) {
        where[key] = where[key][0]
      } else {
        where[key] = { $and: where[key] }
      }

      continue
    }

    where[key] = value
  }

  return where
}
