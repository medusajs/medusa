import { Event } from "../event-bus"
import { RemoteQueryFunction } from "../modules-sdk"
import { SearchDocument } from "./common"
import { SearchFieldDefinition } from "./field"
import { SearchFilters } from "./filters"

export interface SearchIndexSettings {
  // Fields matched when `search_options.attributes_to_search_on` is omitted.
  // Defaults to every field marked `searchable`.
  default_search_attributes?: string[]
  synonyms?: Record<string, string[]>
  stop_words?: string[]
  typo_tolerance?: {
    enabled?: boolean
    min_word_size_for_one_typo?: number
    min_word_size_for_two_typos?: number
    disabled_on_attributes?: string[]
  }
  faceting?: {
    max_values_per_facet?: number
    sort_by?: "count" | "alpha"
  }
  pagination?: {
    max_total_hits?: number
  }
  distinct_attribute?: string
  locales?: string[]
  // Keyed by provider identifier.
  provider_options?: Record<string, Record<string, unknown>>
}

export type SearchMutation =
  | { action: "upsert"; documents: SearchDocument[] }
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
  query: RemoteQueryFunction
}

export interface SearchIngestionContext {
  container: SearchContainer
  index: SearchIndexDefinition
}

export interface SearchSeedContext extends SearchIngestionContext {
  // Restricts a partial reindex to a subset of the entity.
  filters?: Record<string, unknown>
  // The `last_key` of an interrupted run, when resuming one.
  last_key?: string
}

/**
 * One search index, declared. The module owns everything around it: creating and
 * migrating the physical index, batching writes, tracking tasks, and reindexing
 * when `fields` or `settings` drift.
 */
export interface SearchIndexDefinition {
  // Unique. What `query.search({ entity })` resolves against.
  name: string
  // The `query.graph` entrypoint used to hydrate non-indexed fields.
  entity: string
  // @default "id"
  primary_key?: string
  // Defaults to the module's configured default provider.
  provider?: string

  fields: Record<string, SearchFieldDefinition>
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

  // Ran when there is no data in the index or on reindex.
  seed: (context: SearchSeedContext) => AsyncIterable<SearchDocument[]>
}

// A definition with defaults applied and a provider resolved.
export interface ResolvedSearchIndexDefinition extends SearchIndexDefinition {
  primary_key: string
  provider: string
  settings: SearchIndexSettings
  definition_hash: string
  // The concrete index the provider reads and writes. Differs from `name` under
  // an index prefix, or while a `swap` builds into a replacement.
  physical_name: string
}
