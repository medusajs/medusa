import { QueryContextType } from "../../common"
import { IndexServiceEntryPoints } from "../index-service-entry-points"
import { ObjectToIndexFields } from "./query-input-config-fields"
import { IndexFilters } from "./query-input-config-filters"
import { IndexOrderBy } from "./query-input-config-order-by"

export type IndexQueryInput<TEntry extends string> = {
  /**
   * The name of the entity to retrieve. For example, `product`.
   */
  entity: TEntry | keyof IndexServiceEntryPoints
  /**
   * The fields and relations to retrieve in the entity.
   */
  fields: ObjectToIndexFields<
    IndexServiceEntryPoints[TEntry & keyof IndexServiceEntryPoints]
  > extends never
    ? string[]
    :
        | ObjectToIndexFields<
            IndexServiceEntryPoints[TEntry & keyof IndexServiceEntryPoints]
          >[]
        | string[]
  /**
   * Pagination configurations for the returned list of items.
   */
  pagination?: {
    /**
     * The number of items to skip before retrieving the returned items.
     */
    skip?: number
    /**
     * The maximum number of items to return.
     */
    take?: number
    /**
     * Sort by field names in ascending or descending order.
     */
    order?: IndexOrderBy<TEntry>
  }
  /**
   * Filters to apply on the retrieved items.
   */
  filters?: IndexFilters<TEntry>
  /**
   * Apply a query context on the retrieved data. For example, to retrieve product prices for a certain context.
   */
  context?: QueryContextType
  /**
   * Apply a `withDeleted` flag on the retrieved data to retrieve soft deleted items.
   */
  withDeleted?: boolean
  /**
   * Relation paths (relative to `entity`) that the full-text `q` filter should also
   * traverse when matching. Each path is searched via a correlated EXISTS subquery
   * against the related entity's `document_tsv`, without inflating the inner row
   * stream. Paths that already appear in `filters` (i.e. a real filter join on the
   * same relation) are skipped because the join handles the OR naturally.
   *
   * Example: `searchReach: ["variants"]` makes a `q` on `product` also match
   * variant fields (e.g. SKU) without forcing a `filters.variants = {}` hack.
   */
  searchReach?: string[]
}

export type IndexQueryConfig<TEntry extends string> = {
  fields: ObjectToIndexFields<
    IndexServiceEntryPoints[TEntry & keyof IndexServiceEntryPoints]
  > extends never
    ? string[]
    : ObjectToIndexFields<
        IndexServiceEntryPoints[TEntry & keyof IndexServiceEntryPoints]
      >[]
  filters?: IndexFilters<TEntry>
  joinFilters?: IndexFilters<TEntry>
  pagination?: Partial<IndexQueryInput<TEntry>["pagination"]>
  idsOnly?: boolean
  /**
   * Relation paths (relative to `entity`) that the full-text `q` filter should
   * also traverse via EXISTS subqueries. See `IndexQueryInput.searchReach`.
   */
  searchReach?: string[]
}

export type QueryFunctionReturnPagination = {
  skip: number
  take: number
  /**
   * @featureFlag index_engine
   * @since 2.8.0
   */
  estimate_count: number
}

/**
 * The QueryResultSet presents a typed output for the
 * result returned by the index search engine, it doesnt narrow down the type
 * based on the intput fields.
 */
export type QueryResultSet<TEntry extends string> = {
  data: TEntry extends keyof IndexServiceEntryPoints
    ? IndexServiceEntryPoints[TEntry][]
    : any[]
  metadata?: QueryFunctionReturnPagination
}
