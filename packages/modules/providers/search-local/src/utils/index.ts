import { SearchTypes } from "@medusajs/framework/types"
import {
  MedusaError,
  readDocumentPath,
  searchValueToBoolean,
  searchValueToNumber,
  setDocumentPath,
} from "@medusajs/framework/utils"

// Path flattening, projection and primary-key extraction live in
// @medusajs/utils so every provider collapses documents identically.
export {
  extractPrimaryKeyFilter,
  projectDocument,
} from "@medusajs/framework/utils"

/**
 * The original document, stored verbatim. Orama keeps undeclared properties
 * without indexing them, which makes reads lossless — dates come back as dates,
 * and arrays of objects keep their shape despite being collapsed for indexing.
 */
export const SOURCE_KEY = "__source"

/**
 * Suffix for the shadow copy of a tokenized field. Orama's `where` on a `string`
 * matches tokens, not whole values — `{ title: "Red shoe" }` also matches "Blue
 * shoe" — so a field that must be both searchable and exactly filterable is
 * indexed twice: `string` for matching, `enum` for filtering and faceting.
 */
export const FILTER_SUFFIX = "__filter"

export type OramaFieldType =
  | "string"
  | "string[]"
  | "enum"
  | "enum[]"
  | "number"
  | "number[]"
  | "boolean"
  | "boolean[]"
  | "geopoint"

export type PlannedField = {
  path: string
  type: OramaFieldType
  is_array: boolean
  is_date: boolean
  field: SearchTypes.SearchFieldDefinition
  filter_path?: string
  filter_type?: "enum" | "enum[]"
}

export type IndexPlan = {
  schema: Record<string, OramaFieldType>
  fields: Map<string, PlannedField>
  searchable: string[]
  primary_key: string
}

// A function declaration rather than an arrow, so TypeScript treats a call as
// unreachable-after and narrows the surrounding union types.
function fail(message: string): never {
  throw new MedusaError(MedusaError.Types.NOT_ALLOWED, message)
}

function isSearchable(field: SearchTypes.SearchFieldDefinition): boolean {
  return field.searchable === true || typeof field.searchable === "object"
}

function isFacetable(field: SearchTypes.SearchFieldDefinition): boolean {
  return field.facetable === true || typeof field.facetable === "object"
}

function scalarType(
  field: SearchTypes.SearchFieldDefinition,
  isPrimaryKey: boolean
): "string" | "enum" | "number" | "boolean" | "geopoint" {
  if (isPrimaryKey) {
    // Orama derives the document id from `id`, which has to be a string.
    return "string"
  }

  switch (field.type) {
    case "text":
      return "string"
    case "keyword":
      // Orama only sorts `string`, `number` and `boolean`, so a sortable
      // keyword has to be tokenized and rely on the shadow for filtering.
      return isSearchable(field) || field.sortable ? "string" : "enum"
    case "integer":
    case "float":
    case "date":
      return "number"
    case "boolean":
      return "boolean"
    case "geo":
      return "geopoint"
    default:
      return fail(
        `The local search provider does not support fields of type "${field.type}"`
      )
  }
}

/**
 * Refuses a definition Orama cannot honour, scoped to what makes the index
 * unbuildable or silently wrong. A per-query feature like a stats facet is refused
 * when *requested*, so declaring it does not make the field unusable.
 */
export function assertIndexSupported(
  definition: SearchTypes.ResolvedSearchIndexDefinition
): void {
  const walk = (
    group: Record<string, SearchTypes.SearchFieldDefinition>,
    prefix: string
  ) => {
    for (const [name, field] of Object.entries(group)) {
      const path = prefix ? `${prefix}.${name}` : name

      if (field.correlated) {
        fail(
          `The local search provider cannot correlate predicates per element, so "${path}" cannot set "correlated". Arrays of objects are collapsed to per-leaf arrays.`
        )
      }

      if (field.type === "vector") {
        fail(
          `The local search provider does not support vector fields ("${path}")`
        )
      }

      if (field.type === "object" && field.fields) {
        walk(field.fields, path)
      }
    }
  }

  walk(definition.fields, "")
}

/**
 * Refuses a query Orama cannot honour. The dangerous ones are where it would
 * answer *almost* correctly: a single `sortBy` silently drops extra sort keys, and
 * missing highlighting or cursors would come back silently absent.
 */
