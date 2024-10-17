import { BaseFilterable, OperatorMap } from "../../dal"
import { FindParams, SelectParams } from "../common"
import { BaseProduct } from "../product/common"

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
   */
  products?: BaseProduct[]
  /**
   * Key-value pairs of custom data.
   */
  metadata: Record<string, unknown> | null
}

export interface BaseCollectionParams extends SelectParams {}

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
   * Apply filters on collection creation dates.
   */
  created_at?: OperatorMap<string>
  /**
   * Apply filters on collection update dates.
   */
  updated_at?: OperatorMap<string>
}
