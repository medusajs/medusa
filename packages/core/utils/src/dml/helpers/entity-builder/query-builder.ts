import { QueryCondition, QueryValue, SimpleQueryValue } from "@medusajs/types"
import { isBoolean, isDefined, isObject, isString } from "../../../common"

/*
  When creating indexes on the entity, we provide a basic query builder to generate
  the SQL for where query upon the index. Since this is not a full query builder, 
  the onus is upon the user to ensure that the SQL is accurately generated.

  Examples:

  { where: { column: null } }
  { where: { column: { $ne: null } } }
  { where: { boolean_column: true } }
  { where: { column: "value", another_column: { $ne: 30 }, boolean_column: true } }
*/
export function buildWhereQuery(query: QueryCondition): string {
  const conditions: string[] = []

  for (const [key, value] of Object.entries(query)) {
    if (isQueryCondition(value)) {
      conditions.push(buildWhereQuery(value))
    } else {
      conditions.push(buildCondition(key, value as QueryValue))
    }
  }

  return conditions.filter((condition) => condition?.length).join(" AND ")
}

function isQueryCondition(value: any): value is QueryCondition {
  return isObject(value) && value !== null && !("$ne" in value)
}

function buildCondition(key: string, value: QueryValue): string {
  if (value === null) {
    return `${key} IS NULL`
  } else if (isObject(value) && "$ne" in value) {
    if (value.$ne === null) {
      return `${key} IS NOT NULL`
    } else {
      return `${key} != ${formatValue(value.$ne)}`
    }
  } else if (isBoolean(value)) {
    return `${key} IS ${formatValue(value)}`
  } else if (!isDefined(value)) {
    return ""
  } else {
    return `${key} = ${formatValue(value)}`
  }
}

function formatValue(value: SimpleQueryValue): string {
  if (isString(value)) {
    return `'${value.replace(/'/g, "''")}'` // Escape single quotes
  }

  if (isBoolean(value)) {
    return value ? "TRUE" : "FALSE"
  }

  return String(value)
}
