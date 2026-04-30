/**
 * Render mode mapping utilities for column generation.
 * Maps field names and GraphQL types to appropriate render modes.
 */

/**
 * Common render mode type that can be extended by plugins.
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
  | string

/**
 * Maps GraphQL scalar types to render modes.
 */
const TYPE_TO_RENDER_MODE: Record<string, RenderMode> = {
  // Primitive types
  boolean: "boolean",
  text: "text",
  number: "number",

  // Medusa scalar types
  dateTime: "datetime",
  json: "json",
  id: "id",

  // GraphQL scalars
  String: "text",
  Int: "number",
  Float: "number",
  Boolean: "boolean",
  DateTime: "datetime",
  JSON: "json",
  ID: "id",
}

/**
 * Field name patterns that override the default render mode.
 */
interface FieldPatternOverride {
  pattern: RegExp
  renderMode: RenderMode
  semanticType: string
}

const FIELD_PATTERN_OVERRIDES: FieldPatternOverride[] = [
  // Timestamps
  { pattern: /_at$/, renderMode: "datetime", semanticType: "timestamp" },
  {
    pattern: /^created_at$/,
    renderMode: "datetime",
    semanticType: "timestamp",
  },
  {
    pattern: /^updated_at$/,
    renderMode: "datetime",
    semanticType: "timestamp",
  },
  {
    pattern: /^deleted_at$/,
    renderMode: "datetime",
    semanticType: "timestamp",
  },
  { pattern: /_date$/, renderMode: "date", semanticType: "date" },

  // Currency/amounts
  { pattern: /total$/, renderMode: "currency", semanticType: "currency" },
  { pattern: /amount$/, renderMode: "currency", semanticType: "currency" },
  { pattern: /price$/, renderMode: "currency", semanticType: "currency" },
  { pattern: /^subtotal$/, renderMode: "currency", semanticType: "currency" },
  { pattern: /^tax_total$/, renderMode: "currency", semanticType: "currency" },
  {
    pattern: /^shipping_total$/,
    renderMode: "currency",
    semanticType: "currency",
  },
  {
    pattern: /^discount_total$/,
    renderMode: "currency",
    semanticType: "currency",
  },

  // Status fields
  { pattern: /status$/, renderMode: "status", semanticType: "status" },
  { pattern: /^state$/, renderMode: "status", semanticType: "status" },
  {
    pattern: /^payment_status$/,
    renderMode: "status",
    semanticType: "status",
  },
  {
    pattern: /^fulfillment_status$/,
    renderMode: "status",
    semanticType: "status",
  },

  // Contact info
  { pattern: /^email$/, renderMode: "email", semanticType: "contact" },
  { pattern: /_email$/, renderMode: "email", semanticType: "contact" },
  { pattern: /^phone$/, renderMode: "phone", semanticType: "contact" },
  { pattern: /_phone$/, renderMode: "phone", semanticType: "contact" },

  // Location
  {
    pattern: /country_code$/,
    renderMode: "country_code",
    semanticType: "location",
  },
  {
    pattern: /^currency_code$/,
    renderMode: "text",
    semanticType: "currency_code",
  },

  // URLs and images
  { pattern: /^url$/, renderMode: "url", semanticType: "url" },
  { pattern: /_url$/, renderMode: "url", semanticType: "url" },
  { pattern: /^thumbnail$/, renderMode: "image", semanticType: "image" },
  { pattern: /^avatar$/, renderMode: "image", semanticType: "image" },
  { pattern: /_image$/, renderMode: "image", semanticType: "image" },

  // Identifiers
  { pattern: /^id$/, renderMode: "id", semanticType: "identifier" },
  { pattern: /_id$/, renderMode: "id", semanticType: "identifier" },
  { pattern: /^display_id$/, renderMode: "id", semanticType: "identifier" },
  {
    pattern: /^custom_display_id$/,
    renderMode: "id",
    semanticType: "identifier",
  },
  { pattern: /^handle$/, renderMode: "text", semanticType: "identifier" },
  { pattern: /^code$/, renderMode: "text", semanticType: "identifier" },

  // Counts
  { pattern: /count$/, renderMode: "number", semanticType: "count" },
  { pattern: /quantity$/, renderMode: "number", semanticType: "count" },

  // Booleans
  { pattern: /^is_/, renderMode: "boolean", semanticType: "boolean" },
  { pattern: /^has_/, renderMode: "boolean", semanticType: "boolean" },
  { pattern: /^can_/, renderMode: "boolean", semanticType: "boolean" },

  // Metadata
  { pattern: /^metadata$/, renderMode: "json", semanticType: "metadata" },
]

/**
 * Infer the render mode from a field name and GraphQL type.
 */
export function inferRenderMode(
  fieldName: string,
  graphqlTypeName?: string
): { renderMode: RenderMode; semanticType: string } {
  // Check field name patterns first (more specific)
  for (const override of FIELD_PATTERN_OVERRIDES) {
    if (override.pattern.test(fieldName)) {
      return {
        renderMode: override.renderMode,
        semanticType: override.semanticType,
      }
    }
  }

  // Fall back to type mapping
  if (graphqlTypeName && TYPE_TO_RENDER_MODE[graphqlTypeName]) {
    return {
      renderMode: TYPE_TO_RENDER_MODE[graphqlTypeName],
      semanticType: graphqlTypeName.toLowerCase(),
    }
  }

  // Default to text
  return {
    renderMode: "text",
    semanticType: "string",
  }
}

/**
 * Column data type as used in AdminColumn.
 */
export type ColumnDataType =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "currency"
  | "enum"
  | "object"

/**
 * Map a data type to its default render mode.
 */
export function dataTypeToRenderMode(dataType: ColumnDataType): RenderMode {
  switch (dataType) {
    case "string":
      return "text"
    case "number":
      return "number"
    case "boolean":
      return "boolean"
    case "date":
      return "datetime"
    case "currency":
      return "currency"
    case "enum":
      return "status"
    case "object":
      return "json"
    default:
      return "text"
  }
}

/**
 * Infer the data type from a GraphQL scalar type name.
 */
export function inferDataType(
  graphqlTypeName: string,
  fieldName: string
): ColumnDataType {
  // Check field patterns first
  if (
    /_at$/.test(fieldName) ||
    /^created_at$|^updated_at$|^deleted_at$/.test(fieldName)
  ) {
    return "date"
  }
  if (/total$|amount$|price$/.test(fieldName)) {
    return "currency"
  }
  if (/status$|^state$/.test(fieldName)) {
    return "enum"
  }
  if (/^is_|^has_|^can_/.test(fieldName)) {
    return "boolean"
  }
  if (/^metadata$/.test(fieldName)) {
    return "object"
  }

  // Map GraphQL types
  switch (graphqlTypeName) {
    case "String":
    case "ID":
      return "string"
    case "Int":
    case "Float":
      return "number"
    case "Boolean":
      return "boolean"
    case "DateTime":
      return "date"
    case "JSON":
      return "object"
    default:
      return "string"
  }
}
