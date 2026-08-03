import { SearchTypes } from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"
import { createHash } from "crypto"

// Lifecycle of an index, as persisted on `SearchIndex.status`.
export enum SearchIndexState {
  // Known to the module, not yet created on the engine.
  PENDING = "pending",
  // Being seeded. For a `swap` reindex this is the shadow index.
  BUILDING = "building",
  READY = "ready",
  ERROR = "error",
}

// Lifecycle of one seed run, as persisted on `SearchIndexSync.status`.
export enum SearchSyncStatus {
  // Recorded, not yet picked up by a worker.
  PENDING = "pending",
  PROCESSING = "processing",
  DONE = "done",
  // Stopped before finishing. `last_key` holds the resume point.
  FAILED = "failed",
  // Superseded by a newer run, or cancelled explicitly.
  CANCELED = "canceled",
}

export const DEFAULT_TAKE = 20
export const DEFAULT_REINDEX_BATCH_SIZE = 100

/* ----------------------------- field traversal ---------------------------- */

export type FlatSearchField = {
  path: string
  field: SearchTypes.SearchFieldDefinition
  // True when any ancestor is an array of objects, so values arrive as a list
  // and predicates on them cannot correlate per element.
  in_array: boolean
}

// Walks fields into dotted paths. Object fields yield themselves and their
// descendants, so `retrievable` can be asked about either.
export function flattenFields(
  fields: Record<string, SearchTypes.SearchFieldDefinition>,
  prefix = "",
  inArray = false
): FlatSearchField[] {
  const flat: FlatSearchField[] = []

  for (const [name, field] of Object.entries(fields)) {
    const path = prefix ? `${prefix}.${name}` : name
    flat.push({ path, field, in_array: inArray })

    if (field.type === "object" && field.fields) {
      flat.push(
        ...flattenFields(field.fields, path, inArray || field.array === true)
      )
    }
  }

  return flat
}

export function buildFieldMap(
  definition: Pick<SearchTypes.SearchIndexDefinition, "fields">
): Map<string, FlatSearchField> {
  return new Map(flattenFields(definition.fields).map((f) => [f.path, f]))
}

export function isSearchable(
  field: SearchTypes.SearchFieldDefinition
): boolean {
  return field.searchable === true || typeof field.searchable === "object"
}

export function isFacetable(
  field: SearchTypes.SearchFieldDefinition,
  kind: SearchTypes.SearchFacetKind
): boolean {
  if (field.facetable === true) {
    return defaultFacetKinds(field).includes(kind)
  }
  if (typeof field.facetable === "object") {
    return (field.facetable.types ?? defaultFacetKinds(field)).includes(kind)
  }
  return false
}

// `stats` is opt-in: it is the least widely supported facet kind, so implying
// it would make numeric fields unusable on providers that lack aggregations.
function defaultFacetKinds(
  field: SearchTypes.SearchFieldDefinition
): SearchTypes.SearchFacetKind[] {
  switch (field.type) {
    case "integer":
    case "float":
    case "date":
      return ["range"]
    default:
      return ["value"]
  }
}

export function isRetrievable(
  field: SearchTypes.SearchFieldDefinition
): boolean {
  return field.retrievable !== false
}

/* ------------------------------ definitions ------------------------------- */

