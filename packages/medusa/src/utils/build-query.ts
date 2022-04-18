import {
  DateComparisonOperator,
  FindConfig,
  NumericalComparisonOperator,
  StringComparisonOperator,
  Writable,
} from "../types/common"
import { FindOperator, In, Raw } from "typeorm"

type Selector<TEntity> = {
  [key in keyof TEntity]?: TEntity[key]
    | TEntity[key][]
    | DateComparisonOperator
    | StringComparisonOperator
    | NumericalComparisonOperator
}

/**
* Used to build TypeORM queries.
* @param selector The selector
* @param config The config
* @return The QueryBuilderConfig
*/
export function buildQuery<TEntity = unknown>(
  selector: Selector<TEntity>,
  config: FindConfig<TEntity> = {}
): FindConfig<TEntity> & {
  where: Partial<Writable<TEntity>>
  withDeleted?: boolean
} {
  const build = (
    obj: Selector<TEntity>
  ): Partial<Writable<TEntity>> => {
    return Object.entries(obj).reduce((acc, [key, value]: any) => {
      // Undefined values indicate that they have no significance to the query.
      // If the query is looking for rows where a column is not set it should use null instead of undefined
      if (typeof value === "undefined") {
        return acc
      }

      const subquery: {
        operator: "<" | ">" | "<=" | ">="
        value: unknown
      }[] = []

      switch (true) {
        case value instanceof FindOperator:
          acc[key] = value
          break
        case Array.isArray(value):
          acc[key] = In([...(value as unknown[])])
          break
        case value !== null && typeof value === "object":
          Object.entries(value).map(([modifier, val]) => {
            switch (modifier) {
              case "lt":
                subquery.push({ operator: "<", value: val })
                break
              case "gt":
                subquery.push({ operator: ">", value: val })
                break
              case "lte":
                subquery.push({ operator: "<=", value: val })
                break
              case "gte":
                subquery.push({ operator: ">=", value: val })
                break
              default:
                acc[key] = value
                break
            }
          })

          if (subquery.length) {
            acc[key] = Raw(
              (a) =>
                subquery
                  .map((s, index) => `${a} ${s.operator} :${index}`)
                  .join(" AND "),
              subquery.map((s) => s.value)
            )
          }
          break
        default:
          acc[key] = value
          break
      }

      return acc
    }, {} as Partial<Writable<TEntity>>)
  }

  const query: FindConfig<TEntity> & {
    where: Partial<Writable<TEntity>>
    withDeleted?: boolean
  } = {
    where: build(selector),
  }

  if ("deleted_at" in selector) {
    query.withDeleted = true
  }

  if ("skip" in config) {
    query.skip = config.skip
  }

  if ("take" in config) {
    query.take = config.take
  }

  if ("relations" in config) {
    query.relations = config.relations
  }

  if ("select" in config) {
    query.select = config.select
  }

  if ("order" in config) {
    query.order = config.order
  }

  return query
}