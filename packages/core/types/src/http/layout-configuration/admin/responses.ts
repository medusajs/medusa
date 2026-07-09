import { PaginatedResponse } from "../../common"

export interface AdminLayoutWidgetPreference {
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

export interface AdminLayoutConfiguration {
  /**
   * The layout configuration's ID.
   */
  id: string
  /**
   * The zone (page) this configuration is for, e.g. "product.details".
   */
  zone: string
  /**
   * The ID of the user who owns this configuration, or null for the system default.
   */
  user_id: string | null
  /**
   * Whether this is the system default configuration for the zone.
   */
  is_system_default: boolean
  /**
   * The layout configuration settings.
   */
  configuration: {
    /**
     * Per-widget placement and visibility preferences, keyed by widget ID.
     */
    widgets: Record<string, AdminLayoutWidgetPreference>
  }
  /**
   * The date the layout configuration was created.
   */
  created_at: Date
  /**
   * The date the layout configuration was updated.
   */
  updated_at: Date
}

export type AdminLayoutScope = "personal" | "default"

export type AdminLayoutConfigurationListResponse = PaginatedResponse<{
  /**
   * The list of layout configurations.
   */
  layout_configurations: AdminLayoutConfiguration[]
}>

export interface AdminLayoutConfigurationResponse {
  /**
   * The current user's personal layout configuration for the zone, or null if
   * they have not saved one.
   */
  personal_configuration: AdminLayoutConfiguration | null
  /**
   * The zone's system default layout configuration (applies to all users), or
   * null if none has been saved.
   */
  default_configuration: AdminLayoutConfiguration | null
  /**
   * The scope the current user is actively viewing for this zone — their
   * persisted choice, falling back to "personal" when they have a personal
   * configuration and "default" otherwise.
   */
  active_scope: AdminLayoutScope
}
