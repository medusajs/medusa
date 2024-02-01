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
    <div className="flex items-start justify-between px-6 py-4">
      <div className="max-w-[60%] w-full">
        {filters && filters.length > 0 && (
          <DataTableFilter filters={filters} prefix={prefix} />
        )}
      </div>
      <div className="flex items-center gap-x-2 shrink-0">
        {search && <DataTableSearch prefix={prefix} />}
        {orderBy && <DataTableOrderBy keys={orderBy} prefix={prefix} />}
      </div>
    </div>
  )
}
