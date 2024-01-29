import { createContext } from "react"

type DataTableFacetedFilterContextValue = {
  removeFilter: (key: string) => void
  removeAllFilters: () => void
}

export const DataTableFacetedFilterContext =
  createContext<DataTableFacetedFilterContextValue | null>(null)
