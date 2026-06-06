import {
  DataTableColumnDef,
  DataTableEmptyStateProps,
  DataTableFilter,
} from "@zjedene-medusa/ui"
import { ColumnAdapter } from "../../hooks/table/columns/use-configurable-table-columns"

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
   * Table filters configuration
   */
  filters?: DataTableFilter[]

  /**
   * Transform API columns to table columns.
   * If not provided, will use default column generation.
   */
  getColumns?: (apiColumns: any[]) => DataTableColumnDef<TData, any>[]

  /**
   * Column adapter for customizing column behavior (alignment, formatting, etc.)
   * If not provided, will use entity's default column adapter if available.
   */
  columnAdapter?: ColumnAdapter<TData>

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
