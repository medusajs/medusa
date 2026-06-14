import { AdminLayoutWidgetPreference } from "./responses"

export interface AdminSetLayoutConfiguration {
  /**
   * Whether to set the zone's system default configuration (applies to all
   * users) instead of the current user's personal configuration.
   */
  is_default?: boolean
  /**
   * The layout configuration settings.
   */
  configuration: {
    /**
     * Per-widget placement and visibility preferences, keyed by widget ID.
     */
    widgets: Record<string, AdminLayoutWidgetPreference>
  }
}
