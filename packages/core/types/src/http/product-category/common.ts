import { BaseFilterable, OperatorMap } from "../../dal"
import { FindParams, SelectParams } from "../common"
import { BaseProduct } from "../product/common"

export interface BaseProductCategory {
  /**
   * The category's ID.
   */
  id: string
  /**
   * The category's name.
   */
  name: string
  /**
   * The category's description.
   */
  description: string
  /**
   * The category's handle.
   */
  handle: string
  /**
   * Whether the category is active.
   */
  is_active: boolean
  /**
   * Whether the category is internal.
   */
  is_internal: boolean
  /**
   * The category's ranking among sibling categories.
   */
  rank: number | null
  /**
   * The ID of the category's parent.
   */
  parent_category_id: string | null
  /**
   * The category's parent.
   */
  parent_category: BaseProductCategory | null
  /**
   * The category's children.
   */
  category_children: BaseProductCategory[]
  /**
   * The category's products.
   */
  products?: BaseProduct[]
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown> | null
  /**
   * The date the category was created.
   */
  created_at: string
  /**
   * The date the category was updated.
   */
  updated_at: string
  /**
   * The date the category was deleted.
   */
  deleted_at: string | null
}

export interface BaseProductCategoryListParams
  extends FindParams,
    BaseFilterable<BaseProductCategoryListParams> {
  /**
   * A query or keywords to search the category's searchable fields.
   */
  q?: string
  /**
   * Filter by the category's ID(s).
   */
  id?: string | string[]
  /**
   * Filter by the category's name(s).
   */
  name?: string | string[]
  /**
   * Filter by the category's description(s).
   */
  description?: string | string[]
  /**
   * Retrieve the child categories of the specified parent ID(s).
   */
  parent_category_id?: string | string[] | null
  /**
   * Filter by the category's handle(s).
   */
  handle?: string | string[]
  /**
   * Filter by whether the category is active.
   */
  is_active?: boolean
  /**
   * Filter by whether the category is internal.
   */
  is_internal?: boolean
  /**
   * Whether to retrieve the child categories. If enabled, the child categories are
   * retrieved in the `category_children` field.
   */
  include_descendants_tree?: boolean
  /**
   * Whether to retrieve the parent category. If enabled, the parent category is
   * retrieved in the `parent_category` field.
   */
  include_ancestors_tree?: boolean
  /**
   * Apply filters on the category's creation date.
   */
  created_at?: OperatorMap<string>
  /**
   * Apply filters on the category's update date.
   */
  updated_at?: OperatorMap<string>
  /**
   * Apply filters on the category's deletion date.
   */
  deleted_at?: OperatorMap<string>
}

export interface BaseProductCategoryParams extends SelectParams {
  /**
   * Whether to retrieve the parent category. If enabled, the parent category is
   * retrieved in the `parent_category` field.
   */
  include_ancestors_tree?: boolean
  /**
   * Whether to retrieve the child categories. If enabled, the child categories are
   * retrieved in the `category_children` field.
   */
  include_descendants_tree?: boolean
}