// Key order must not change the hash, so object keys are emitted sorted.
function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value) ?? "null"
  }
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`
  }
  const entries = Object.entries(value as Record<string, unknown>)
    .filter(([, v]) => v !== undefined)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([k, v]) => `${JSON.stringify(k)}:${stableStringify(v)}`)
  return `{${entries.join(",")}}`
}

// Stable hash over what affects the physical index. `events`, `consume` and
// `seed` are excluded: how documents are produced is not the index' shape.
export function buildDefinitionHash(
  definition: Pick<SearchTypes.SearchIndexDefinition, "fields" | "settings">
): string {
  return createHash("sha256")
    .update(
      stableStringify({
        fields: definition.fields,
        settings: definition.settings ?? {},
      })
    )
    .digest("hex")
    .slice(0, 32)
}

// Accounts for `index_prefix` and, for a shadow index, the schema suffix.
export function buildPhysicalIndexName({
  name,
  prefix,
  suffix,
}: {
  name: string
  prefix?: string
  suffix?: string
}): string {
  return [prefix, name, suffix].filter(Boolean).join("_")
}

// Applies defaults and binds a definition to a provider.
export function resolveIndexDefinition({
  definition,
  default_provider,
  index_prefix,
}: {
  definition: SearchTypes.SearchIndexDefinition
  default_provider: string
  index_prefix?: string
}): SearchTypes.ResolvedSearchIndexDefinition {
  if (!definition.name) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "A search index definition requires a name"
    )
  }

  if (!definition.fields?.[definition.primary_key ?? "id"]) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Search index "${definition.name}" must declare its primary key field "${
        definition.primary_key ?? "id"
      }"`
    )
  }

  const settings = { ...(definition.settings ?? {}) }

  settings.default_search_attributes ??= flattenFields(definition.fields)
    .filter(({ field }) => isSearchable(field))
    .map(({ path }) => path)

  return {
    ...definition,
    primary_key: definition.primary_key ?? "id",
    provider: definition.provider ?? default_provider,
    settings,
    definition_hash: buildDefinitionHash(definition),
    physical_name: buildPhysicalIndexName({
      name: definition.name,
      prefix: index_prefix,
    }),
  }
}

// Splits requested fields into what the engine can return and what needs
// hydrating through `query.graph`. The primary key lands in both halves.
export function splitRequestedFields({
  index,
  fields,
}: {
  index: SearchTypes.ResolvedSearchIndexDefinition
  fields: string[]
}): { index_fields: string[]; graph_fields: string[] } {
  const fieldMap = buildFieldMap(index)
  const indexFields = new Set<string>([index.primary_key])
  const graphFields = new Set<string>([index.primary_key])

  for (const requested of fields) {
    const known = fieldMap.get(requested)

    if (known && isRetrievable(known.field)) {
      indexFields.add(requested)
    } else {
      graphFields.add(requested)
    }
  }

  return {
    index_fields: [...indexFields],
    graph_fields: [...graphFields],
  }
}

/* --------------------------------- queries -------------------------------- */

// Lifts `q` out of the filters, applies pagination defaults, expands shorthand
// facets, and resolves `attributes_to_search_on` against the index' defaults.
export function normalizeSearchQuery({
  query,
  index,
}: {
  query: SearchTypes.SearchQuery
  index: SearchTypes.ResolvedSearchIndexDefinition
}): SearchTypes.ProviderSearchQuery {
  const filters = { ...(query.filters ?? {}) } as Record<string, unknown>

  // `q` travels with the filters so that a `query.graph` call converts to a
  // `query.search` one unchanged, but it is not a field — lift it out before the
  // rest is compiled into a provider filter DSL.
  const q = filters.q as string | undefined
  delete filters.q

  const searchOptions = { ...(query.search_options ?? {}) }

  searchOptions.facets = searchOptions.facets?.map((facet) =>
    typeof facet === "string" ? { field: facet, type: "value" as const } : facet
  )

  searchOptions.attributes_to_search_on ??=
    index.settings.default_search_attributes

  const { index_fields } = splitRequestedFields({
    index,
    fields: query.fields ?? [],
  })

  return {
    index,
    attributes_to_retrieve: index_fields,
    q,
    filters: Object.keys(filters).length
      ? (filters as SearchTypes.SearchFilters)
      : undefined,
    pagination: {
      skip: query.pagination?.skip ?? 0,
      take: query.pagination?.take ?? DEFAULT_TAKE,
      order: query.pagination?.order,
      cursor: query.pagination?.cursor,
    },
    search_options: searchOptions,
  }
}

