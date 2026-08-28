import { SearchFilters } from "./filters"

/**
 * The reserved sort key that orders results by relevance.
 */
export const SEARCH_SCORE_KEY = "_score"

/**
 * The direction results are sorted in.
 */
export type SearchOrderBy = "ASC" | "DESC"

/**
 * How the terms of a free-text query combine. Refer to
 * {@link SearchOptions.match_strategy} for details on each strategy.
 */
export type SearchMatchStrategy = "all" | "any" | "last"

/**
 * How the total number of matching documents is computed:
 *
 * - `estimated`: an approximate count, which is what most engines return.
 * - `exact`: an exact count, which may be rejected or slow depending on the provider.
 * - `none`: no count at all, making the result's `count` `null`.
 */
export type SearchCountStrategy = "estimated" | "exact" | "none"

/**
 * A facet to compute alongside a search query's hits.
 */
export type SearchFacetRequest =
  | {
      /**
       * The dotted path of the field to facet on.
       */
      field: string

      /**
       * Count the documents per distinct value of the field. This is the default
       * facet type.
       */
      type?: "value"

      /**
       * The maximum number of facet values to return.
       */
      limit?: number

      /**
       * Whether to order the returned values by their count or alphabetically.
       */
      sort?: "count" | "alpha"

      /**
       * Restrict the returned facet values to those matching this string.
       */
      query?: string
    }
  | {
      /**
       * The dotted path of the field to facet on.
       */
      field: string

      /**
       * Count the documents falling in each of the requested `ranges`.
       */
      type: "range"

      /**
       * The ranges to count the documents of.
       */
      ranges: {
        /**
         * A key identifying the range in the result.
         */
        key?: string

        /**
         * The range's inclusive lower bound.
         */
        from?: number | string

        /**
         * The range's exclusive upper bound.
         */
        to?: number | string
      }[]
    }
  | {
      /**
       * The dotted path of the field to facet on.
       */
      field: string

      /**
       * Aggregate the field's values, such as its minimum and maximum, over the
       * matching documents.
       */
      type: "stats"
    }

/**
 * How the matched terms are highlighted in a search result's hits.
 */
export interface SearchHighlightOptions {
  /**
   * The dotted paths of the fields to highlight.
   */
  fields: string[]

  /**
   * The tag inserted before a matched term.
   *
   * @default "<mark>"
   */
  pre_tag?: string

  /**
   * The tag inserted after a matched term.
   *
   * @default "</mark>"
   */
  post_tag?: string

  /**
   * Whether to crop a fragment around the match rather than returning the whole
   * field, optionally specifying the fragment's length.
   */
  snippet?: boolean | { length: number }
}

/**
 * The options of a vector, or semantic, search.
 */
export interface SearchVectorOptions {
  /**
   * The dotted path of the `vector` field to search in. Optional when the
   * index declares exactly one vector field.
   */
  field?: string

  /**
   * A pre-computed embedding to search with. Mutually exclusive with `query`.
   * Allowed whether documents store customer-supplied embeddings or the engine
   * embeds them.
   */
  value?: number[]

  /**
   * Text the engine embeds at query time. Requires the vector field to declare
   * `embed`. Mutually exclusive with `value`.
   */
  query?: string

  /**
   * How much the semantic score contributes relative to the keyword score, where
   * `0` is keyword-only and `1` is semantic-only. Defaults to `1` when there is
   * no free-text query, and `0.5` when both run together.
   */
  semantic_ratio?: number
}

/**
 * The options changing how a search query is matched, scored, and aggregated.
 */
export interface SearchOptions {
  /**
   * The dotted paths of the fields to match the free-text query against. Defaults
   * to every field marked `searchable` on the index.
   */
  attributes_to_search_on?: string[]

  /**
   * How query terms combine.
   *
   * - `"all"` (default): every term must appear as a complete token.
   * - `"any"`: at least one term must match.
   * - `"last"`: typeahead. Completed terms must match in full; the last term
   *   is a prefix, so `"my sear"` matches `"My search results"`.
   */
  match_strategy?: SearchMatchStrategy

  /**
   * Whether to match terms that are misspelled by a character or two.
   */
  typo_tolerance?: boolean

  /**
   * The facets to compute alongside the hits. A string is shorthand for a `value`
   * facet on that field.
   */
  facets?: (string | SearchFacetRequest)[]

  /**
   * Compute each facet ignoring the filter on that same field, so a storefront
   * keeps showing sibling values of an active filter. Needs one query per facet
   * on every engine reviewed, so the module expands them and hands the set to
   * `provider.searchMany`.
   */
  disjunctive_facets?: boolean

  /**
   * How the matched terms are highlighted in the returned hits.
   */
  highlight?: SearchHighlightOptions

  /**
   * Return at most one hit per distinct value of this field.
   */
  distinct?: string

  /**
   * Discard hits scoring below this threshold.
   */
  min_score?: number

  /**
   * Whether to return each hit's relevance score.
   */
  include_score?: boolean

  /**
   * Query-time language hint, e.g. `["en"]`. Engines that analyze per language
   * (Meilisearch, Algolia) use it to pick the analyzer; a provider that cannot
   * honour it rejects it rather than silently matching differently. Defaults to
   * the index' `settings.locales`.
   */
  locales?: string[]

  /**
   * The options of a vector, or semantic, search to run instead of, or alongside,
   * the free-text query.
   */
  vector?: SearchVectorOptions

  /**
   * How the total number of matching documents is computed. `"exact"` may be
   * rejected or slow depending on the provider.
   *
   * @default "estimated"
   */
  count?: SearchCountStrategy

  /**
   * Escape hatch for engine features the interface does not model, keyed by
   * provider identifier, e.g. `{ typesense: { drop_tokens_threshold: 0 } }`.
   */
  provider_options?: Record<string, Record<string, unknown>>
}

/**
 * How a search query's results are paginated and sorted.
 */
export interface SearchPagination {
  /**
   * The number of documents to skip before the returned hits. Mutually exclusive
   * with `cursor`.
   */
  skip?: number

  /**
   * The maximum number of hits to return.
   */
  take?: number

  /**
   * The fields to sort the hits by, keyed by the field's dotted path. The
   * reserved `_score` key sorts by relevance.
   */
  order?: Record<string, SearchOrderBy>

  /**
   * An opaque provider cursor, as returned in a previous result's
   * `metadata.next_cursor`. Mutually exclusive with `skip`.
   */
  cursor?: string
}

/**
 * A query to run against a search index.
 */
export interface SearchQuery<TEntry extends string = string> {
  /**
   * The name of the index to query, which defaults to the index whose name
   * equals the entity.
   */
  entity: TEntry

  /**
   * The dotted paths of the fields the search engine should return. Only fields
   * available in the search engine can be passed here.
   */
  fields?: string[]

  /**
   * The filters to apply, including the free-text query as `q`.
   */
  filters?: SearchFilters

  /**
   * How the results are paginated and sorted.
   */
  pagination?: SearchPagination

  /**
   * The options changing how the query is matched, scored, and aggregated.
   */
  search_options?: SearchOptions
}
