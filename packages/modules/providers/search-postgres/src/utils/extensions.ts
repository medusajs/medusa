/**
 * Native engine (default):
 * - Built-in `tsvector` / `tsquery`
 * - `pg_trgm` — typo tolerance
 * - `unaccent` — accent folding via `medusa_search_<language>` text search config
 *
 * Lakebase engine — Neon / Medusa Cloud only (PG16+):
 * - `lakebase_text` — BM25 via `lakebase_bm25`
 * - `lakebase_vector` — ANN via `lakebase_ann` (CASCADE installs `vector`)
 *
 * The migration creates `pg_trgm`, `unaccent`, and the default
 * `medusa_search_english` config. Custom languages need a matching
 * `medusa_search_<language>` configuration.
 *
 * Lakebase extensions are not in the migration: they need preloaded libraries
 * that `db:migrate` cannot enable. The provider creates them at runtime when
 * `engine: "lakebase"`.
 */

export const PG_TRGM_EXTENSION = "pg_trgm"
export const UNACCENT_EXTENSION = "unaccent"
export const LAKEBASE_TEXT_EXTENSION = "lakebase_text"
export const LAKEBASE_VECTOR_EXTENSION = "lakebase_vector"

export const LAKEBASE_EXTENSIONS = [
  LAKEBASE_TEXT_EXTENSION,
  LAKEBASE_VECTOR_EXTENSION,
] as const

export function textSearchConfigName(language: string): string {
  return `medusa_search_${language}`
}

export function createExtensionSql(name: string): string {
  return `CREATE EXTENSION IF NOT EXISTS "${name}"`
}

/**
 * `word_similarity(query, text)` from pg_trgm. Unlike plain `similarity`, it
 * compares the query against the best-matching word sequence in the document
 * text, so long documents don't dilute the score.
 */
export function wordSimilarityCall(querySql: string, textSql: string): string {
  return `word_similarity(${querySql}, ${textSql})`
}
