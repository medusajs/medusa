import { isDefined, isObject } from "@medusajs/utils"
import { ResidualCrossModuleFilter } from "./types"

/**
 * Stage-2 in-memory matching of residual cross-module filters against a
 * joined root row. Related values along `path` are collected (flattening
 * list hops); the row matches when at least one related value satisfies
 * `filters`.
 */
export function matchesResidualFilter(
  item: Record<string, unknown>,
  residual: ResidualCrossModuleFilter
): boolean {
  const related = collectAtPath(item, residual.path.split("."))
  if (!related.length) {
    return false
  }

  return related.some((entry) => matchesFilters(entry, residual.filters))
}

export function matchesAllResidualFilters(
  item: Record<string, unknown>,
  residuals: ResidualCrossModuleFilter[]
): boolean {
  return residuals.every((residual) => matchesResidualFilter(item, residual))
}

function collectAtPath(value: unknown, segments: string[]): unknown[] {
  let current: unknown[] = [value]

  for (const segment of segments) {
    current = current.flatMap((entry) => {
      if (!isDefined(entry) || !isObject(entry)) {
        return []
      }

      const next = (entry as Record<string, unknown>)[segment]
      if (!isDefined(next)) {
        return []
      }

      return Array.isArray(next) ? next : [next]
    })
  }

  return current
}

/**
 * Evaluates a Medusa/Mikro-style filters object against a plain data row.
 */
export function matchesFilters(
  data: unknown,
  filters: Record<string, unknown>
): boolean {
  if (!isDefined(data) || !isObject(data)) {
    return false
  }

  const row = data as Record<string, unknown>

  return Object.entries(filters).every(([key, expected]) => {
    if (key === "$and") {
      return (
        Array.isArray(expected) &&
        expected.every(
          (condition) =>
            isObject(condition) &&
            matchesFilters(row, condition as Record<string, unknown>)
        )
      )
    }

    if (key === "$or") {
      return (
        Array.isArray(expected) &&
        expected.some(
          (condition) =>
            isObject(condition) &&
            matchesFilters(row, condition as Record<string, unknown>)
        )
      )
    }

    if (key.startsWith("$")) {
      return matchesOperator(row, key, expected)
    }

    const actual = row[key]

    if (isNestedRelationFilter(key, expected)) {
      const nested = collectAtPath(row, [key])
      if (!nested.length) {
        return false
      }
      return nested.some((entry) =>
        matchesFilters(entry, expected as Record<string, unknown>)
      )
    }

    return matchesValue(actual, expected)
  })
}

function matchesValue(actual: unknown, expected: unknown): boolean {
  if (Array.isArray(expected)) {
    if (Array.isArray(actual)) {
      return expected.some((entry) => actual.includes(entry))
    }
    return expected.includes(actual)
  }

  if (isObject(expected)) {
    const operators = Object.keys(expected)
    if (operators.length && operators.every((key) => key.startsWith("$"))) {
      return operators.every((operator) =>
        matchesOperator(
          actual,
          operator,
          (expected as Record<string, unknown>)[operator]
        )
      )
    }
  }

  return actual === expected
}

function matchesOperator(
  actual: unknown,
  operator: string,
  expected: unknown
): boolean {
  switch (operator) {
    case "$eq":
      return matchesValue(actual, expected)
    case "$ne":
      return !matchesValue(actual, expected)
    case "$in":
      return Array.isArray(expected) && expected.includes(actual)
    case "$nin":
      return Array.isArray(expected) && !expected.includes(actual)
    case "$gt":
      return compare(actual, expected) > 0
    case "$gte":
      return compare(actual, expected) >= 0
    case "$lt":
      return compare(actual, expected) < 0
    case "$lte":
      return compare(actual, expected) <= 0
    case "$like":
      return matchesLike(actual, expected, false)
    case "$ilike":
      return matchesLike(actual, expected, true)
    case "$re":
      return (
        typeof actual === "string" &&
        typeof expected === "string" &&
        new RegExp(expected).test(actual)
      )
    case "$fulltext":
      return (
        typeof actual === "string" &&
        typeof expected === "string" &&
        actual.toLowerCase().includes(expected.toLowerCase())
      )
    case "$is":
      if (expected === null) {
        return actual == null
      }
      return actual === expected
    case "$exists":
      return expected ? isDefined(actual) : !isDefined(actual)
    case "$not":
      if (isObject(expected)) {
        return !matchesValue(actual, expected)
      }
      return actual !== expected
    default:
      return false
  }
}

function compare(actual: unknown, expected: unknown): number {
  if (actual == null || expected == null) {
    return NaN
  }

  if (typeof actual === "number" && typeof expected === "number") {
    return actual - expected
  }

  if (typeof actual === "string" && typeof expected === "string") {
    return actual.localeCompare(expected)
  }

  if (actual instanceof Date || expected instanceof Date) {
    return (
      new Date(actual as string | number | Date).getTime() -
      new Date(expected as string | number | Date).getTime()
    )
  }

  return NaN
}

function matchesLike(
  actual: unknown,
  expected: unknown,
  caseInsensitive: boolean
): boolean {
  if (typeof actual !== "string" || typeof expected !== "string") {
    return false
  }

  const escapeRegex = (value: string) =>
    value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const pattern = `^${escapeRegex(expected).replace(/%/g, ".*").replace(/_/g, ".")}$`
  return new RegExp(pattern, caseInsensitive ? "i" : undefined).test(actual)
}

function isNestedRelationFilter(key: string, value: unknown): boolean {
  if (key.startsWith("$") || !isObject(value) || Array.isArray(value)) {
    return false
  }

  const keys = Object.keys(value)
  return keys.length > 0 && !keys.every((entry) => entry.startsWith("$"))
}
