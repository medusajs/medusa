import { createHash } from "crypto"
import { SearchTypes } from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"

export type PostgresSearchEngine = "native" | "lakebase"

export type PostgresFieldKind =
  | "text"
  | "keyword"
  | "number"
  | "boolean"
  | "geo"
  | "vector"

export type PostgresVectorDistance = "cosine" | "l2" | "inner_product"

export type PostgresSearchEmbedder = (text: string) => Promise<number[]>

export type PlannedField = {
  path: string
  kind: PostgresFieldKind
  is_array: boolean
  is_date: boolean
  dimensions?: number
  field: SearchTypes.SearchFieldDefinition
}

export type IndexPlan = {
  fields: Map<string, PlannedField>
  searchable: string[]
  /** Vector field paths declared on the index. */
  vectors: string[]
  primary_key: string
  /**
   * Stable fingerprint of the physical schema this plan implies. Used to decide
   * whether an existing table can be reused or must be rebuilt empty.
   */
  schema_hash: string
}

export type PostgresSearchProviderOptions = {
  /**
   * Text search configuration language passed to `to_tsvector` / `plainto_tsquery`.
   * @default "english"
   */
  language?: string
  /**
   * Search engine backend.
   * - `native` — portable Postgres FTS (GIN + `ts_rank`) + `pg_trgm`. Default.
   * - `lakebase` — Neon Lakebase Search (`lakebase_text` BM25 + `lakebase_vector` ANN).
   * @default "native"
   */
  engine?: PostgresSearchEngine
  /**
   * Embeds text for `search_options.vector.query`. Required on the lakebase
   * engine when callers pass a query string instead of a pre-computed `value`.
   */
  embedder?: PostgresSearchEmbedder
  /**
   * Distance metric for `lakebase_ann` / pgvector indexes.
   * @default "cosine"
   */
  vector_distance?: PostgresVectorDistance
}

function fail(message: string): never {
  throw new MedusaError(MedusaError.Types.NOT_ALLOWED, message)
}

export function isSearchable(
  field: SearchTypes.SearchFieldDefinition
): boolean {
  return field.searchable === true || typeof field.searchable === "object"
}

export function isFacetable(
  field: SearchTypes.SearchFieldDefinition
): boolean {
  return field.facetable === true || typeof field.facetable === "object"
}

function fieldKind(
  field: SearchTypes.SearchFieldDefinition
): PostgresFieldKind {
  switch (field.type) {
    case "text":
      return "text"
    case "keyword":
      return "keyword"
    case "integer":
    case "float":
    case "date":
      return "number"
    case "boolean":
      return "boolean"
    case "geo":
      return "geo"
    case "vector":
      return "vector"
    default:
      return fail(
        `The postgres search provider does not support fields of type "${field.type}"`
      )
  }
}

/**
 * Refuses a definition this engine cannot honour.
 */
