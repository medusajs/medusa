export interface AdminCreateProductCategory {
  /**
   * The product category's name.
   */
  name: string
  /**
   * The product category's description.
   */
  description?: string
  /**
   * The product category's unique handle. Can be used to create
   * human-readable URLs.
   */
  handle?: string
  /**
   * Whether the category is only available and viewable by
   * admin users.
   */
  is_internal?: boolean
  /**
   * Whether the category is active. If disabled, the category
   * isn't retrieved in the store API routes.
   */
  is_active?: boolean
  /**
   * The ID of the parent category.
   */
  parent_category_id?: string
  /**
   * The category's ranking among its sibling categories.
   */
  rank?: number
  /**
   * An external identifier for the product category.
   */
  external_id?: string | null
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown>
}

export interface AdminUpdateProductCategory {
  /**
   * The product category's name.
   */
  name?: string
  /**
   * The product category's description.
   */
  description?: string
  /**
   * The product category's unique handle. Can be used to create
   * human-readable URLs.
   */
  handle?: string
  /**
   * Whether the category is only available and viewable by
   * admin users.
   */
  is_internal?: boolean
  /**
   * Whether the category is active. If disabled, the category
   * isn't retrieved in the store API routes.
   */
  is_active?: boolean
  /**
   * The ID of the parent category.
   */
  parent_category_id?: string | null
  /**
   * The category's ranking among its sibling categories.
   */
  rank?: number
  /**
   * An external identifier for the product category.
   */
  external_id?: string | null
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown>
}

export interface AdminUpdateProductCategoryProducts {
  /**
   * IDs of products to add to the category.
   */
  add?: string[]
  /**
   * IDs of products to remove from the category.
   */
  remove?: string[]
}