// Drops every predicate on `field`, including inside `$and` branches.
function withoutFieldFilter(
  filters: SearchTypes.SearchFilters | undefined,
  field: string
): SearchTypes.SearchFilters | undefined {
  if (!filters) {
    return undefined
  }

  const next: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(filters)) {
    if (key === field) {
      continue
    }
    if (key === "$and" && Array.isArray(value)) {
      const branches = value
        .map((branch) => withoutFieldFilter(branch, field))
        .filter((branch) => branch && Object.keys(branch).length)
      if (branches.length) {
        next.$and = branches
      }
      continue
    }
    next[key] = value
  }

  return Object.keys(next).length
    ? (next as SearchTypes.SearchFilters)
    : undefined
}

/**
 * The base query plus one per faceted field with that field's own filter dropped.
 * Every engine reviewed needs a query per facet, so the fan-out lives here rather
 * than in each provider. `disjunctive_facets` is stripped from what is handed on —
 * a provider should never see an option it is not expected to act on.
 */
export function buildDisjunctiveFacetQueries(
  query: SearchTypes.ProviderSearchQuery
): {
  base: SearchTypes.ProviderSearchQuery
  per_facet: Map<string, SearchTypes.ProviderSearchQuery>
} {
  const perFacet = new Map<string, SearchTypes.ProviderSearchQuery>()
  const facets = (query.search_options?.facets ??
    []) as SearchTypes.SearchFacetRequest[]

  const { disjunctive_facets: _, ...searchOptions } = query.search_options ?? {}
  const base: SearchTypes.ProviderSearchQuery = {
    ...query,
    search_options: searchOptions,
  }

  for (const facet of facets) {
    const relaxed = withoutFieldFilter(query.filters, facet.field)

    // Nothing filters this field, so the base result's facet is already right.
    if (stableStringify(relaxed) === stableStringify(query.filters)) {
      continue
    }

    perFacet.set(facet.field, {
      ...base,
      filters: relaxed,
      // Only the facet is wanted; skip the hits.
      pagination: { ...query.pagination, skip: 0, take: 0 },
      search_options: { ...searchOptions, facets: [facet] },
    })
  }

  return { base, per_facet: perFacet }
}

export function mergeDisjunctiveFacetResults({
  base,
  per_facet,
}: {
  base: SearchTypes.SearchResult
  per_facet: Map<string, SearchTypes.SearchResult>
}): SearchTypes.SearchResult {
  if (!per_facet.size) {
    return base
  }

  const facets = { ...(base.facets ?? {}) }

  for (const [field, result] of per_facet) {
    const relaxed = result.facets?.[field]
    if (relaxed) {
      facets[field] = relaxed
    }
  }

  return { ...base, facets }
}

/* -------------------------------- validation ------------------------------ */

function collectFilterPaths(
  filters: SearchTypes.SearchFilters,
  into: Set<string> = new Set()
): Set<string> {
  for (const [key, value] of Object.entries(filters)) {
    if (key === "$and" || key === "$or") {
      for (const branch of (value ?? []) as SearchTypes.SearchFilters[]) {
        collectFilterPaths(branch, into)
      }
    } else if (key === "$not") {
      collectFilterPaths(value as SearchTypes.SearchFilters, into)
    } else {
      into.add(key)
    }
  }
  return into
}

/**
 * Checks a definition is internally coherent regardless of provider — a field
 * asking for something that makes no sense for its type. Whether a *particular*
 * provider can serve it is settled in `upsertIndex`, which runs for every
 * definition at startup, so it still fails at boot but with a better error.
 */
