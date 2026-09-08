import { DeleteResponse, PaginatedResponse } from "../../common"

export interface AdminViewConfiguration {
  /**
   * The view configuration's ID.
   */
  id: string
  /**
   * The entity this configuration is for (e.g., "order", "product").
   */
  entity: string
  /**
   * The name of the view configuration.
   */
  name: string | null
  /**
   * The ID of the user who owns this configuration, or null for system defaults.
   */
  user_id: string | null
  /**
   * Whether this is a system default configuration.
   */
  is_system_default: boolean
  /**
   * The view configuration settings.
   */
  configuration: {
    /**
     * The list of visible column IDs.
     */
    visible_columns: string[]
    /**
     * The order of columns.
     */
    column_order: string[]
    /**
     * Custom column widths.
     */
    column_widths?: Record<string, number>
    /**
     * Active filters for the view.
     */
    filters?: Record<string, any>
    /**
     * Sorting configuration.
     */
    sorting?: {
      id: string
      desc: boolean
    } | null
    /**
     * Search query for the view.
     */
    search?: string
  }
  /**
   * The date the view configuration was created.
   */
  created_at: Date
  /**
   * The date the view configuration was updated.
   */
  updated_at: Date
}

export interface AdminViewConfigurationResponse {
  /**
   * The view configuration's details.
   */
  view_configuration: AdminViewConfiguration | null
}

export type AdminViewConfigurationListResponse = PaginatedResponse<{
  /**
   * The list of view configurations.
   */
  view_configurations: AdminViewConfiguration[]
}>

export type AdminViewConfigurationDeleteResponse =
  DeleteResponse<"view_configuration">