export function assertIndexSupported(
  definition: SearchTypes.ResolvedSearchIndexDefinition,
  engine: PostgresSearchEngine = "native"
): void {
  const walk = (
    group: Record<string, SearchTypes.SearchFieldDefinition>,
    prefix: string
  ) => {
    for (const [name, field] of Object.entries(group)) {
      const path = prefix ? `${prefix}.${name}` : name

      if (field.correlated) {
        fail(
          `The postgres search provider cannot correlate predicates per element, so "${path}" cannot set "correlated". Arrays of objects are collapsed to per-leaf arrays.`
        )
      }

      if (field.type === "vector") {
        if (engine !== "lakebase") {
          fail(
            `Vector fields ("${path}") require engine: "lakebase". The native engine does not support vector search.`
          )
        }
        if (!field.dimensions || field.dimensions < 1) {
          fail(
            `Vector field "${path}" must declare a positive "dimensions" value`
          )
        }
        if (field.array) {
          fail(`Vector field "${path}" cannot be an array`)
        }
      }

      if (field.type === "geo") {
        fail(
          `The postgres search provider does not support geo fields ("${path}")`
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
 * Refuses a query this engine cannot honour without answering incorrectly.
 */
export function assertQuerySupported(
  query: SearchTypes.ProviderSearchQuery,
  engine: PostgresSearchEngine = "native"
): void {
  const options = query.search_options ?? {}

  if (options.highlight) {
    fail("The postgres search provider does not support highlighting")
  }

  if (options.vector && engine !== "lakebase") {
    fail(
      `Vector search requires engine: "lakebase". The native engine does not support search_options.vector.`
    )
  }

  if (options.locales?.length) {
    fail(
      "The postgres search provider does not support query-time locales; configure `language` on the provider options instead"
    )
  }

  if (options.match_strategy === "last") {
    fail(
      `The postgres search provider does not support match_strategy: "last". Use "all" (default) or "any".`
    )
  }

  if (query.pagination?.cursor !== undefined) {
    fail("The postgres search provider does not support cursor pagination")
  }
}

/**
 * Flattens a definition into per-leaf field metadata. Nested objects become
 * dotted paths; arrays of objects collapse to per-leaf arrays, matching the
 * local provider's shape so definitions stay portable.
 */
export function buildIndexPlan(
  definition: SearchTypes.ResolvedSearchIndexDefinition
): IndexPlan {
  const fields = new Map<string, PlannedField>()
  const searchable: string[] = []
  const vectors: string[] = []

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

      const kind = fieldKind(field)
      const planned: PlannedField = {
        path,
        kind,
        is_array: isArray,
        is_date: field.type === "date",
        dimensions: field.dimensions,
        field,
      }

      fields.set(path, planned)

      if (kind === "vector") {
        vectors.push(path)
        continue
      }

      if (isSearchable(field)) {
        searchable.push(path)
      }
    }
  }

  walk(definition.fields, "", false)

  const schemaPayload = {
    primary_key: definition.primary_key,
    fields: [...fields.values()].map((planned) => ({
      path: planned.path,
      kind: planned.kind,
      is_array: planned.is_array,
      is_date: planned.is_date,
      dimensions: planned.dimensions,
      searchable: isSearchable(planned.field),
      filterable: !!planned.field.filterable,
      sortable: !!planned.field.sortable,
      facetable: isFacetable(planned.field),
    })),
    searchable: [...searchable].sort(),
    vectors: [...vectors].sort(),
  }

  return {
    fields,
    searchable,
    vectors,
    primary_key: definition.primary_key,
    schema_hash: createHash("sha256")
      .update(JSON.stringify(schemaPayload))
      .digest("hex"),
  }
}

export function sameSchema(a: IndexPlan, b: IndexPlan): boolean {
  return a.schema_hash === b.schema_hash
}

/**
 * Maps a field weight onto Postgres `setweight` labels. Higher weights land in
 * denser buckets so `ts_rank` prefers title matches over body matches.
 */
export function weightLabel(
  searchable: SearchTypes.SearchFieldDefinition["searchable"]
): "A" | "B" | "C" | "D" {
  const weight =
    typeof searchable === "object" && searchable.weight !== undefined
      ? searchable.weight
      : 1

  if (weight >= 3) {
    return "A"
  }
  if (weight >= 2) {
    return "B"
  }
  if (weight > 1) {
    return "C"
  }
  return "D"
}

/**
 * Turns a physical index name into a safe Postgres table identifier.
 */
export function tableNameForIndex(physicalName: string): string {
  const safe = physicalName
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")

  if (!safe) {
    fail(`Cannot derive a table name from index "${physicalName}"`)
  }

  return `search_pg_${safe}`
}

/** BM25 index name for a document table (lakebase engine). */
export function bm25IndexName(table: string): string {
  return `${table}_bm25`
}

/**
 * Physical column name for a vector field path.
 * `embedding` → `v_embedding`, `meta.vec` → `v_meta_vec`.
 */
export function vectorColumnName(path: string): string {
  const safe = path
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_+/g, "_")
  return `v_${safe}`
}

export function vectorOpClass(
  distance: PostgresVectorDistance
): string {
  switch (distance) {
    case "l2":
      return "vector_l2_ops"
    case "inner_product":
      return "vector_ip_ops"
    case "cosine":
    default:
      return "vector_cosine_ops"
  }
}

export function vectorDistanceOperator(
  distance: PostgresVectorDistance
): string {
  switch (distance) {
    case "l2":
      return "<->"
    case "inner_product":
      return "<#>"
    case "cosine":
    default:
      return "<=>"
  }
}

export const CATALOG_TABLE = "search_postgres_index"
