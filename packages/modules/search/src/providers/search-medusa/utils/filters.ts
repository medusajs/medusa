import { SearchTypes } from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"
import type { Filter } from "./api-types"
import { IndexPlan, PlannedField } from "./plan"

function fail(message: string): never {
  throw new MedusaError(MedusaError.Types.NOT_ALLOWED, message)
}

function coerce(value: unknown, planned?: PlannedField): unknown {
  if (value instanceof Date) {
    return value.toISOString()
  }
  if (planned?.is_date && typeof value === "string") {
    return new Date(value).toISOString()
  }
  return value
}

function globEscape(value: string): string {
  return value.replace(/([*?[\]\\])/g, "\\$1")
}

function sqlLikeToGlob(value: string): string {
  return value
    .replace(/([*?[\]\\])/g, "\\$1")
    .replace(/%/g, "*")
    .replace(/_/g, "?")
}

function operation(
  path: string,
  raw: unknown,
  planned?: PlannedField
): Filter {
  const cast = (value: unknown) => coerce(value, planned)
  const isArray = planned?.is_array === true

  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
    const values = (Array.isArray(raw) ? raw : [raw]).map(cast)
    if (isArray) {
      return values.length === 1
        ? [path, "Contains", values[0]]
        : [path, "ContainsAny", values]
    }
    return values.length === 1
      ? [path, "Eq", values[0]]
      : [path, "In", values]
  }

  const entries = Object.entries(raw as Record<string, unknown>).filter(
    ([key]) => key.startsWith("$")
  )
  if (!entries.length) {
    fail(`Invalid filter value for "${path}"`)
  }

  const filters = entries.map(([operator, value]): Filter => {
    const values = (Array.isArray(value) ? value : [value]).map(cast)
    const comparison = (scalar: string, any: string): Filter =>
      [path, isArray ? any : scalar, values[0]] as Filter

    switch (operator) {
      case "$eq":
        return isArray
          ? [path, "Contains", values[0]]
          : [path, "Eq", values[0]]
      case "$ne":
        return isArray
          ? [path, "NotContains", values[0]]
          : [path, "NotEq", values[0]]
      case "$in":
        return isArray
          ? [path, "ContainsAny", values]
          : [path, "In", values]
      case "$nin":
        return isArray
          ? [path, "NotContainsAny", values]
          : [path, "NotIn", values]
      case "$lt":
        return comparison("Lt", "AnyLt")
      case "$lte":
        return comparison("Lte", "AnyLte")
      case "$gt":
        return comparison("Gt", "AnyGt")
      case "$gte":
        return comparison("Gte", "AnyGte")
      case "$exists":
        return [path, value ? "NotEq" : "Eq", null] as Filter
      case "$contains":
        if (!isArray) {
          fail(`$contains requires an array field ("${path}")`)
        }
        return values.length === 1
          ? [path, "Contains", values[0]]
          : ["And", values.map((entry) => [path, "Contains", entry] as Filter)]
      case "$overlaps":
        if (!isArray) {
          fail(`$overlaps requires an array field ("${path}")`)
        }
        return [path, "ContainsAny", values]
      case "$prefix":
        return [path, "Glob", `${globEscape(String(value))}*`]
      case "$like":
        return [path, "Glob", sqlLikeToGlob(String(value))]
      default:
        return fail(
          `The Medusa search provider does not support ${operator} on "${path}"`
        )
    }
  })

  return filters.length === 1 ? filters[0] : ["And", filters]
}

export function toSearchFilter(
  filters: SearchTypes.SearchFilters | undefined,
  plan?: IndexPlan
): Filter | undefined {
  if (!filters || !Object.keys(filters).length) {
    return undefined
  }

  const compile = (
    branch: SearchTypes.SearchFilters,
    prefix = ""
  ): Filter | undefined => {
    const result: Filter[] = []

    for (const [key, value] of Object.entries(branch)) {
      if (value === undefined || key === "q") {
        continue
      }
      if (key === "$and" || key === "$or") {
        const nested = (value as SearchTypes.SearchFilters[])
          .map((item) => compile(item))
          .filter((item): item is Filter => !!item)
        if (nested.length) {
          result.push([key === "$and" ? "And" : "Or", nested])
        }
        continue
      }
      if (key === "$not") {
        const nested = compile(value as SearchTypes.SearchFilters)
        if (nested) {
          result.push(["Not", nested])
        }
        continue
      }

      const path = prefix ? `${prefix}.${key}` : key
      const planned = plan?.fields.get(path)
      const nestedObject =
        !planned &&
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        !Object.keys(value as object).some((entry) => entry.startsWith("$"))

      if (nestedObject) {
        const nested = compile(value as SearchTypes.SearchFilters, path)
        if (nested) {
          result.push(nested)
        }
        continue
      }

      result.push(operation(path, value, planned))
    }

    if (!result.length) {
      return undefined
    }
    return result.length === 1 ? result[0] : ["And", result]
  }

  return compile(filters)
}