export function assertQuerySupported(
  query: SearchTypes.ProviderSearchQuery
): void {
  const sortFields = Object.keys(query.pagination?.order ?? {}).filter(
    (key) => key !== "_score"
  )

  if (sortFields.length > 1) {
    fail(
      `The local search provider sorts on one field at a time; got ${
        sortFields.length
      } (${sortFields.join(", ")})`
    )
  }

  const options = query.search_options ?? {}

  if (options.highlight) {
    fail("The local search provider does not support highlighting")
  }

  if (options.vector) {
    fail("The local search provider does not support vector search")
  }

  if (options.locales?.length) {
    fail(
      "The local search provider does not support query-time locales; matching is language-agnostic"
    )
  }

  if (query.pagination?.cursor !== undefined) {
    fail("The local search provider does not support cursor pagination")
  }
}

/**
 * Flattens a definition into the flat, dot-keyed schema Orama wants.
 *
 * Dotted schema keys resolve against nested documents and, unlike a nested
 * schema, remain sortable — so nesting is flattened here rather than mirrored.
 */
export function buildIndexPlan(
  definition: SearchTypes.ResolvedSearchIndexDefinition
): IndexPlan {
  const schema: Record<string, OramaFieldType> = {}
  const fields = new Map<string, PlannedField>()
  const searchable: string[] = []

  const walk = (
    group: Record<string, SearchTypes.SearchFieldDefinition>,
    prefix: string,
    inArray: boolean
  ) => {
    for (const [name, field] of Object.entries(group)) {
      const path = prefix ? `${prefix}.${name}` : name

      const isArray = inArray || field.array === true

      if (field.type === "object") {
        if (field.fields) {
          walk(field.fields, path, isArray)
        }
        continue
      }

      const isPrimaryKey = path === definition.primary_key
      const scalar = scalarType(field, isPrimaryKey)

      const type = (
        isArray && scalar !== "geopoint" ? `${scalar}[]` : scalar
      ) as OramaFieldType

      const planned: PlannedField = {
        path,
        type,
        is_array: isArray,
        is_date: field.type === "date",
        field,
      }

      // Tokenized fields cannot be filtered or faceted exactly, so mirror them.
      const tokenized = type === "string" || type === "string[]"
      if (tokenized && (field.filterable || isFacetable(field))) {
        planned.filter_path = `${path}${FILTER_SUFFIX}`
        planned.filter_type = isArray ? "enum[]" : "enum"
        schema[planned.filter_path] = planned.filter_type
      }

      schema[path] = type
      fields.set(path, planned)

      if (isSearchable(field)) {
        searchable.push(path)
      }
    }
  }

  walk(definition.fields, "", false)

  return {
    schema,
    fields,
    searchable,
    primary_key: definition.primary_key,
  }
}

/**
 * Whether two plans describe the same physical index. Compared on the built schema
 * rather than the definition hash, so a change that never reaches Orama — a
 * settings-only edit — does not force a needless rebuild.
 */
export function sameSchema(a: IndexPlan, b: IndexPlan): boolean {
  const keysA = Object.keys(a.schema).sort()
  const keysB = Object.keys(b.schema).sort()

  if (keysA.length !== keysB.length || a.primary_key !== b.primary_key) {
    return false
  }

  if (
    keysA.some((key, i) => key !== keysB[i] || a.schema[key] !== b.schema[key])
  ) {
    return false
  }

  // Searchability is baked into the index at creation, so it counts too.
  const searchableA = [...a.searchable].sort()
  const searchableB = [...b.searchable].sort()

  return (
    searchableA.length === searchableB.length &&
    searchableA.every((path, i) => path === searchableB[i])
  )
}

/* -------------------------------- documents ------------------------------- */

function coerce(value: unknown, planned: PlannedField): unknown {
  const base = planned.type.replace("[]", "")

  switch (base) {
    case "number":
      return searchValueToNumber(value, planned.is_date)
    case "boolean":
      return searchValueToBoolean(value)
    case "string":
    case "enum":
      return typeof value === "string" ? value : String(value)
    default:
      return value
  }
}

