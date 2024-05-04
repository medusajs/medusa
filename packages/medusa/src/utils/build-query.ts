import {
  And,
  FindManyOptions,
  FindOperator,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  ILike,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
} from "typeorm"
import { ExtendedFindConfig, FindConfig } from "../types/common"

import { FindOptionsOrder } from "typeorm/find-options/FindOptionsOrder"
import { isObject } from "./is-object"
import { buildOrder, buildRelations, buildSelects } from "@medusajs/utils"

const operatorsMap = {
  lt: (value) => LessThan(value),
  gt: (value) => MoreThan(value),
  lte: (value) => LessThanOrEqual(value),
  gte: (value) => MoreThanOrEqual(value),
  contains: (value) => ILike(`%${value}%`),
  starts_with: (value) => ILike(`${value}%`),
  ends_with: (value) => ILike(`%${value}`),
}

/**
 * Used to build TypeORM queries.
 * @param selector The selector
 * @param config The config
 * @return The QueryBuilderConfig
 */
export function buildQuery<TWhereKeys extends object, TEntity = unknown>(
  selector: TWhereKeys,
  config: FindConfig<TEntity> = {}
) {
  const query: ExtendedFindConfig<TEntity> = {
    where: buildWhere<TWhereKeys, TEntity>(selector),
  }

  if ("deleted_at" in selector) {
    query.withDeleted = true
  }

  if ("skip" in config) {
    ;(query as FindManyOptions<TEntity>).skip = config.skip ?? undefined
  }

  if ("take" in config) {
    ;(query as FindManyOptions<TEntity>).take = config.take ?? undefined
  }

  if (config.relations) {
    query.relations = buildRelations(
      config.relations
    ) as FindOptionsRelations<TEntity>
  }

  if (config.select) {
    query.select = buildSelects(
      config.select as string[]
    ) as FindOptionsSelect<TEntity>
  }

  if (config.order) {
    query.order = buildOrder(config.order) as FindOptionsOrder<TEntity>
  }

  return query
}

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
function buildWhere<TWhereKeys extends object, TEntity>(
  constraints: TWhereKeys
): FindOptionsWhere<TEntity> | FindOptionsWhere<TEntity>[] {
  let where: FindOptionsWhere<TEntity> | FindOptionsWhere<TEntity>[] = {}

  if (Array.isArray(constraints)) {
    where = []
    constraints.forEach((constraint) => {
      ;(where as FindOptionsWhere<TEntity>[]).push(
        buildWhere(constraint) as FindOptionsWhere<TEntity>
      )
    })

    return where
  }

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
      Object.entries(value).forEach(([objectKey, objectValue]) => {
        where[key] = where[key] || []
        if (operatorsMap[objectKey]) {
          where[key].push(operatorsMap[objectKey](objectValue))
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
        where[key] = And(...where[key])
      }

      continue
    }

    where[key] = value
  }

  return where
}

/**
 * Revert new object structure of find options to the legacy structure of previous version
 * @deprecated in favor of import { objectToStringPath } from "@medusajs/utils"
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
 * output: ['test.test1', 'test.test2', 'test.test3.test4', 'test2']
 * @param input
 */
export function buildLegacyFieldsListFrom<TEntity>(
  input:
    | FindOptionsWhere<TEntity>
    | FindOptionsSelect<TEntity>
    | FindOptionsOrder<TEntity>
    | FindOptionsRelations<TEntity> = {}
): (keyof TEntity)[] {
  if (!Object.keys(input).length) {
    return []
  }

  const output: Set<string> = new Set(Object.keys(input))

  for (const key of Object.keys(input)) {
    if (input[key] != undefined && typeof input[key] === "object") {
      const deepRes = buildLegacyFieldsListFrom(input[key])

      const items = deepRes.reduce((acc, val) => {
        acc.push(`${key}.${val}`)
        return acc
      }, [] as string[])

      items.forEach((item) => output.add(item))
      continue
    }

    output.add(key)
  }

  return Array.from(output) as (keyof TEntity)[]
}

export function addOrderToSelect<TEntity>(
  order: FindOptionsOrder<TEntity>,
  select: FindOptionsSelect<TEntity>
): void {
  for (const orderBy of Object.keys(order)) {
    if (isObject(order[orderBy])) {
      select[orderBy] =
        select[orderBy] && isObject(select[orderBy]) ? select[orderBy] : {}
      addOrderToSelect(order[orderBy], select[orderBy])
      continue
    }

    select[orderBy] = isObject(select[orderBy])
      ? { ...select[orderBy], id: true, [orderBy]: true }
      : true
  }
}

export function nullableValue(value: any): FindOperator<any> {
  if (value === null) {
    return IsNull()
  } else {
    return value
  }
}
