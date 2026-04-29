/**
 * Parsed fields structure after processing field strings
 */
export interface ParsedFields {
  /** Regular fields to select */
  fields: Set<string>
  /** Star fields representing full relation selections (e.g., *product.variants) */
  starFields: Set<string>
}

/**
 * Context passed to field filters for determining access
 */
export interface FieldFilterContext {
  /** The main entity being queried (e.g., "product", "order") */
  entity: string
  /** Parsed fields to filter */
  parsedFields: ParsedFields
}

/**
 * Interface for field filters following the Strategy pattern
 * Allows adding new field filtering logic without modifying prepareListQuery
 */
export interface IFieldFilter {
  /**
   * Returns fields that should be excluded from the query
   * @param context - The filter context containing entity and parsed fields
   * @returns Array of field names that are not allowed
   */
  getNotAllowedFields(context: FieldFilterContext): Promise<string[]> | string[]
}

export { FieldParser } from "./field-parser"
export { AllowedFieldFilter, RestrictedFieldFilter } from "./field-validator"