// Projects onto the indexed schema, collapsing arrays of objects into per-leaf
// arrays, and stashes the original under `__source`.
export function toOramaDocument(
  document: SearchTypes.SearchDocument,
  plan: IndexPlan
): Record<string, unknown> {
  const target: Record<string, any> = {}

  for (const planned of plan.fields.values()) {
    const values = readDocumentPath(document, planned.path.split("."))
      .map((value) => coerce(value, planned))
      .filter((value) => value !== undefined)

    if (!values.length) {
      continue
    }

    const value = planned.is_array ? values : values[0]
    setDocumentPath(target, planned.path, value)

    if (planned.filter_path) {
      setDocumentPath(target, planned.filter_path, value)
    }
  }

  const primaryKey = document[plan.primary_key]

  if (primaryKey === undefined || primaryKey === null || primaryKey === "") {
    fail(
      `A document written to the local search provider is missing its primary key "${plan.primary_key}"`
    )
  }

  // Orama takes the document id from `id`.
  target.id = String(primaryKey)
  target[SOURCE_KEY] = document

  return target
}

/* --------------------------------- filters -------------------------------- */

type OramaOperation = Record<string, unknown> | string | number | boolean

function resolveFilterTarget(
  path: string,
  plan: IndexPlan
): { key: string; planned: PlannedField; type: OramaFieldType } {
  const planned = plan.fields.get(path)

  if (!planned) {
    fail(`Unknown filter field "${path}" on the local search provider`)
  }

  const key = planned.filter_path ?? planned.path
  const type = planned.filter_type ?? planned.type

  return { key, planned, type }
}

// Orama accepts one operation per field, so an operator map has to collapse to
// one. `$gte` + `$lte` becomes `between`; other combinations are rejected.
function toOramaOperation(
  path: string,
  raw: unknown,
  planned: PlannedField,
  type: OramaFieldType
): OramaOperation {
  const isArrayType = type.endsWith("[]")
  const base = type.replace("[]", "")
  const cast = (value: unknown) => coerce(value, planned)

  // Shorthand: a bare value or list of values.
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
    const values = (Array.isArray(raw) ? raw : [raw]).map(cast)

    if (base === "boolean") {
      return values[0] as boolean
    }
    if (base === "number") {
      if (values.length > 1) {
        fail(
          `The local search provider cannot match a numeric field ("${path}") against several values`
        )
      }
      return { eq: values[0] }
    }
    if (isArrayType) {
      return { containsAny: values }
    }
    return values.length > 1 ? { in: values } : { eq: values[0] }
  }

  const operators = raw as Record<string, unknown>
  const keys = Object.keys(operators).filter((key) => key.startsWith("$"))

  const unsupported = (reason: string) =>
    fail(
      `The local search provider cannot apply ${keys.join(
        " + "
      )} to "${path}": ${reason}`
    )

  const has = (key: string) => keys.includes(key)

  if (keys.length === 2 && has("$gte") && has("$lte")) {
    if (base !== "number") {
      unsupported("range filters need a numeric or date field")
    }
    return {
      between: [cast(operators.$gte), cast(operators.$lte)],
    }
  }

  if (keys.length !== 1) {
    unsupported(
      "the local search provider accepts one operation per field; only $gte with $lte can be combined"
    )
  }

  const [operator] = keys
  const value = operators[operator]
  const values = (Array.isArray(value) ? value : [value]).map(cast)

  switch (operator) {
    case "$eq":
      if (base === "boolean") {
        return values[0] as boolean
      }
      if (base === "number") {
        return { eq: values[0] }
      }
      return isArrayType ? { containsAny: values } : { eq: values[0] }

    case "$ne":
      if (base === "number" || base === "boolean") {
        unsupported("negation is not supported on numeric or boolean fields")
      }
      if (isArrayType) {
        // Supported on scalar fields; array fields have no negated containment.
        unsupported("$ne is not supported on array fields")
      }
      return { nin: values }

    case "$in":
      if (base === "number" || base === "boolean") {
        unsupported("numeric and boolean fields match one value at a time")
      }
      return isArrayType ? { containsAny: values } : { in: values }

    case "$nin":
      if (base === "number" || base === "boolean") {
        unsupported("negation is not supported on numeric or boolean fields")
      }
      if (isArrayType) {
        // Supported on scalar fields; array fields have no negated containment.
        unsupported("$nin is not supported on array fields")
      }
      return { nin: values }

    case "$gt":
    case "$gte":
    case "$lt":
    case "$lte":
      if (base !== "number") {
        unsupported("comparisons need a numeric or date field")
      }
      return { [operator.slice(1)]: values[0] }

    case "$contains":
      if (!isArrayType) {
        unsupported("$contains needs an array field")
      }
      return { containsAll: values }

    case "$overlaps":
      if (!isArrayType) {
        unsupported("$overlaps needs an array field")
      }
      return { containsAny: values }

    default:
      return unsupported("unsupported operator") as never
  }
}

