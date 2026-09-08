import type {
  InstantSearchFacetFilters,
  InstantSearchNumericFilters,
  SearchFilterValue,
  SearchFilters,
  SearchOperatorMap,
} from "./types"

const NUMERIC_OPERATORS = ["<=", ">=", "!=", "=", "<", ">"] as const

type NumericOperator = (typeof NUMERIC_OPERATORS)[number]

const NUMERIC_OPERATOR_TO_SEARCH: Record<
  NumericOperator,
  keyof SearchOperatorMap
> = {
  "=": "$eq",
  "!=": "$ne",
  ">": "$gt",
  ">=": "$gte",
  "<": "$lt",
  "<=": "$lte",
}

function isNumberLike(value: string): boolean {
  if (value.trim() === "") {
    return false
  }
  return !Number.isNaN(Number(value))
}

function parseScalar(value: string): SearchFilterValue {
  if (value === "true") {
    return true
  }
  if (value === "false") {
    return false
  }
  if (isNumberLike(value)) {
    return Number(value)
  }
  return value
}

function isExcludeValue(value: string): boolean {
  return value.startsWith("-") && !isNumberLike(value)
}

/**
 * Split `field:value` on the first colon so values may themselves contain colons.
 */
export function parseFacetFilter(facetFilter: string): {
  field: string
  value: string
  exclude: boolean
} {
  const separator = facetFilter.indexOf(":")
  if (separator <= 0) {
    throw new Error(
      `@medusajs/instantsearch-adapter: invalid facet filter "${facetFilter}"`
    )
  }

  const field = facetFilter.slice(0, separator)
  const rawValue = facetFilter.slice(separator + 1)
  const exclude = isExcludeValue(rawValue)

  return {
    field,
    value: exclude ? rawValue.slice(1) : rawValue,
    exclude,
  }
}

function parseNumericFilter(numericFilter: string): SearchFilters {
  for (const operator of NUMERIC_OPERATORS) {
    const index = numericFilter.indexOf(operator)
    if (index <= 0) {
      continue
    }

    const field = numericFilter.slice(0, index)
    const rawValue = numericFilter.slice(index + operator.length)
    const searchOperator = NUMERIC_OPERATOR_TO_SEARCH[operator]

    return {
      [field]: {
        [searchOperator]: parseScalar(rawValue),
      },
    }
  }

  throw new Error(
    `@medusajs/instantsearch-adapter: invalid numeric filter "${numericFilter}"`
  )
}

function orFilters(parts: SearchFilters[]): SearchFilters {
  if (parts.length === 1) {
    return parts[0]
  }
  return { $or: parts }
}

function andFilters(parts: SearchFilters[]): SearchFilters {
  if (parts.length === 1) {
    return parts[0]
  }
  return { $and: parts }
}

function sameFieldInclusions(
  items: { field: string; value: string; exclude: boolean }[]
): boolean {
  if (!items.length) {
    return false
  }
  const field = items[0].field
  return items.every((item) => item.field === field)
}

function facetGroupToFilter(group: string[]): SearchFilters {
  const parsed = group.map(parseFacetFilter)

  if (sameFieldInclusions(parsed)) {
    const field = parsed[0].field
    const included = parsed
      .filter((item) => !item.exclude)
      .map((item) => item.value)
    const excluded = parsed
      .filter((item) => item.exclude)
      .map((item) => item.value)
    const parts: SearchFilters[] = []

    if (included.length === 1) {
      parts.push({ [field]: { $eq: parseScalar(included[0]) } })
    } else if (included.length > 1) {
      parts.push({ [field]: { $in: included.map(parseScalar) } })
    }

    if (excluded.length === 1) {
      parts.push({ [field]: { $ne: parseScalar(excluded[0]) } })
    } else if (excluded.length > 1) {
      parts.push({ [field]: { $nin: excluded.map(parseScalar) } })
    }

    return andFilters(parts)
  }

  return orFilters(
    parsed.map((item) =>
      item.exclude
        ? { [item.field]: { $ne: parseScalar(item.value) } }
        : { [item.field]: { $eq: parseScalar(item.value) } }
    )
  )
}

function normalizeFilterList(
  value: InstantSearchFacetFilters | InstantSearchNumericFilters | undefined
): Array<string | string[]> {
  if (value == null || value === "") {
    return []
  }
  if (typeof value === "string") {
    return [value]
  }
  return value
}

export function adaptFacetFilters(
  facetFilters: InstantSearchFacetFilters | undefined
): SearchFilters | undefined {
  const items = normalizeFilterList(facetFilters)
  if (!items.length) {
    return undefined
  }

  const parts = items.map((item) =>
    Array.isArray(item) ? facetGroupToFilter(item) : facetGroupToFilter([item])
  )

  return andFilters(parts)
}

function mergeNumericAnd(parts: SearchFilters[]): SearchFilters {
  const merged: SearchFilters = {}
  const leftover: SearchFilters[] = []

  for (const part of parts) {
    const keys = Object.keys(part)
    if (keys.length !== 1) {
      leftover.push(part)
      continue
    }

    const field = keys[0]
    const operators = part[field]
    if (
      !operators ||
      typeof operators !== "object" ||
      Array.isArray(operators) ||
      field.startsWith("$")
    ) {
      leftover.push(part)
      continue
    }

    const current = merged[field]
    if (current && typeof current === "object" && !Array.isArray(current)) {
      merged[field] = {
        ...(current as SearchOperatorMap),
        ...(operators as SearchOperatorMap),
      }
    } else {
      merged[field] = operators
    }
  }

  if (!leftover.length) {
    return merged
  }
  if (!Object.keys(merged).length) {
    return andFilters(leftover)
  }
  return andFilters([merged, ...leftover])
}

export function adaptNumericFilters(
  numericFilters: InstantSearchNumericFilters | undefined
): SearchFilters | undefined {
  const items = normalizeFilterList(numericFilters)
  if (!items.length) {
    return undefined
  }

  const parts = items.map((item) => {
    if (Array.isArray(item)) {
      return orFilters(item.map(parseNumericFilter))
    }
    return parseNumericFilter(item)
  })

  const conjunctive = parts.filter((part) => !part.$or)
  const disjunctive = parts.filter((part) => part.$or)

  const merged: SearchFilters[] = []
  if (conjunctive.length) {
    merged.push(mergeNumericAnd(conjunctive))
  }
  merged.push(...disjunctive)

  return andFilters(merged)
}

export function mergeFiltersAnd(
  left?: SearchFilters,
  right?: SearchFilters
): SearchFilters | undefined {
  if (!left) {
    return right
  }
  if (!right) {
    return left
  }

  const { q: qLeft, ...leftRest } = left
  const { q: qRight, ...rightRest } = right
  const q = qLeft ?? qRight
  const leftHasConstraints = Object.keys(leftRest).length > 0
  const rightHasConstraints = Object.keys(rightRest).length > 0

  if (!leftHasConstraints && !rightHasConstraints) {
    return q ? { q } : undefined
  }
  if (!leftHasConstraints) {
    return q ? { ...right, q } : right
  }
  if (!rightHasConstraints) {
    return q ? { ...left, q } : left
  }

  const result: SearchFilters = {
    $and: [leftRest as SearchFilters, rightRest as SearchFilters],
  }
  if (q) {
    result.q = q
  }
  return result
}

export function withQuery(
  q: string | undefined,
  rest?: SearchFilters
): SearchFilters | undefined {
  const query = q?.trim() ? q : undefined
  if (!query) {
    return rest
  }
  if (!rest) {
    return { q: query }
  }
  return { ...rest, q: query }
}
