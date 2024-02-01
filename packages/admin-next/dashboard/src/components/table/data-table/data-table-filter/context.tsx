import { createContext, useContext } from "react"

type DataTableFilterContextValue = {
  removeFilter: (key: string) => void
  removeAllFilters: () => void
}

export const DataTableFilterContext =
  createContext<DataTableFilterContextValue | null>(null)

export const useDataTableFilterContext = () => {
  const ctx = useContext(DataTableFilterContext)
  if (!ctx) {
    throw new Error(
      "useDataTableFacetedFilterContext must be used within a DataTableFacetedFilter"
    )
  }
  return ctx
}
