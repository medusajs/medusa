import { memo } from "react"
import { NoRecords } from "../../common/empty-table-content"
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

const MemoizedDataTableRoot = memo(DataTableRoot) as typeof DataTableRoot
const MemoizedDataTableQuery = memo(DataTableQuery)

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
      <MemoizedDataTableQuery
        search={search}
        orderBy={orderBy}
        filters={filters}
        prefix={prefix}
      />
      <MemoizedDataTableRoot
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
