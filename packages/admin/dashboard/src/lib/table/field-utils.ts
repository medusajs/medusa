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

  // Currency columns (e.g. "total") render their amount using the entity's
  // own currency, not a fixed one, so `currency_code` must be fetched
  // whenever such a column is visible, even if the user hasn't added it as a
  // column itself.
  const hasVisibleCurrencyColumn = visibleColumnObjects.some(
    (column) => column.data_type === "currency"
  )
  const entityHasCurrencyCode = apiColumns.some(
    (column) => column.field === "currency_code"
  )
  if (hasVisibleCurrencyColumn && entityHasCurrencyCode) {
    requiredFieldsSet.add("currency_code")
  }

  return Array.from(requiredFieldsSet).join(",")
}
