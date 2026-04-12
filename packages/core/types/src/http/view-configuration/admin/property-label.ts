/**
 * The property label returned by the Admin API.
 * Labels are global (shared across all admin users).
 */
export interface AdminPropertyLabel {
  /**
   * The ID of the property label.
   */
  id: string

  /**
   * The entity this label applies to (e.g., "Order", "Product").
   */
  entity: string

  /**
   * The property path (e.g., "display_id", "customer.email").
   */
  property: string

  /**
   * Custom display name for the property.
   */
  label: string

  /**
   * Optional description providing context about the property.
   */
  description?: string

  /**
   * The date the label was created.
   */
  created_at: Date

  /**
   * The date the label was last updated.
   */
  updated_at: Date
}

/**
 * Response for a single property label.
 */
export interface AdminPropertyLabelResponse {
  /**
   * The property label.
   */
  property_label: AdminPropertyLabel
}

/**
 * Response for a list of property labels.
 */
export interface AdminPropertyLabelListResponse {
  /**
   * The list of property labels.
   */
  property_labels: AdminPropertyLabel[]

  /**
   * The total count of property labels.
   */
  count: number

  /**
   * The offset used in the query.
   */
  offset: number

  /**
   * The limit used in the query.
   */
  limit: number
}

/**
 * Response for deleting a property label.
 */
export interface AdminPropertyLabelDeleteResponse {
  /**
   * The ID of the deleted property label.
   */
  id: string

  /**
   * The object type.
   */
  object: "property_label"

  /**
   * Whether the label was deleted.
   */
  deleted: boolean
}

/**
 * Payload for creating a property label.
 */
export interface AdminCreatePropertyLabel {
  /**
   * The entity this label applies to.
   */
  entity: string

  /**
   * The property path.
   */
  property: string

  /**
   * Custom display name for the property.
   */
  label: string

  /**
   * Optional description providing context about the property.
   */
  description?: string
}

/**
 * Payload for updating a property label.
 */
export interface AdminUpdatePropertyLabel {
  /**
   * The ID of the property label.
   */
  id: string

  /**
   * Custom display name for the property.
   */
  label?: string

  /**
   * Optional description providing context about the property.
   */
  description?: string
}

/**
 * @deprecated Use AdminCreatePropertyLabel or AdminUpdatePropertyLabel instead.
 */
export interface AdminUpsertPropertyLabel {
  /**
   * Custom display name for the property.
   */
  label: string

  /**
   * Optional description providing context about the property.
   */
  description?: string
}

/**
 * Payload for batch property label operations.
 */
export interface AdminBatchPropertyLabelRequest {
  /**
   * Property labels to create.
   */
  create?: AdminCreatePropertyLabel[]

  /**
   * Property labels to update.
   */
  update?: AdminUpdatePropertyLabel[]

  /**
   * IDs of property labels to delete.
   */
  delete?: string[]
}

/**
 * Response for batch property label operations.
 */
export interface AdminBatchPropertyLabelResponse {
  /**
   * Created property labels.
   */
  created: AdminPropertyLabel[]

  /**
   * Updated property labels.
   */
  updated: AdminPropertyLabel[]

  /**
   * Deleted property label results.
   */
  deleted: { id: string; object: "property_label"; deleted: boolean }[]
}
