/**
 * Native engine (default):
 * - Built-in `tsvector` / `tsquery`
 * - `pg_trgm` — typo tolerance
 * - `unaccent` — accent folding via `medusa_search_<language>` text search config
 *
 * Lakebase engine — Medusa Cloud only (PG16+):
 * - `lakebase_text` — BM25 via `lakebase_bm25`
 * - `lakebase_vector` — ANN via `lakebase_ann` (CASCADE installs `vector`)
 *
 * The provider migration creates `pg_trgm`, `unaccent`, the default
 * `medusa_search_english` config, and — on engines that ship them —
 * `lakebase_vector` / `lakebase_text` via `CREATE EXTENSION ... CASCADE`.
 * Custom languages need a matching `medusa_search_<language>` configuration.
 */

export function textSearchConfigName(language: string): string {
  return `medusa_search_${language}`
}

/**
 * `word_similarity(query, text)` from pg_trgm. Unlike plain `similarity`, it
 * compares the query against the best-matching word sequence in the document
 * text, so long documents don't dilute the score.
 */
export function wordSimilarityCall(querySql: string, textSql: string): string {
  return `word_similarity(${querySql}, ${textSql})`
}