export function validateIndexDefinition({
  definition,
}: {
  definition: SearchTypes.ResolvedSearchIndexDefinition
}): void {
  const fail = (message: string) => {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Invalid search index definition "${definition.name}": ${message}`
    )
  }

  for (const { path, field } of flattenFields(definition.fields)) {
    if (field.correlated && !(field.type === "object" && field.array)) {
      fail(
        `field "${path}" sets "correlated", which only applies to an array of objects`
      )
    }

    if (field.type === "vector" && !field.dimensions) {
      fail(`vector field "${path}" must declare its "dimensions"`)
    }

    if (field.type === "object" && !field.fields) {
      fail(`object field "${path}" must declare its "fields"`)
    }

    const numeric = ["integer", "float", "date"].includes(field.type)

    if (isFacetable(field, "range") && !numeric) {
      fail(`field "${path}" is not numeric, so it cannot have range facets`)
    }

    if (isFacetable(field, "stats") && !numeric) {
      fail(`field "${path}" is not numeric, so it cannot have stats facets`)
    }

    if (isSearchable(field) && !["text", "keyword"].includes(field.type)) {
      fail(
        `field "${path}" is of type "${field.type}", which cannot be searched as free text`
      )
    }
  }
}

// Checks a field is declared for the use the query puts it to. Engines reject
// these too, but with errors that do not name the definition to fix.
export function validateFieldUsage({
  index,
  query,
}: {
  index: SearchTypes.ResolvedSearchIndexDefinition
  // Accepts a normalized query too, and must run on one: `filters.q` is sugar
  // for the top-level `q` and is only lifted out during normalization.
  query: Pick<
    SearchTypes.SearchQuery,
    "filters" | "pagination" | "search_options"
  >
}): void {
  const fieldMap = buildFieldMap(index)

  const fail = (message: string) => {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, message)
  }

  const lookup = (path: string, usage: string) => {
    const known = fieldMap.get(path)
    if (!known) {
      fail(
        `Unknown field "${path}" used in ${usage} on search index "${index.name}"`
      )
    }
    return known!.field
  }

  if (query.filters) {
    for (const path of collectFilterPaths(query.filters)) {
      const field = lookup(path, "filters")
      if (!field.filterable) {
        fail(
          `Field "${path}" is not filterable on search index "${index.name}"`
        )
      }
    }
  }

  for (const path of Object.keys(query.pagination?.order ?? {})) {
    if (path === "_score") {
      continue
    }
    const field = lookup(path, "pagination.order")
    if (!field.sortable) {
      fail(`Field "${path}" is not sortable on search index "${index.name}"`)
    }
  }

  for (const facet of query.search_options?.facets ?? []) {
    const request =
      typeof facet === "string"
        ? { field: facet, type: "value" as const }
        : facet
    const field = lookup(request.field, "search_options.facets")
    const kind = request.type ?? "value"
    if (!isFacetable(field, kind)) {
      fail(
        `Field "${request.field}" does not support "${kind}" facets on search index "${index.name}"`
      )
    }
  }

  for (const path of query.search_options?.attributes_to_search_on ?? []) {
    const field = lookup(path, "search_options.attributes_to_search_on")
    if (!isSearchable(field)) {
      fail(`Field "${path}" is not searchable on search index "${index.name}"`)
    }
  }

  if (query.search_options?.distinct) {
    lookup(query.search_options.distinct, "search_options.distinct")
  }
}

export { stableStringify }

/* -------------------------------- lookups --------------------------------- */

export function retrieveIndexDefinition(
  indexes: Record<string, SearchTypes.ResolvedSearchIndexDefinition>,
  name: string
): SearchTypes.ResolvedSearchIndexDefinition {
  const definition = indexes[name]

  if (!definition) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `No search index registered for "${name}". Registered indexes: ${
        Object.keys(indexes).join(", ") || "(none)"
      }`
    )
  }

  return definition
}

// A rejected write is an error, not something to wait on. Anything else comes
// back untouched, for the caller to block on or not.
export function assertTaskAccepted(
  task: SearchTypes.SearchTask,
  index: string
): SearchTypes.SearchTask {
  if (task.status === "failed") {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      `Search write failed on index "${index}": ${
        task.error?.message ?? "unknown error"
      }`
    )
  }

  return task
}
