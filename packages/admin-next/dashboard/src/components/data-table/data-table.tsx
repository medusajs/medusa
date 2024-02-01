import { NoRecords } from "../common/empty-table-content"
import { DataTableQuery, DataTableQueryProps } from "./data-table-query"
import { DataTableRoot, DataTableRootProps } from "./data-table-root"
import { DataTableSkeleton } from "./data-table-skeleton"

interface DataTableProps<TData, TValue>
  extends DataTableRootProps<TData, TValue>,
    DataTableQueryProps {
  isLoading?: boolean
  rowCount: number
  queryObject?: Record<string, any>
}

export const DataTable = <TData, TValue>({
  table,
  columns,
  pagination,
  navigateTo,
  commands,
  count = 0,
  search = false,
  orderBy,
  filters,
  prefix,
  queryObject = {},
  rowCount,
  isLoading = false,
}: DataTableProps<TData, TValue>) => {
  if (isLoading) {
    return (
      <DataTableSkeleton
        columns={columns}
        rowCount={rowCount}
        searchable={search}
        filterable={!!filters?.length}
        orderBy={!!orderBy?.length}
        pagination={!!pagination}
      />
    )
  }

  const noQuery =
    Object.values(queryObject).filter((v) => Boolean(v)).length === 0
  const noResults = !isLoading && count === 0 && !noQuery
  const noRecords = !isLoading && count === 0 && noQuery

  if (noRecords) {
    return <NoRecords />
  }

  return (
    <div className="divide-y">
      <DataTableQuery
        search
        orderBy={["display_id", "created_at", "updated_at"]}
        filters={filters}
        prefix={prefix}
      />
      <DataTableRoot
        table={table}
        count={count}
        columns={columns}
        pagination
        navigateTo={navigateTo}
        commands={commands}
        noResults={noResults}
      />
    </div>
  )
}
