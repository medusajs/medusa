import { SearchTypes } from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"
import { SearchIndexes } from "@types"
import { createHash } from "crypto"

export enum SearchIndexState {
  PENDING = "pending",
  BUILDING = "building",
  READY = "ready",
  ERROR = "error",
}

export enum SearchSyncStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  DONE = "done",
  FAILED = "failed",
  CANCELED = "canceled",
}

const DEFAULT_TAKE = 20
export const DEFAULT_REINDEX_BATCH_SIZE = 100

/* ----------------------------- field traversal ---------------------------- */

export type FlatSearchField = {
  path: string
  field: SearchTypes.SearchFieldDefinition
}

// Walks fields into dotted paths. Object fields yield themselves and their
// descendants, so `retrievable` can be asked about either.
export function flattenFields(
  fields: Record<string, SearchTypes.SearchFieldDefinition>,
  prefix = ""
): FlatSearchField[] {
  const flat: FlatSearchField[] = []

  for (const [name, field] of Object.entries(fields)) {
    const path = prefix ? `${prefix}.${name}` : name
    flat.push({ path, field })

    if (field.type === "object" && field.fields) {
      flat.push(...flattenFields(field.fields, path))
    }
  }

  return flat
}

function buildFieldMap(
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

/**
 * The dotted paths an index can hand back on hits. Object containers are
 * excluded — only their declared leaves are stored, so returning the container
 * would silently hand back a partial object.
 */
export function listRetrievablePaths(
  fields: Record<string, SearchTypes.SearchFieldDefinition>
): string[] {
  return flattenFields(fields)
    .filter(
      ({ field }) =>
        field.type !== "object" &&
        field.retrievable !== false &&
        // Engine-embedded vectors are not stored under their own path —
        // the source field carries the embedding — so they cannot be
        // projected back onto hits.
        !field.embed
    )
    .map(({ path }) => path)
}

/**
 * Leaf fields the index stores, with the capabilities declared on each. Object
 * containers are omitted — only their leaves are indexed.
 */
export function listIndexedFields(
  fields: Record<string, SearchTypes.SearchFieldDefinition>
): SearchTypes.SearchIndexFieldInfo[] {
  return flattenFields(fields)
    .filter(({ field }) => field.type !== "object")
    .map(({ path, field }) => ({
      name: path,
      type: field.type,
      searchable: isSearchable(field),
      filterable: !!field.filterable,
      sortable: !!field.sortable,
      facetable:
        field.facetable === true || typeof field.facetable === "object",
    }))
}

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

/**
 * Stable hash over what affects the physical index. `events`, `consume` and
 * `seed` are excluded: how documents are produced is not the index' shape.
 * `primary_key` and `physical_name` are included even though they are not
 * strictly shape, because changing either strands the index the record points
 * at — the mismatch is what makes `db:migrate` rebuild.
 */
function buildDefinitionHash(
  definition: Pick<SearchTypes.SearchIndexDefinition, "fields" | "settings"> & {
    primary_key: string
    physical_name: string
  }
): string {
  return createHash("sha256")
    .update(
      stableStringify({
        fields: definition.fields,
        settings: definition.settings ?? {},
        primary_key: definition.primary_key,
        physical_name: definition.physical_name,
      })
    )
    .digest("hex")
    .slice(0, 32)
}

// Accounts for `index_prefix` and, for a shadow index, the schema suffix.
function buildPhysicalIndexName({
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

// Lifts `q` out of the filters, applies pagination defaults, and expands
// shorthand facets. When `attributes_to_search_on` is omitted the provider
// matches on every field marked `searchable`.
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

  if (searchOptions.vector && !searchOptions.vector.field) {
    const vectorFields = flattenFields(index.fields).filter(
      ({ field }) => field.type === "vector"
    )
    if (vectorFields.length === 1) {
      searchOptions.vector = {
        ...searchOptions.vector,
        field: vectorFields[0].path,
      }
    }
  }

  return {
    index,
    // Taken as given when set: `query.search` has already dropped anything the
    // index cannot return and left only what the provider should project. A
    // direct caller that names no fields gets everything retrievable.
    attributes_to_retrieve: query.fields ?? listRetrievablePaths(index.fields),
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

// Drops every predicate on `field`, including inside `$and` / `$or` / `$not`.
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

    if ((key === "$and" || key === "$or") && Array.isArray(value)) {
      const branches = value
        .map((branch) => withoutFieldFilter(branch, field))
        .filter((branch) => branch && Object.keys(branch).length)
      if (branches.length) {
        next[key] = branches
      }
      continue
    }

    if (key === "$not") {
      const stripped = withoutFieldFilter(
        value as SearchTypes.SearchFilters,
        field
      )
      if (stripped && Object.keys(stripped).length) {
        next.$not = stripped
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

  function fail(message: string): never {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, message)
  }

  const lookup = (path: string, usage: string) => {
    const known = fieldMap.get(path)
    if (!known) {
      fail(
        `Unknown field "${path}" used in ${usage} on search index "${index.name}"`
      )
    }
    return known.field
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

  const vector = query.search_options?.vector
  if (vector) {
    if (!vector.field) {
      const vectorFields = [...fieldMap.values()].filter(
        ({ field }) => field.type === "vector"
      )
      fail(
        vectorFields.length
          ? `search_options.vector.field is required when the index has more than one vector field`
          : `search_options.vector requires a vector field on search index "${index.name}"`
      )
    }

    const field = lookup(vector.field, "search_options.vector.field")
    if (field.type !== "vector") {
      fail(
        `Field "${vector.field}" is not a vector field on search index "${index.name}"`
      )
    }

    if (vector.value && vector.query) {
      fail(
        `search_options.vector.value and search_options.vector.query are mutually exclusive`
      )
    }

    if (!vector.value && !vector.query) {
      fail(
        `search_options.vector requires either "value" (embedding) or "query" (text to embed)`
      )
    }

    if (vector.query && !field.embed) {
      fail(
        `search_options.vector.query requires vector field "${vector.field}" to declare "embed"`
      )
    }

    if (
      vector.value &&
      field.dimensions &&
      vector.value.length !== field.dimensions
    ) {
      fail(
        `Vector value for "${vector.field}" expected ${field.dimensions} dimensions, got ${vector.value.length}`
      )
    }

    if (
      vector.semantic_ratio !== undefined &&
      (vector.semantic_ratio < 0 || vector.semantic_ratio > 1)
    ) {
      fail("search_options.vector.semantic_ratio must be between 0 and 1")
    }
  }
}

/**
 * Resolves every definition once, at construction. Duplicates and incoherent
 * definitions fail here, so everything downstream can treat the result as given.
 */
export function resolveIndexDefinitions({
  definitions,
  default_provider,
  index_prefix,
}: {
  definitions: SearchTypes.SearchIndexDefinition[]
  default_provider: string
  index_prefix?: string
}): SearchIndexes {
  const resolved: SearchIndexes = new Map()

  for (const definition of definitions) {
    const primaryKey = definition.primary_key ?? "id"

    if (!definition.name) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "A search index definition requires a name"
      )
    }

    if (resolved.has(definition.name)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Duplicate search index definition for "${definition.name}"`
      )
    }

    if (!definition.fields?.[primaryKey]) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Search index "${definition.name}" must declare its primary key field "${primaryKey}"`
      )
    }

    const physicalName = buildPhysicalIndexName({
      name: definition.name,
      prefix: index_prefix,
    })

    const entry: SearchTypes.ResolvedSearchIndexDefinition = {
      ...definition,
      primary_key: primaryKey,
      provider: definition.provider ?? default_provider,
      settings: definition.settings ?? {},
      definition_hash: buildDefinitionHash({
        fields: definition.fields,
        settings: definition.settings,
        primary_key: primaryKey,
        physical_name: physicalName,
      }),
      physical_name: physicalName,
    }

    validateIndexDefinition({ definition: entry })

    resolved.set(entry.name, entry)
  }

  return resolved
}

/**
 * Checks a definition is internally coherent regardless of provider — a field
 * asking for something that makes no sense for its type. Whether a *particular*
 * provider can serve it is settled in `upsertIndex`, which runs for every
 * definition at startup, so it still fails at boot but with a better error.
 */
function validateIndexDefinition({
  definition,
}: {
  definition: SearchTypes.ResolvedSearchIndexDefinition
}): void {
  function fail(message: string): never {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Invalid search index definition "${definition.name}": ${message}`
    )
  }

  const hasEvents = !!definition.events?.length
  const hasConsume = !!definition.consume

  if (hasEvents && !hasConsume) {
    fail(`declares "events" but no "consume" to turn them into documents`)
  }

  if (hasConsume && !hasEvents) {
    fail(`declares "consume" but no "events" for it to be called on`)
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

    if (field.type === "vector" && field.array) {
      fail(`vector field "${path}" cannot be an array`)
    }

    if (field.embed) {
      if (field.type !== "vector") {
        fail(
          `field "${path}" sets "embed", which only applies to vector fields`
        )
      }
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

  const fieldMap = buildFieldMap(definition)
  for (const { path, field } of fieldMap.values()) {
    if (!field.embed) {
      continue
    }

    const source = fieldMap.get(field.embed)
    if (!source) {
      fail(`vector field "${path}" embeds unknown source "${field.embed}"`)
    }
    if (!["text", "keyword"].includes(source.field.type)) {
      fail(
        `vector field "${path}" can only embed a text or keyword field, not "${source.field.type}"`
      )
    }
  }
}

export function retrieveIndexDefinition(
  indexes: SearchIndexes,
  name: string
): SearchTypes.ResolvedSearchIndexDefinition {
  const definition = indexes.get(name)

  if (!definition) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `No search index registered for "${name}". Registered indexes: ${
        [...indexes.keys()].join(", ") || "(none)"
      }`
    )
  }

  return definition
}

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
