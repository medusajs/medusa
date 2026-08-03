import { MedusaContainer } from "../common"
import { Event } from "../event-bus"
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
  // Deleting by id is a filter on the primary key.
  | { action: "delete"; filters: SearchFilters }

export interface SearchIngestionContext {
  container: MedusaContainer
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

  // Events that invalidate documents here. Unused until ingestion is wired up.
  events?: string[]

  /**
   * Turns an event into mutations, fetching through `query.graph` off the
   * container since events rarely carry everything. Return `[]` to ignore one.
   * Unused until ingestion is wired up.
   */
  consume?: (
    event: Event<any>,
    context: SearchIngestionContext
  ) => Promise<SearchMutation[]>

  // Builds the index, or the subset `context.filters` selects. Yields batches so
  // a large index streams rather than being held in memory.
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
