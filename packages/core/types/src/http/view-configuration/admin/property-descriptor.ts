/**
 * Data types supported by properties.
 */
export type PropertyDataType =
  | "string"
  | "number"
  | "bigNumber"
  | "float"
  | "boolean"
  | "date"
  | "dateTime"
  | "currency"
  | "enum"
  | "json"
  | "object"
  | "array"
  | "id"

/**
 * Render modes determine how a property should be displayed in the UI.
 * This is extensible - custom render modes can be registered.
 */
export type RenderMode =
  | "text"
  | "number"
  | "currency"
  | "date"
  | "datetime"
  | "boolean"
  | "status"
  | "badge"
  | "badge_list"
  | "count"
  | "id"
  | "email"
  | "phone"
  | "url"
  | "image"
  | "json"
  | "country_code"
  | "address"
  | "customer_name"
  | "product_info"
  | "address_summary"
  | "sales_channels_list"
  | string // extensible

/**
 * Filter configuration for a property.
 */
export interface PropertyFilterConfig {
  /**
   * Whether the property can be filtered.
   */
  filterable: boolean

  /**
   * Available filter operators for this property.
   */
  operators?: string[]

  /**
   * Enum values if the property is an enum type.
   */
  enumValues?: string[]
}

/**
 * Configuration for relationship-based dropdown filters.
 */
export interface RelationshipFilterConfig {
  /**
   * Related entity name (e.g., "SalesChannel").
   */
  entity: string

  /**
   * Field to use as filter value (e.g., "id").
   */
  value_field: string

  /**
   * Field to display in dropdown (e.g., "name").
   */
  display_field: string

  /**
   * Whether multiple selection is allowed.
   */
  multiple: boolean

  /**
   * API endpoint to fetch options (e.g., "/admin/sales-channels").
   */
  endpoint: string

  /**
   * Key to use for filtering the relationship. If not provided, the column field is used.
   */
  filter_key?: string
}

/**
 * Full property descriptor with all metadata.
 */
export interface PropertyDescriptor {
  /**
   * Property name/path (e.g., "display_id", "customer.email").
   */
  name: string

  /**
   * Human-readable display name.
   */
  displayName: string

  /**
   * The data type of the property.
   */
  dataType: PropertyDataType

  /**
   * How the property should be rendered in the UI.
   */
  renderMode: RenderMode

  /**
   * Whether the property can be null.
   */
  nullable: boolean

  /**
   * Whether this is a computed/derived property.
   */
  computed: boolean

  /**
   * Filter configuration for this property.
   */
  filter: PropertyFilterConfig

  /**
   * Whether the property can be sorted.
   */
  sortable: boolean

  /**
   * Optional semantic type for additional context.
   */
  semanticType?: string

  /**
   * Relationship information if this is a relationship field.
   */
  relationship?: {
    type: string
    entity: string
    foreignKey?: string
  }

  /**
   * Source information about where this property comes from.
   */
  source: {
    module: string
    entity: string
  }
}

/**
 * Describes an entity that can be used for view configurations.
 */
export interface EntityDescriptor {
  /**
   * Entity name in PascalCase (e.g., "Order").
   */
  name: string

  /**
   * Plural/route key (e.g., "orders").
   */
  pluralName: string

  /**
   * Module this entity belongs to.
   */
  module: string

  /**
   * GraphQL type name.
   */
  graphqlType: string

  /**
   * Properties available on this entity.
   */
  properties: PropertyDescriptor[]

  /**
   * Primary key field(s).
   */
  primaryKeys: string[]

  /**
   * Linkable keys for joining with other entities.
   */
  linkableKeys: Record<string, string>
}

/**
 * Response for listing available entities.
 */
export interface AdminEntityListResponse {
  /**
   * List of available entities.
   */
  entities: AdminEntityInfo[]
}

/**
 * Brief info about an entity for listing.
 */
export interface AdminEntityInfo {
  /**
   * Entity name in PascalCase.
   */
  name: string

  /**
   * Plural/route key.
   */
  pluralName: string

  /**
   * Module this entity belongs to.
   */
  module: string

  /**
   * Number of properties on this entity.
   */
  propertyCount: number

  /**
   * Whether this entity has custom overrides.
   */
  hasOverrides: boolean
}
