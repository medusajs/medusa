import { BaseFilterable, OperatorMap } from "../dal"
import { AdminColumn } from "../http/view-configuration/admin/columns"

/**
 * The view configuration data model.
 */
export interface ViewConfigurationDTO {
  /**
   * The ID of the configuration.
   */
  id: string

  /**
   * The entity this configuration is for.
   */
  entity: string

  /**
   * The name of the configuration.
   */
  name: string

  /**
   * The user ID this configuration belongs to.
   */
  user_id: string | null

  /**
   * Whether this is a system default configuration.
   */
  is_system_default: boolean

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

  /**
   * The date the configuration was created.
   */
  created_at: Date

  /**
   * The date the configuration was last updated.
   */
  updated_at: Date
}

/**
 * The placement preference for a single widget within a layout zone.
 */
export interface LayoutWidgetPreference {
  /**
   * Whether the widget is hidden.
   */
  hidden?: boolean

  /**
   * Override which section this widget appears in.
   */
  section?: string

  /**
   * Override the sort order of the widget within its section.
   */
  order?: number
}

/**
 * The serialized layout preference for a zone.
 */
export interface LayoutConfigurationData {
  /**
   * Per-widget placement and visibility preferences, keyed by widget ID.
   */
  widgets: Record<string, LayoutWidgetPreference>
}

/**
 * The layout configuration data model.
 *
 * Unlike view configurations, there is at most one layout configuration per
 * `(zone, user_id)` pair, plus an optional single system default per zone.
 */
export interface LayoutConfigurationDTO {
  /**
   * The ID of the configuration.
   */
  id: string

  /**
   * The zone (page) this configuration is for, e.g. "product.details".
   */
  zone: string

  /**
   * The user ID this configuration belongs to, or null for the system default.
   */
  user_id: string | null

  /**
   * Whether this is the system default configuration for the zone.
   */
  is_system_default: boolean

  /**
   * The layout configuration data.
   */
  configuration: LayoutConfigurationData

  /**
   * The date the configuration was created.
   */
  created_at: Date

  /**
   * The date the configuration was last updated.
   */
  updated_at: Date
}

/**
 * Partial filters for layout configuration fields.
 */
export interface LayoutConfigurationFilterableFields {
  /**
   * The IDs to filter by.
   */
  id?: string | string[]

  /**
   * Filter by zone.
   */
  zone?: string | string[]

  /**
   * Filter by user ID.
   */
  user_id?: string | string[] | null

  /**
   * Filter by system default flag.
   */
  is_system_default?: boolean
}

/**
 * The filters to apply on the retrieved layout configurations.
 */
export interface FilterableLayoutConfigurationProps
  extends LayoutConfigurationFilterableFields {
  /**
   * An array of filters to apply on the entity, where each item in the array is joined with an "and" condition.
   */
  $and?: (
    | LayoutConfigurationFilterableFields
    | FilterableLayoutConfigurationProps
  )[]

  /**
   * An array of filters to apply on the entity, where each item in the array is joined with an "or" condition.
   */
  $or?: (
    | LayoutConfigurationFilterableFields
    | FilterableLayoutConfigurationProps
  )[]
}

/**
 * The user preference data model.
 */
export interface UserPreferenceDTO {
  /**
   * The ID of the preference.
   */
  id: string

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

  /**
   * The date the preference was created.
   */
  created_at: Date

  /**
   * The date the preference was last updated.
   */
  updated_at: Date
}

/**
 * Partial filters for view configuration fields.
 */
export interface ViewConfigurationFilterableFields {
  /**
   * The IDs to filter by.
   */
  id?: string | string[]

  /**
   * Filter by entity name.
   */
  entity?: string | string[]

  /**
   * Filter by user ID.
   */
  user_id?: string | string[] | null

  /**
   * Filter by system default flag.
   */
  is_system_default?: boolean

  /**
   * Filter by name.
   */
  name?: string | string[]
}

/**
 * The filters to apply on the retrieved view configurations.
 */
export interface FilterableViewConfigurationProps
  extends ViewConfigurationFilterableFields {
  /**
   * An array of filters to apply on the entity, where each item in the array is joined with an "and" condition.
   */
  $and?: (
    | ViewConfigurationFilterableFields
    | FilterableViewConfigurationProps
  )[]

  /**
   * An array of filters to apply on the entity, where each item in the array is joined with an "or" condition.
   */
  $or?: (ViewConfigurationFilterableFields | FilterableViewConfigurationProps)[]
}

/**
 * The filters to apply on the retrieved user preferences.
 */
export interface FilterableUserPreferenceProps
  extends BaseFilterable<UserPreferenceDTO> {
  /**
   * The IDs to filter by.
   */
  id?: string | string[]

  /**
   * Filter by user ID.
   */
  user_id?: string | string[]

  /**
   * Filter by preference key.
   */
  key?: string | string[]
}

/**
 * The property label data model.
 * Stores custom display labels for entity properties.
 * Labels are global (shared across all admin users).
 */
export interface PropertyLabelDTO {
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
  description: string | null

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
 * Partial filters for property label fields.
 */
export interface PropertyLabelFilterableFields
  extends BaseFilterable<PropertyLabelFilterableFields> {
  /**
   * The IDs to filter by.
   */
  id?: string | string[] | OperatorMap<string | string[]>

  /**
   * Filter by entity name.
   */
  entity?: string | string[] | OperatorMap<string>

  /**
   * Filter by property name.
   */
  property?: string | string[] | OperatorMap<string>
}

export interface ViewConfigurationColumnDTO extends AdminColumn {}
