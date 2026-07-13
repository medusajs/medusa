import { HttpTypes } from "@medusajs/types"
import {
  DataTableColumnAlignment,
  DataTableColumnDef,
  DataTableEmptyStateProps,
  DataTableFilter,
} from "@medusajs/ui"
import { ReactNode } from "react"

/**
 * Adapter interface for configurable tables.
 * Defines how to fetch and display data for a specific entity type.
 */
export interface TableAdapter<TData> {
  /**
   * The entity type (e.g., "orders", "products", "customers")
   */
  entity: string

  /**
   * Hook to fetch data with the calculated required fields.
   * Called inside ConfigurableDataTable with the fields and search params.
   */
  useData: (
    fields: string,
    params: any
  ) => {
    data: TData[] | undefined
    count: number | undefined
    isLoading: boolean
    isError: boolean
    error: any
  }

  /**
   * Extract unique ID from a row. Defaults to row.id if not provided.
   */
  getRowId?: (row: TData) => string

  /**
   * Generate href for row navigation. Return undefined for non-clickable rows.
   */
  getRowHref?: (row: TData) => string | undefined

  /**
   * Explicit table filters configuration. If not provided, filters will be reolved dynamically from the API columns.
   */
  filters?: DataTableFilter[]

  /**
   * Transform API columns before use (e.g., disable sorting, exclude filters).
   * Applied immediately after fetching columns from API.
   * Returns a new array of columns with desired modifications.
   *
   * @param columns - The API columns to transform
   * @returns Transformed columns
   *
   * @example
   * transformColumns: (columns) => columns.map(col => ({
   *   ...col,
   *   sortable: col.field === 'status' ? false : col.sortable,
   *   filter: { ...col.filter, enabled: false }
   * }))
   */
  transformColumns?: (
    columns: HttpTypes.AdminColumn[]
  ) => HttpTypes.AdminColumn[]

  /**
   * Transform API columns to table columns.
   * If not provided, will use default column generation.
   */
  getColumns?: (apiColumns: any[]) => DataTableColumnDef<TData, any>[]

  /**
   * Override the alignment of a column's header and cell content.
   * Return undefined to fall back to the render mode's declared alignment,
   * and to the DataTable default when the render mode declares none.
   */
  getColumnAlignment?: (
    column: HttpTypes.AdminColumn
  ) => DataTableColumnAlignment | undefined

  /**
   * Empty state configuration
   */
  emptyState?: DataTableEmptyStateProps

  /**
   * Default page size
   */
  pageSize?: number

  /**
   * Query parameter prefix for URL state management
   */
  queryPrefix?: string

  /**
   * Optional entity display name for headings
   */
  entityName?: string

  /**
   * Domain-specific row actions. When provided, a trailing, toggleable
   * "actions" column is injected that renders this per row — typically the
   * domain's existing action-menu component (icon trigger + menu), which can
   * own its permissions, prompts and mutations.
   */
  renderRowActions?: (row: TData) => ReactNode

  /**
   * Default filters (filter id -> value) applied only when no saved view
   * configuration is active. Once a view is active, its filters win. Values
   * use the same shape as the filter's option value (e.g. `"false"` for a
   * boolean filter). Also used as the baseline for "unsaved changes".
   */
  defaultFilters?: Record<string, any>
}

/**
 * Field/id used for the injected virtual actions column.
 */
export const ACTIONS_COLUMN_FIELD = "actions"

/**
 * Build the synthetic column definition for the row actions column. It is
 * injected client-side (it does not come from the API) but is shaped like an
 * API column so it participates in column visibility, ordering and view
 * persistence like any other column. Rendered specially by
 * `useConfigurableTableColumns` via the adapter's `getRowActions`.
 */
export function createActionsColumn(name: string): HttpTypes.AdminColumn {
  return {
    id: ACTIONS_COLUMN_FIELD,
    name,
    field: ACTIONS_COLUMN_FIELD,
    sortable: false,
    hideable: true,
    default_visible: true,
    data_type: "string",
    semantic_type: "actions",
    context: "display",
    render_mode: "actions",
    // Keep the actions column last by default.
    default_order: 100000,
    filter: { enabled: false },
    category: "computed",
  }
}

/**
 * Helper to create a type-safe table adapter
 */
export function createTableAdapter<TData>(
  adapter: TableAdapter<TData>
): TableAdapter<TData> {
  return {
    // Provide smart defaults
    getRowId: (row: any) => row.id,
    pageSize: 20,
    queryPrefix: "",
    ...adapter,
  }
}
