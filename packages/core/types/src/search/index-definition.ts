import { Event } from "../event-bus"
import { RemoteQueryFunction } from "../modules-sdk"
import { SearchDocument } from "./common"
import { SearchFieldDefinition } from "./field"
import { SearchFilters } from "./filters"

/**
 * The settings applied to a search index when it's created or migrated. A
 * provider that can't honour a setting rejects it from `upsertIndex`.
 */
export interface SearchIndexSettings {
  /**
   * Terms treated as equivalent when matching, keyed by the term they expand to.
   */
  synonyms?: Record<string, string[]>

  /**
   * Terms ignored when matching, such as `the` or `a`.
   */
  stop_words?: string[]

  /**
   * How misspelled terms are matched.
   */
  typo_tolerance?: {
    /**
     * Whether typo tolerance is enabled at all.
     */
    enabled?: boolean

    /**
     * The shortest term length that tolerates a single typo.
     */
    min_word_size_for_one_typo?: number

    /**
     * The shortest term length that tolerates two typos.
     */
    min_word_size_for_two_typos?: number

    /**
     * The dotted paths of the fields that must always match exactly.
     */
    disabled_on_attributes?: string[]
  }

  /**
   * The defaults applied to the facets computed on this index.
   */
  faceting?: {
    /**
     * The maximum number of values returned for a facet.
     */
    max_values_per_facet?: number

    /**
     * Whether facet values are ordered by their count or alphabetically.
     */
    sort_by?: "count" | "alpha"
  }

  /**
   * The limits applied when paginating this index.
   */
  pagination?: {
    /**
     * The maximum number of hits a query can page through.
     */
    max_total_hits?: number
  }

  /**
   * The dotted path of a field that hits are deduplicated by, returning at most
   * one hit per distinct value.
   */
  distinct_attribute?: string

  /**
   * The languages the index's text is analyzed for, such as `["en"]`.
   */
  locales?: string[]

  /**
   * Index settings specific to a search engine, keyed by provider identifier.
   */
  provider_options?: Record<string, Record<string, unknown>>
}

/**
 * A change to apply to a search index, as returned by an index definition's
 * `consume` function.
 */
export type SearchMutation =
  | {
      /**
       * Adds the documents to the index, replacing any that already exist under
       * the same ID.
       */
      action: "upsert"

      /**
       * The documents to write.
       */
      documents: SearchDocument[]
    }
  /**
   * Removes every document matching `filters`. The common case is deleting by
   * id, which is a filter on the primary key — `{ id: ["prod_1"] }` — but any
   * filter the provider can evaluate works, e.g. removing everything a
   * `store.deleted` event orphaned with `{ store_id: "store_1" }`.
   */
  | { action: "delete"; filters: SearchFilters }

/**
 * We keep the container very limited here so the search module doesn't need a full MedusaContainer.
 * We can expand in the future if needed, but query should suffice.
 */
export interface SearchContainer {
  /**
   * Query, used to retrieve the data the documents are built from.
   */
  query: RemoteQueryFunction
}

/**
 * The context passed to an index definition's `consume` function.
 */
export interface SearchIngestionContext {
  /**
   * The resources available while turning an event into documents.
   */
  container: SearchContainer

  /**
   * The definition of the index the documents are written to.
   */
  index: SearchIndexDefinition
}

/**
 * The context passed to an index definition's `seed` function.
 */
export interface SearchSeedContext extends SearchIngestionContext {
  /**
   * Restricts a partial reindex to a subset of the entity, as passed to the
   * Search Module's `reindex` method.
   */
  filters?: Record<string, unknown>

  /**
   * The `last_key` of an interrupted run, when resuming one.
   */
  last_key?: string
}

/**
 * One search index, declared. The module owns everything around it: creating and
 * migrating the physical index, batching writes, tracking tasks, and reindexing
 * when `fields` or `settings` drift.
 */
export interface SearchIndexDefinition {
  /**
   * The index's unique name, which is what `query.search({ entity })` resolves
   * against.
   */
  name: string

  /**
   * The `query.graph` entrypoint used to hydrate non-indexed fields.
   */
  entity: string

  /**
   * The field whose value keys the index's documents, which is what a hit's `id`
   * holds.
   *
   * @default "id"
   */
  primary_key?: string

  /**
   * The identifier of the provider backing this index. Defaults to the module's
   * configured default provider.
   */
  provider?: string

  /**
   * The fields the index holds, keyed by their path in the document.
   */
  fields: Record<string, SearchFieldDefinition>

  /**
   * The settings applied to the index when it's created or migrated.
   */
  settings?: SearchIndexSettings

  /**
   * Events related and that can affect the data for this index.
   */
  events?: string[]

  /**
   * Executed on event ingestion to determine the action that needs to be performed on the index.
   */
  consume?: (
    event: Event<any>,
    context: SearchIngestionContext
  ) => Promise<SearchMutation[]>

  /**
   * Yields the index's documents in batches. Ran when there is no data in the
   * index or on reindex.
   */
  seed: (context: SearchSeedContext) => AsyncIterable<SearchDocument[]>
}

/**
 * An index definition with the module's defaults applied and a provider resolved.
 */
export interface ResolvedSearchIndexDefinition extends SearchIndexDefinition {
  /**
   * The field whose value keys the index's documents.
   */
  primary_key: string

  /**
   * The identifier of the provider backing this index.
   */
  provider: string

  /**
   * The settings applied to the index.
   */
  settings: SearchIndexSettings

  /**
   * A hash of the definition, which the module compares to detect that an index
   * drifted from its definition and must be migrated.
   */
  definition_hash: string

  /**
   * The root physical index name, derived from `name` and the module's
   * `index_prefix`. Never queried directly: each version of this index gets its
   * own physical index derived from this root, and the module resolves which
   * one is currently active before reading or writing.
   */
  physical_name: string
}