// Orama's `where` is a flat conjunction: `$and` branches merge, `$or`/`$not` are
// rejected.
export function toOramaWhere(
  filters: SearchTypes.SearchFilters | undefined,
  plan: IndexPlan
): Record<string, OramaOperation> | undefined {
  if (!filters) {
    return undefined
  }

  const where: Record<string, OramaOperation> = {}

  const merge = (branch: SearchTypes.SearchFilters) => {
    for (const [key, value] of Object.entries(branch)) {
      if (key === "$and") {
        for (const nested of (value ?? []) as SearchTypes.SearchFilters[]) {
          merge(nested)
        }
        continue
      }

      if (key === "$or" || key === "$not") {
        // Orama's where clause is a flat conjunction.
        fail(
          `The local search provider cannot express ${key} in filters; only conjunctions ($and) are supported`
        )
      }

      const { key: target, planned, type } = resolveFilterTarget(key, plan)

      if (target in where) {
        fail(
          `The local search provider cannot apply two conditions to "${key}" in one query`
        )
      }

      where[target] = toOramaOperation(key, value, planned, type)
    }
  }

  merge(filters)

  return Object.keys(where).length ? where : undefined
}

/* --------------------------------- facets --------------------------------- */

const RANGE_MIN = Number.MIN_SAFE_INTEGER
const RANGE_MAX = Number.MAX_SAFE_INTEGER

export type FacetPlan = {
  orama: Record<string, unknown>
  // Orama keys value facets by the schema path and range facets by "from-to",
  // so both need mapping back to what the caller asked for.
  byOramaKey: Map<
    string,
    {
      field: string
      request: SearchTypes.SearchFacetRequest
      ranges?: Map<string, { key: string; from?: number; to?: number }>
    }
  >
}

export function toOramaFacets(
  requests: SearchTypes.SearchFacetRequest[] | undefined,
  plan: IndexPlan
): FacetPlan | undefined {
  if (!requests?.length) {
    return undefined
  }

  const orama: Record<string, unknown> = {}
  const byOramaKey: FacetPlan["byOramaKey"] = new Map()

  for (const request of requests) {
    const { key, type } = resolveFilterTarget(request.field, plan)

    if (request.type === "stats") {
      fail(`The local search provider does not support "stats" facets`)
    }

    if (request.type === "range") {
      const ranges = new Map<
        string,
        { key: string; from?: number; to?: number }
      >()

      orama[key] = {
        ranges: request.ranges.map((range) => {
          const from = range.from === undefined ? RANGE_MIN : Number(range.from)
          const to = range.to === undefined ? RANGE_MAX : Number(range.to)

          ranges.set(`${from}-${to}`, {
            key: range.key ?? `${range.from ?? "*"}-${range.to ?? "*"}`,
            from: range.from === undefined ? undefined : from,
            to: range.to === undefined ? undefined : to,
          })

          return { from, to }
        }),
      }

      byOramaKey.set(key, { field: request.field, request, ranges })
      continue
    }

    orama[key] =
      type.replace("[]", "") === "boolean"
        ? { true: true, false: true }
        : {
            limit: request.limit ?? 10,
            sort: request.sort === "alpha" ? "ASC" : "DESC",
          }

    byOramaKey.set(key, { field: request.field, request })
  }

  return { orama, byOramaKey }
}

export function fromOramaFacets(
  facets: Record<string, { count: number; values: Record<string, number> }>,
  plan: FacetPlan
): Record<string, SearchTypes.SearchFacetResult> {
  const result: Record<string, SearchTypes.SearchFacetResult> = {}

  for (const [oramaKey, mapping] of plan.byOramaKey) {
    const raw = facets?.[oramaKey]

    if (!raw) {
      continue
    }

    if (mapping.ranges) {
      result[mapping.field] = {
        type: "range",
        ranges: [...mapping.ranges.entries()].map(([oramaRangeKey, range]) => ({
          key: range.key,
          from: range.from,
          to: range.to,
          count: raw.values[oramaRangeKey] ?? 0,
        })),
      }
      continue
    }

    result[mapping.field] = {
      type: "value",
      values: Object.entries(raw.values).map(([value, count]) => ({
        value,
        count,
      })),
    }
  }

  return result
}
