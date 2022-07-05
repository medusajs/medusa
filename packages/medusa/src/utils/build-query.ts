import {
  ExtendedFindConfig,
  FindConfig,
  Selector,
  Writable,
} from "../types/common"
import { FindOperator, In, IsNull, Raw } from "typeorm"

/**
 * Used to build TypeORM queries.
 * @param selector The selector
 * @param config The config
 * @return The QueryBuilderConfig
 */
export function buildQuery<TWhereKeys, TEntity = unknown>(
  selector: TWhereKeys,
  config: FindConfig<TEntity> = {}
): ExtendedFindConfig<TEntity, TWhereKeys> {
  const build = (obj: Selector<TEntity>): Partial<Writable<TWhereKeys>> => {
    return Object.entries(obj).reduce((acc, [key, value]: any) => {
      // Undefined values indicate that they have no significance to the query.
      // If the query is looking for rows where a column is not set it should use null instead of undefined
      if (typeof value === "undefined") {
        return acc
      }

      if (value === null) {
        acc[key] = IsNull()
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
    }, {} as Partial<Writable<TWhereKeys>>)
  }

  const query: ExtendedFindConfig<TEntity, TWhereKeys> = {
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
