import { HttpTypes } from "@medusajs/types"
import { getEntityDefaultFields } from "./entity-defaults"

/**
 * Calculates the required fields based on visible columns and entity defaults
 */
export function calculateRequiredFields(
  entity: string,
  apiColumns: HttpTypes.AdminColumn[] | undefined,
  visibleColumns: Record<string, boolean>
): string {
  // Get entity-specific default fields
  const defaults = getEntityDefaultFields(entity)
  const defaultFields = defaults.formatted

  if (!apiColumns?.length) {
    return defaultFields
  }

  // Get all visible columns
  const visibleColumnObjects = apiColumns.filter((column) => {
    // If visibleColumns has data, use it; otherwise use default_visible
    if (Object.keys(visibleColumns).length > 0) {
      return visibleColumns[column.field] === true
    }
    return column.default_visible
  })

  // Collect all required fields from visible columns
  const requiredFieldsSet = new Set<string>()

  visibleColumnObjects.forEach((column) => {
    if (column.computed) {
      // For computed columns, add all required and optional fields
      column.computed.required_fields?.forEach((field: string) =>
        requiredFieldsSet.add(field)
      )
      column.computed.optional_fields?.forEach((field: string) =>
        requiredFieldsSet.add(field)
      )
    } else if (!column.field.includes(".")) {
      // Direct field
      requiredFieldsSet.add(column.field)
    } else {
      // Relationship field
      requiredFieldsSet.add(column.field)
    }
  })

  // Separate relationship fields from direct fields
  const allRequiredFields = Array.from(requiredFieldsSet)
  const visibleRelationshipFields = allRequiredFields.filter((field) =>
    field.includes(".")
  )
  const visibleDirectFields = allRequiredFields.filter(
    (field) => !field.includes(".")
  )

  // Check which relationship fields need to be added
  const additionalRelationshipFields = visibleRelationshipFields.filter(
    (field) => {
      const [relationName] = field.split(".")
      const isAlreadyCovered = defaults.relations.some(
        (rel) => rel === `*${relationName}` || rel === relationName
      )
      return !isAlreadyCovered
    }
  )

  // Check which direct fields need to be added
  const additionalDirectFields = visibleDirectFields.filter((field) => {
    const isAlreadyIncluded = (
      defaults.properties as readonly string[]
    ).includes(field)
    return !isAlreadyIncluded
  })

  // Combine all additional fields
  const additionalFields = [
    ...additionalRelationshipFields,
    ...additionalDirectFields,
  ]

  // Combine default fields with additional needed fields
  if (additionalFields.length > 0) {
    return `${defaultFields},${additionalFields.join(",")}`
  }

  return defaultFields
}
