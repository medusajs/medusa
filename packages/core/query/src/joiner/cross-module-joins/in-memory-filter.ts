import { isObject, MedusaError } from "@medusajs/utils"

/**
 * In-memory evaluation of Medusa filter objects against loaded records, used
 * by stage 2 of cross-module filtering to complete filters that could not be
 * pushed down to SQL.
 *
 * Semantics mirror the SQL pushdown (correlated EXISTS): a nested object
 * condition on a to-many value matches when ANY element matches. Operators
 * follow their MikroORM/Postgres counterparts as closely as the loaded data
 * allows ($fulltext degrades to a per-token case-insensitive contains).
 */

/** A plain object whose keys are all operators (e.g. `{ $gt: 100 }`). */
export function isOperatorMap(value: unknown): boolean {
  if (!isObject(value)) {
    return false
  }

  const keys = Object.keys(value)
  return keys.length > 0 && keys.every((key) => key.startsWith("$"))
}

/**
 * Whether a record satisfies a filters object. Non-operator keys with plain
 * object values recurse into the record's own value (relations and JSON
 * columns alike), so no catalog metadata is needed at evaluation time.
 */
export function matchesFilters(
  record: unknown,
  filters: Record<string, unknown>
): boolean {
  if (!isObject(record)) {
    return false
  }

  return Object.entries(filters).every(([key, condition]) => {
    if (key === "$and") {
      return toArray(condition).every(
        (entry) =>
          isObject(entry) &&
          matchesFilters(record, entry as Record<string, unknown>)
      )
    }

    if (key === "$or") {
      return toArray(condition).some(
        (entry) =>
          isObject(entry) &&
          matchesFilters(record, entry as Record<string, unknown>)
      )
    }

    if (key === "$not") {
      return (
        isObject(condition) &&
        !matchesFilters(record, condition as Record<string, unknown>)
      )
    }

    return matchesCondition((record as Record<string, unknown>)[key], condition)
  })
}

function matchesCondition(value: unknown, condition: unknown): boolean {
  if (isOperatorMap(condition)) {
    return Object.entries(condition as Record<string, unknown>).every(
      ([operator, arg]) => applyOperator(value, operator, arg)
    )
  }

  // Plain object condition: a relation or JSON value. To-many values use
  // EXISTS semantics.
  if (isObject(condition)) {
    if (Array.isArray(value)) {
      return value.some(
        (entry) =>
          isObject(entry) &&
          matchesFilters(entry, condition as Record<string, unknown>)
      )
    }

    return matchesFilters(value, condition as Record<string, unknown>)
  }

  // Array condition on a field is an implicit $in.
  if (Array.isArray(condition)) {
    return condition.some((entry) => equals(value, entry))
  }

  return equals(value, condition)
}

function applyOperator(
  value: unknown,
  operator: string,
  arg: unknown
): boolean {
  switch (operator) {
    case "$and":
      return toArray(arg).every((entry) => matchesCondition(value, entry))
    case "$or":
      return toArray(arg).some((entry) => matchesCondition(value, entry))
    case "$not":
      return !matchesCondition(value, arg)
    case "$eq":
      return equals(value, arg)
    case "$ne":
      return !equals(value, arg)
    case "$in":
      return toArray(arg).some((entry) => equals(value, entry))
    case "$nin":
      return !toArray(arg).some((entry) => equals(value, entry))
    case "$gt": {
      const result = compare(value, arg)
      return result !== null && result > 0
    }
    case "$gte": {
      const result = compare(value, arg)
      return result !== null && result >= 0
    }
    case "$lt": {
      const result = compare(value, arg)
      return result !== null && result < 0
    }
    case "$lte": {
      const result = compare(value, arg)
      return result !== null && result <= 0
    }
    case "$like":
      return likeMatches(value, arg, false)
    case "$ilike":
      return likeMatches(value, arg, true)
    case "$re":
      return value != null && new RegExp(String(arg)).test(String(value))
    case "$fulltext": {
      if (value == null) {
        return false
      }
      const haystack = String(value).toLowerCase()
      return String(arg)
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean)
        .every((token) => haystack.includes(token))
    }
    case "$exists":
      return (value != null) === (arg !== false)
    case "$is":
      return arg === null ? value == null : equals(value, arg)
    case "$overlap":
      return (
        Array.isArray(value) &&
        toArray(arg).some((entry) => value.some((v) => equals(v, entry)))
      )
    case "$contains":
      return (
        Array.isArray(value) &&
        toArray(arg).every((entry) => value.some((v) => equals(v, entry)))
      )
    case "$contained":
      return (
        Array.isArray(value) &&
        value.every((v) => toArray(arg).some((entry) => equals(v, entry)))
      )
    default:
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Operator "${operator}" is not supported for in-memory cross-module filtering.`
      )
  }
}

function equals(value: unknown, expected: unknown): boolean {
  if (value instanceof Date || expected instanceof Date) {
    const a = toTime(value)
    const b = toTime(expected)
    return a !== null && a === b
  }

  const a = normalizeScalar(value)
  const b = normalizeScalar(expected)

  if (a == null || b == null) {
    return a == null && b == null
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((entry, idx) => equals(entry, b[idx]))
  }

  return a === b
}

/** Three-way comparison; null when the values are not comparable. */
function compare(value: unknown, expected: unknown): number | null {
  if (value == null || expected == null) {
    return null
  }

  if (value instanceof Date || expected instanceof Date) {
    const a = toTime(value)
    const b = toTime(expected)
    return a === null || b === null ? null : a - b
  }

  const a = normalizeScalar(value)
  const b = normalizeScalar(expected)

  if (typeof a === "number" || typeof b === "number") {
    const numA = Number(a)
    const numB = Number(b)
    return Number.isNaN(numA) || Number.isNaN(numB) ? null : numA - numB
  }

  if (typeof a === "string" && typeof b === "string") {
    // DB numerics often surface as strings; compare numerically when both
    // sides parse.
    const numA = Number(a)
    const numB = Number(b)
    if (
      a.trim() !== "" &&
      b.trim() !== "" &&
      !Number.isNaN(numA) &&
      !Number.isNaN(numB)
    ) {
      return numA - numB
    }
    return a < b ? -1 : a > b ? 1 : 0
  }

  return null
}

function likeMatches(
  value: unknown,
  pattern: unknown,
  caseInsensitive: boolean
): boolean {
  if (value == null || typeof pattern !== "string") {
    return false
  }

  const source =
    "^" +
    pattern
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      .replace(/%/g, "[\\s\\S]*")
      .replace(/_/g, ".") +
    "$"

  return new RegExp(source, caseInsensitive ? "i" : "").test(String(value))
}

function toTime(value: unknown): number | null {
  if (value instanceof Date) {
    return value.getTime()
  }

  if (typeof value === "string" || typeof value === "number") {
    const time = new Date(value).getTime()
    return Number.isNaN(time) ? null : time
  }

  return null
}

/** Unwraps BigNumber-like values (`{ numeric: number }`) to their numeric form. */
function normalizeScalar(value: unknown): unknown {
  if (isObject(value) && typeof (value as any).numeric === "number") {
    return (value as any).numeric
  }

  return value
}

function toArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [value]
}
