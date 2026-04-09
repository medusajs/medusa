import { RelationshipFilterConfig } from "@medusajs/framework/types"
import { ColumnDataType } from "./render-mode-mapper"

/**
 * Data types that are not filterable by default.
 */
const NON_FILTERABLE_TYPES: ColumnDataType[] = ["object"]

/**
 * Field name patterns that are not filterable.
 */
const NON_FILTERABLE_PATTERNS: RegExp[] = [
  /^raw_/, // Raw data fields
  /^metadata$/, // Metadata JSON fields
  /_link$/, // Link fields
]

/**
 * Semantic types that are not filterable.
 */
const NON_FILTERABLE_SEMANTIC_TYPES: string[] = ["object", "json", "metadata"]

/**
 * Filter operators by data type.
 */
const FILTER_OPERATORS_BY_TYPE: Record<ColumnDataType, string[]> = {
  string: ["eq", "ne", "contains", "startsWith", "endsWith", "in", "nin"],
  number: ["eq", "ne", "gt", "gte", "lt", "lte", "in", "nin"],
  boolean: ["eq"],
  date: ["eq", "ne", "gt", "gte", "lt", "lte"],
  currency: ["eq", "ne", "gt", "gte", "lt", "lte"],
  enum: ["eq", "ne", "in", "nin"],
  object: [],
}

/**
 * Check if a field is filterable based on name, data type, and whether it's computed.
 */
export function isFilterable(
  fieldName: string,
  dataType: ColumnDataType,
  isComputed: boolean,
  semanticType?: string
): boolean {
  // Computed columns are not filterable
  if (isComputed) {
    return false
  }

  // Check non-filterable types
  if (NON_FILTERABLE_TYPES.includes(dataType)) {
    return false
  }

  // Check field name patterns
  for (const pattern of NON_FILTERABLE_PATTERNS) {
    if (pattern.test(fieldName)) {
      return false
    }
  }

  // Check semantic types
  if (semanticType && NON_FILTERABLE_SEMANTIC_TYPES.includes(semanticType)) {
    return false
  }

  return true
}

/**
 * Get available filter operators for a data type.
 */
export function getFilterOperators(dataType: ColumnDataType): string[] {
  return FILTER_OPERATORS_BY_TYPE[dataType] || []
}

/**
 * Filter configuration for a column.
 */
export interface ColumnFilterConfig {
  enabled: boolean
  operators?: string[]
  enumValues?: string[]
  relationship?: RelationshipFilterConfig
}

/**
 * Build the filter configuration for a column.
 */
export function buildFilterConfig(
  fieldName: string,
  dataType: ColumnDataType,
  isComputed: boolean,
  semanticType?: string,
  enumValues?: string[]
): ColumnFilterConfig {
  const filterable = isFilterable(fieldName, dataType, isComputed, semanticType)

  if (!filterable) {
    return { enabled: false }
  }

  const operators = getFilterOperators(dataType)

  return {
    enabled: true,
    operators: operators.length > 0 ? operators : undefined,
    enumValues: dataType === "enum" ? enumValues : undefined,
  }
}

/**
 * Default field filter rules applied to all entities.
 */
export interface FieldFilterRules {
  /**
   * Field name suffixes to exclude.
   */
  excludeSuffixes: string[]

  /**
   * Field name prefixes to exclude.
   */
  excludePrefixes: string[]

  /**
   * Specific field names to exclude.
   */
  excludeFields: string[]
}

/**
 * Global default filter rules applied to all entities.
 */
export const DEFAULT_FIELD_FILTER_RULES: FieldFilterRules = {
  excludeSuffixes: ["_link"],
  excludePrefixes: ["raw_"],
  excludeFields: [],
}

/**
 * Check if a field should be excluded based on filter rules.
 */
export function shouldExcludeField(
  fieldName: string,
  filterRules: FieldFilterRules = DEFAULT_FIELD_FILTER_RULES
): boolean {
  // Check if field matches any exclude suffixes
  if (
    filterRules.excludeSuffixes?.some((suffix) => fieldName.endsWith(suffix))
  ) {
    return true
  }

  // Check if field matches any exclude prefixes
  if (
    filterRules.excludePrefixes?.some((prefix) => fieldName.startsWith(prefix))
  ) {
    return true
  }

  // Check if field is in the exclude fields list
  if (filterRules.excludeFields?.includes(fieldName)) {
    return true
  }

  return false
}
