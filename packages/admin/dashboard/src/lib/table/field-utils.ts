import { HttpTypes } from "@medusajs/types"

/**
 * Calculate required fields based on visible columns from API definitions.
 */
export function calculateRequiredFields(
  apiColumns: HttpTypes.AdminColumn[],
  visibleColumns: Record<string, boolean>
): string {
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
    // Virtual columns (selection, actions) have no backing data field and must
    // not be requested from the API.
    if (column.render_mode === "select" || column.render_mode === "actions") {
      return
    }

    if (column.computed) {
      // For computed columns, add all required and optional fields
      column.computed.required_fields?.forEach((field: string) =>
        requiredFieldsSet.add(field)
      )
      column.computed.optional_fields?.forEach((field: string) =>
        requiredFieldsSet.add(field)
      )
    } else {
      // Relationship field
      requiredFieldsSet.add(column.field)
    }
  })

  return Array.from(requiredFieldsSet).join(",")
}
