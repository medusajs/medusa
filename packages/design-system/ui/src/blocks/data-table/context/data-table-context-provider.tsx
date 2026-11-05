"use client"

import * as React from "react"

import { DataTableRowData } from "../types"
import { UseDataTableReturn } from "../use-data-table"
import { DataTableContext } from "./data-table-context"

type DataTableContextProviderProps<TData extends DataTableRowData> = {
  instance: UseDataTableReturn<TData>
  children: React.ReactNode
}

const DataTableContextProvider = <TData extends DataTableRowData>({
  instance,
  children,
}: DataTableContextProviderProps<TData>) => {
  return (
    <DataTableContext.Provider 
      value={{ 
        instance,
        enableColumnVisibility: instance.enableColumnVisibility,
        enableColumnOrder: instance.enableColumnOrder
      }}
    >
      {children}
    </DataTableContext.Provider>
  )
}

export { DataTableContextProvider }
