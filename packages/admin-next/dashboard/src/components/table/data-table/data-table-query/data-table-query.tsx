import { Filter } from ".."
import { DataTableFilter } from "../data-table-filter"
import { DataTableOrderBy } from "../data-table-order-by"
import { DataTableSearch } from "../data-table-search"

export interface DataTableQueryProps {
  search?: boolean
  orderBy?: (string | number)[]
  filters?: Filter[]
  prefix?: string
}

export const DataTableQuery = ({
  search,
  orderBy,
  filters,
  prefix,
}: DataTableQueryProps) => {
  return (
    (search || orderBy || filters || prefix) && (
      <div className="flex items-start justify-between gap-x-4 px-6 py-4">
        <div className="w-full max-w-[60%]">
          {filters && filters.length > 0 && (
            <DataTableFilter filters={filters} prefix={prefix} />
          )}
        </div>
        <div className="flex shrink-0 items-center gap-x-2">
          {search && <DataTableSearch prefix={prefix} />}
          {orderBy && <DataTableOrderBy keys={orderBy} prefix={prefix} />}
        </div>
      </div>
    )
  )
}
