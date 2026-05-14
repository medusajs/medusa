import { BaseFilterable, OperatorMap } from "../../dal"
import { FindParams, SelectParams } from "../common"
import { BaseProduct } from "../product/common"

/**
 * A collection. It can be used to organize products for easier browsing and filtering.
 */
export interface BaseCollection {
  /**
   * The collection's ID.
   */
  id: string
  /**
   * The collection's title.
   */
  title: string
  /**
   * The collection's handle.
   */
  handle: string
  /**
   * The date the collection was created.
   */
  created_at: string
  /**
   * The date the collection was updated.
   */
  updated_at: string
  /**
   * The date the collection was deleted.
   */
  deleted_at: string | null
  /**
   * The collection's products.
   *
   * @expandable
   */
  products?: BaseProduct[]
  /**
   * An external ID for the collection.
   *
   * @since 2.13.7
   */
  external_id?: string | null
  /**
   * Key-value pairs of custom data.
   */
  metadata: Record<string, unknown> | null
}

/**
 * The filters to apply on collections when retrieving them.
 */
export interface BaseCollectionParams extends SelectParams {}

/**
 * The filters to apply when retrieving a list of collections.
 */
export interface BaseCollectionListParams
  extends FindParams,
    BaseFilterable<BaseCollectionListParams> {
  /**
   * A query or keywords to search the collection's searchable fields by.
   */
  q?: string
  /**
   * Filter by collection ID(s).
   */
  id?: string | string[]
  /**
   * Filter by collection handle(s).
   */
  handle?: string | string[]
  /**
   * Filter by collection title(s).
   */
  title?: string | string[]
  /**
   * Filter by external ID(s).
   *
   * @since 2.13.7
   */
  external_id?: string | string[]
  /**
   * Apply filters on collection creation dates.
   */
  created_at?: OperatorMap<string>
  /**
   * Apply filters on collection update dates.
   */
  updated_at?: OperatorMap<string>
}
