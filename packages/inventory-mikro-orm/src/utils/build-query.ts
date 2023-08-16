import { FilterQuery } from "@medusajs/types"

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
