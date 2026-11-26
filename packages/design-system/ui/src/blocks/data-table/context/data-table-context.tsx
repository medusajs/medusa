import { createContext } from "react"
import { DataTableRowData } from "../types"
import { UseDataTableReturn } from "../use-data-table"

export interface DataTableContextValue<TData extends DataTableRowData> {
  instance: UseDataTableReturn<TData>
  enableColumnVisibility: boolean
  enableColumnOrder: boolean
}

export const DataTableContext =
  createContext<DataTableContextValue<any> | null>(null)
