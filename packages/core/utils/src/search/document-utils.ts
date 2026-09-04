import { SearchTypes } from "@medusajs/types"

/**
 * Document projection helpers shared by search providers, so that path
 * flattening, value coercion and primary-key handling behave identically no
 * matter which engine an index definition runs on.
 */

/**
 * Walks a dotted path, flattening through arrays encountered on the way —
 * arrays of objects collapse to per-leaf arrays, which keeps index
 * definitions portable across providers.
 */
export function readDocumentPath(
  source: unknown,
  segments: string[]
): unknown[] {
  let current: unknown[] = [source]

  for (const segment of segments) {
    const next: unknown[] = []

    for (const value of current) {
      if (value === null || value === undefined) {
        continue
      }
      if (Array.isArray(value)) {
        for (const entry of value) {
          const resolved = (entry as Record<string, unknown>)?.[segment]
          if (resolved !== undefined) {
            next.push(resolved)
          }
        }
        continue
      }
      const resolved = (value as Record<string, unknown>)?.[segment]
      if (resolved !== undefined) {
        next.push(resolved)
      }
    }

    current = next
  }

  return current.flat(Infinity).filter((v) => v !== null && v !== undefined)
}

/** Writes a value at a dotted path, creating intermediate objects. */
export function setDocumentPath(
  target: Record<string, any>,
  path: string,
  value: unknown
): void {
  const segments = path.split(".")
  let cursor = target

  for (const segment of segments.slice(0, -1)) {
    cursor[segment] ??= {}
    cursor = cursor[segment]
  }

  cursor[segments[segments.length - 1]] = value
}

export function searchValueToNumber(
  value: unknown,
  isDate: boolean
): number | undefined {
  const num = isDate
    ? value instanceof Date
      ? value.getTime()
      : Date.parse(String(value))
    : typeof value === "number"
    ? value
    : Number(value)

  return Number.isNaN(num) ? undefined : num
}

export function searchValueToBoolean(value: unknown): boolean {
  if (typeof value === "boolean") {
    return value
  }
  // `Boolean("false")` is `true`, so string forms are read by content.
  if (value === "true" || value === "false") {
    return value === "true"
  }
  return Boolean(value)
}

/**
 * Narrows a source document to the requested dotted paths, keeping the shape
 * of intermediate objects and arrays.
 */
export function projectDocument(
  source: Record<string, unknown>,
  paths: string[]
): Record<string, unknown> {
  const picked: Record<string, any> = {}

  for (const path of paths) {
    const segments = path.split(".")
    const [head, ...rest] = segments
    const value = source?.[head]

    if (value === undefined) {
      continue
    }

    if (!rest.length) {
      picked[head] = value
      continue
    }

    // Recurse so that `variants.title` keeps the shape of `variants`.
    if (Array.isArray(value)) {
      const existing = Array.isArray(picked[head]) ? picked[head] : []
      picked[head] = value.map((entry, i) =>
        Object.assign(
          existing[i] ?? {},
          projectDocument(entry as Record<string, unknown>, [rest.join(".")])
        )
      )
    } else if (value && typeof value === "object") {
      picked[head] = Object.assign(
        picked[head] ?? {},
        projectDocument(value as Record<string, unknown>, [rest.join(".")])
      )
    }
  }

  return picked
}

/**
 * Recognises a filter that is nothing but primary-key membership, so a delete
 * can go straight to the id lookup instead of compiling the filter tree.
 */
export function extractPrimaryKeyFilter(
  filters: SearchTypes.SearchFilters,
  plan: { primary_key: string }
): string[] | undefined {
  const keys = Object.keys(filters)

  if (keys.length !== 1 || keys[0] !== plan.primary_key) {
    return undefined
  }

  const predicate = filters[plan.primary_key]

  const asIds = (value: unknown): string[] | undefined => {
    const values = Array.isArray(value) ? value : [value]
    return values.every((v) => typeof v === "string")
      ? (values as string[])
      : undefined
  }

  if (predicate === null || typeof predicate !== "object") {
    return asIds(predicate)
  }

  if (Array.isArray(predicate)) {
    return asIds(predicate)
  }

  const operators = Object.keys(predicate)

  if (operators.length !== 1) {
    return undefined
  }

  if (operators[0] === "$eq" || operators[0] === "$in") {
    return asIds((predicate as Record<string, unknown>)[operators[0]])
  }

  return undefined
}
