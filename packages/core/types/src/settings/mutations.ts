/**
 * The view configuration to be created.
 */
export interface CreateViewConfigurationDTO {
  /**
   * The entity this configuration is for.
   */
  entity: string

  /**
   * The name of the configuration. Required unless creating a system default.
   */
  name?: string

  /**
   * The user ID this configuration belongs to. Can be null for system defaults.
   */
  user_id?: string | null

  /**
   * Whether this is a system default configuration.
   */
  is_system_default?: boolean

  /**
   * The configuration data.
   */
  configuration: {
    /**
     * The visible columns.
     */
    visible_columns: string[]

    /**
     * The column order.
     */
    column_order: string[]

    /**
     * The column widths.
     */
    column_widths?: Record<string, number>

    /**
     * The filters to apply.
     */
    filters?: Record<string, any>

    /**
     * The sorting configuration.
     */
    sorting?: { id: string; desc: boolean } | null

    /**
     * The search string.
     */
    search?: string
  }
}

/**
 * The attributes to update in the view configuration.
 */
export interface UpdateViewConfigurationDTO {
  /**
   * The name of the configuration.
   */
  name?: string

  /**
   * The configuration data.
   */
  configuration?: {
    /**
     * The visible columns.
     */
    visible_columns?: string[]

    /**
     * The column order.
     */
    column_order?: string[]

    /**
     * The column widths.
     */
    column_widths?: Record<string, number>

    /**
     * The filters to apply.
     */
    filters?: Record<string, any>

    /**
     * The sorting configuration.
     */
    sorting?: { id: string; desc: boolean } | null

    /**
     * The search string.
     */
    search?: string
  }
}

/**
 * The user preference to be created.
 */
export interface CreateUserPreferenceDTO {
  /**
   * The user ID.
   */
  user_id: string

  /**
   * The preference key.
   */
  key: string

  /**
   * The preference value.
   */
  value: any
}

/**
 * The attributes to update in the user preference.
 */
export interface UpdateUserPreferenceDTO {
  /**
   * The preference value.
   */
  value: any
}

/**
 * The property label to be created.
 */
export interface CreatePropertyLabelDTO {
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
}

/**
 * The property label to be upserted (created or updated).
 */
export interface UpsertPropertyLabelDTO {
  /**
   * The ID of the property label to update.
   */
  id?: string
  /**
   * The entity this label applies to (e.g., "Order", "Product").
   */
  entity?: string

  /**
   * The property path (e.g., "display_id", "customer.email").
   */
  property?: string

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
 * The attributes to update in the property label.
 */
export interface UpdatePropertyLabelDTO {
  /**
   * The ID of the property label to update.
   */
  id?: string

  /**
   * Custom display name for the property.
   */
  label?: string

  /**
   * Optional description providing context about the property.
   */
  description?: string | null
}
