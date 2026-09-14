import { HttpTypes } from "@medusajs/types"

/**
 * The path a quantity column reads its unit of measure from. The unit does not
 * always live on the row itself — on a reservation it hangs off the related
 * inventory item — so a column can point at it with a `unit_of_measure_path`
 * metadata entry.
 *
 * Shared with the cell renderer so the field that is requested is the field
 * that is read.
 */
export function getUnitOfMeasurePath(column?: {
  metadata?: Record<string, any> | null
}): string {
  return column?.metadata?.unit_of_measure_path ?? "unit_of_measure"
}

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

    // A quantity is rendered with its unit of measure, which the user has not
    // necessarily added as a column of its own.
    if (column.render_mode === "quantity") {
      requiredFieldsSet.add(getUnitOfMeasurePath(column))
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
