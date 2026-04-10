/**
 * Relationship filter configuration utilities.
 * Configures dropdown filters for relationship fields.
 */

import { GraphQLObjectType, isScalarType } from "@medusajs/framework/utils"
import {
  SchemaTypeMap,
  getUnderlyingType,
  toKebabCasePlural,
} from "./entity-discovery"

/**
 * Configuration for a relationship filter.
 */
export interface RelationshipFilterDefinition {
  /**
   * The relationship field (e.g., "sales_channels").
   */
  field: string

  /**
   * Related entity name (e.g., "SalesChannel").
   */
  relatedEntity: string

  /**
   * Field to use as filter value (e.g., "id").
   */
  valueField: string

  /**
   * Field to display in dropdown (e.g., "name").
   */
  displayField: string

  /**
   * Whether multiple selection is allowed.
   */
  multiple: boolean

  /**
   * API endpoint to fetch options (e.g., "/admin/sales-channels").
   */
  endpoint?: string
}

/**
 * Relationship filter config as returned in column metadata.
 */
export interface RelationshipFilterConfig {
  entity: string
  value_field: string
  display_field: string
  multiple: boolean
  endpoint: string
}

/**
 * Maps entity names to their admin API endpoints.
 *
 * Most endpoints follow the convention: EntityName → /admin/{kebab-case-plural}
 * e.g., SalesChannel → /admin/sales-channels
 *
 * Only entities that DON'T follow this convention need to be listed here.
 * The `inferOptionsEndpoint` function will auto-generate endpoints for unlisted entities.
 */
export const ENTITY_ENDPOINT_MAP: Record<string, string> = {
  // ProductCollection uses /admin/collections instead of /admin/product-collections
  ProductCollection: "/admin/collections",
}

/**
 * Infer the API endpoint for fetching filter options.
 */
export function inferOptionsEndpoint(entityName: string): string {
  if (ENTITY_ENDPOINT_MAP[entityName]) {
    return ENTITY_ENDPOINT_MAP[entityName]
  }

  // Auto-generate: "SalesChannel" → "/admin/sales-channels"
  return `/admin/${toKebabCasePlural(entityName)}`
}

/**
 * Built-in relationship filter configurations for known entities.
 */
export const RELATIONSHIP_FILTER_OVERRIDES: Record<
  string,
  RelationshipFilterDefinition[]
> = {
  Product: [
    {
      field: "sales_channels",
      relatedEntity: "SalesChannel",
      valueField: "id",
      displayField: "name",
      multiple: true,
    },
    {
      field: "collection",
      relatedEntity: "ProductCollection",
      valueField: "id",
      displayField: "title",
      multiple: false,
    },
    {
      field: "type",
      relatedEntity: "ProductType",
      valueField: "id",
      displayField: "value",
      multiple: false,
    },
    {
      field: "tags",
      relatedEntity: "ProductTag",
      valueField: "id",
      displayField: "value",
      multiple: true,
    },
  ],
  Order: [
    {
      field: "region",
      relatedEntity: "Region",
      valueField: "id",
      displayField: "name",
      multiple: false,
    },
  ],
  Customer: [
    {
      field: "groups",
      relatedEntity: "CustomerGroup",
      valueField: "id",
      displayField: "name",
      multiple: true,
    },
  ],
}

/**
 * Preferred display field names, in order of priority.
 * Used when inferring the display field from the schema.
 */
const PREFERRED_DISPLAY_FIELDS = [
  "name",
  "title",
  "value",
  "label",
  "email",
  "display_id",
  "display_name",
]

/**
 * Infer the best display field from an entity's GraphQL type.
 * Looks for string fields, preferring known display field names.
 */
function inferDisplayField(
  relatedEntityName: string,
  schemaTypeMap?: SchemaTypeMap
): string {
  const defaultField = "name"

  if (!schemaTypeMap) {
    return defaultField
  }

  const relatedType = schemaTypeMap[relatedEntityName]
  if (!relatedType || !(relatedType instanceof GraphQLObjectType)) {
    return defaultField
  }

  const fields = relatedType.getFields()
  const stringFields: string[] = []

  for (const [fieldName, fieldDef] of Object.entries(fields)) {
    const fieldType = (fieldDef as any).type
    const underlyingType = getUnderlyingType(fieldType)

    // Check if it's a String scalar (not ID)
    if (isScalarType(underlyingType) && underlyingType.name === "String") {
      stringFields.push(fieldName)
    }
  }

  // Return the first preferred field that exists, or the first string field
  const preferredMatch = PREFERRED_DISPLAY_FIELDS.find((pf) =>
    stringFields.includes(pf)
  )

  return preferredMatch ?? stringFields[0] ?? defaultField
}

/**
 * Get the relationship filter configuration for a field.
 */
export function getRelationshipFilterConfig(
  entityName: string,
  fieldName: string,
  relatedEntityName: string,
  isMultiple: boolean,
  schemaTypeMap?: SchemaTypeMap
): RelationshipFilterConfig | null {
  // Check if we have a predefined configuration
  const entityOverrides = RELATIONSHIP_FILTER_OVERRIDES[entityName]
  if (entityOverrides) {
    const override = entityOverrides.find((o) => o.field === fieldName)
    if (override) {
      return {
        entity: override.relatedEntity,
        value_field: override.valueField,
        display_field: override.displayField,
        multiple: override.multiple,
        endpoint:
          override.endpoint ?? inferOptionsEndpoint(override.relatedEntity),
      }
    }
  }

  // Auto-generate configuration with inferred display field
  const displayField = inferDisplayField(relatedEntityName, schemaTypeMap)

  return {
    entity: relatedEntityName,
    value_field: "id",
    display_field: displayField,
    multiple: isMultiple,
    endpoint: inferOptionsEndpoint(relatedEntityName),
  }
}
