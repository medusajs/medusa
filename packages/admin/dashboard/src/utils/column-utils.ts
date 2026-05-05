import { HttpTypes } from "@medusajs/types"

export enum ColumnAlignment {
  LEFT = "left",
  CENTER = "center",
  RIGHT = "right",
}

const DEFAULT_COLUMN_ORDER = 500

/**
 * Determines the appropriate column alignment based on the column metadata
 */
export function getColumnAlignment(
  column: HttpTypes.AdminColumn
): ColumnAlignment {
  // Currency columns should be right-aligned
  if (column.semantic_type === "currency" || column.data_type === "currency") {
    return ColumnAlignment.RIGHT
  }

  // Number columns should be right-aligned (except identifiers)
  if (column.data_type === "number" && column.context !== "identifier") {
    return ColumnAlignment.RIGHT
  }

  // Total/amount/price columns should be right-aligned
  if (
    column.field.includes("total") ||
    column.field.includes("amount") ||
    column.field.includes("price")
  ) {
    return ColumnAlignment.RIGHT
  }

  // Country columns should be center-aligned
  if (column.field === "country" || column.field.includes("country_code")) {
    return ColumnAlignment.CENTER
  }

  // Default to left alignment
  return ColumnAlignment.LEFT
}

/**
 * Gets the initial column visibility state from API columns
 */
export function getInitialColumnVisibility(
  apiColumns: HttpTypes.AdminColumn[]
): Record<string, boolean> {
  const visibility: Record<string, boolean> = {}

  apiColumns.forEach((column) => {
    visibility[column.field] = column.default_visible
  })

  return visibility
}

/**
 * Gets the initial column order from API columns
 */
export function getInitialColumnOrder(
  apiColumns: HttpTypes.AdminColumn[]
): string[] {
  const sortedColumns = [...apiColumns].sort((a, b) => {
    const orderA = a.default_order ?? DEFAULT_COLUMN_ORDER
    const orderB = b.default_order ?? DEFAULT_COLUMN_ORDER
    return orderA - orderB
  })

  return sortedColumns.map((col) => col.field)
}
