"use client"

import * as React from "react"

import { clx } from "@/utils/clx"

import { DataTableCommandBar } from "./components/data-table-command-bar"
import { DataTableColumnVisibilityMenu } from "./components/data-table-column-visibility-menu"
import { DataTableFilterBar } from "./components/data-table-filter-bar"
import { DataTableFilterMenu } from "./components/data-table-filter-menu"
import { DataTablePagination } from "./components/data-table-pagination"
import { DataTableSearch } from "./components/data-table-search"
import { DataTableSortingMenu } from "./components/data-table-sorting-menu"
import { DataTableTable } from "./components/data-table-table"
import { DataTableToolbar } from "./components/data-table-toolbar"
import { DataTableContextProvider } from "./context/data-table-context-provider"
import { DataTableRowData } from "./types"
import { UseDataTableReturn } from "./use-data-table"

/**
 * The props of the `DataTable` component.
 */
interface DataTableProps<TData extends DataTableRowData> {
  /**
   * The instance returned by the `useDataTable` hook.
   */
  instance: UseDataTableReturn<TData>
  /**
   * The children of the component.
   */
  children?: React.ReactNode
  /**
   * Additional classes to pass to the wrapper `div` of the component.
   */
  className?: string
}

/**
 * This component creates a data table with filters, pagination, sorting, and more.
 * It's built on top of the `Table` component while expanding its functionality.
 * The `DataTable` is useful to create tables similar to those in the Medusa Admin dashboard.
 */
const Root = <TData extends DataTableRowData>({
  instance,
  children,
  className,
}: DataTableProps<TData>) => {
  return (
    <DataTableContextProvider instance={instance}>
      <div className={clx("relative flex min-h-0 flex-1 flex-col", className)}>
        {children}
      </div>
    </DataTableContextProvider>
  )
}
Root.displayName = "DataTable"

const DataTable = Object.assign(Root, {
  Table: DataTableTable,
  Toolbar: DataTableToolbar,
  Search: DataTableSearch,
  SortingMenu: DataTableSortingMenu,
  FilterMenu: DataTableFilterMenu,
  FilterBar: DataTableFilterBar,
  ColumnVisibilityMenu: DataTableColumnVisibilityMenu,
  Pagination: DataTablePagination,
  CommandBar: DataTableCommandBar,
})

export { DataTable }
export type { DataTableProps }
