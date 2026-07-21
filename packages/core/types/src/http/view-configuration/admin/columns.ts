import { RelationshipFilterConfig, RenderMode } from "./property-descriptor"

export interface AdminColumn {
  /**
   * The column's unique identifier (e.g., "display_id", "customer.email").
   */
  id: string
  /**
   * The display name for the column.
   */
  name: string
  /**
   * Description of the column.
   */
  description?: string
  /**
   * The field path to access the data.
   */
  field: string
  /**
   * Whether the column can be sorted.
   */
  sortable: boolean
  /**
   * Whether the column can be hidden.
   */
  hideable: boolean
  /**
   * Whether the column is visible by default.
   */
  default_visible: boolean
  /**
   * The data type of the column.
   */
  data_type:
    | "string"
    | "number"
    | "boolean"
    | "date"
    | "currency"
    | "enum"
    | "object"
  /**
   * The semantic type provides additional context about the data.
   */
  semantic_type?: string
  /**
   * Additional context about the column.
   */
  context?: string
  /**
   * Information about computed columns.
   */
  computed?: {
    type: string
    required_fields: string[]
    optional_fields: string[]
    metadata: Record<string, any>
  }
  /**
   * Information about relationship columns.
   */
  relationship?: {
    entity: string
    field: string
  }
  /**
   * Default order for sorting columns.
   */
  default_order?: number
  /**
   * Category for grouping columns.
   */
  category?:
    | "identifier"
    | "timestamp"
    | "status"
    | "metric"
    | "relationship"
    | "metadata"
    | "field"
    | "computed"
  /**
   * Render mode hint for the UI to determine how to display this column.
   */
  render_mode?: RenderMode
  /**
   * Filter configuration for this column.
   */
  filter?: {
    /**
     * Whether filtering is enabled for this column.
     */
    enabled: boolean
    /**
     * Available filter operators.
     */
    operators?: string[]
    /**
     * Enum values if applicable.
     */
    enumValues?: string[]
    /**
     * Relationship filter config for dropdown selection.
     */
    relationship?: RelationshipFilterConfig
  }
  /**
   * Source information about where this column comes from.
   */
  source?: {
    /**
     * Module name.
     */
    module: string
    /**
     * Entity name.
     */
    entity: string
  }
  /**
   * Whether this column uses a custom user-defined label.
   */
  custom_label?: boolean
  /**
   * ID of the PropertyLabel record if custom label is used.
   */
  label_id?: string
}

export interface AdminViewsEntityColumnsResponse {
  /**
   * The list of available columns for the entity.
   */
  columns: AdminColumn[]
}
