import { clx } from "@medusajs/ui"
import { memo } from "react"
import { NoRecords } from "../../common/empty-table-content"
import { TableSkeleton } from "../../common/skeleton"
import { DataTableQuery, DataTableQueryProps } from "./data-table-query"
import { DataTableRoot, DataTableRootProps } from "./data-table-root"

interface DataTableProps<TData>
  extends Omit<DataTableRootProps<TData>, "noResults">,
    DataTableQueryProps {
  isLoading?: boolean
  pageSize: number
  queryObject?: Record<string, any>
}

// Maybe we should use the memoized version of DataTableRoot
// const MemoizedDataTableRoot = memo(DataTableRoot) as typeof DataTableRoot
const MemoizedDataTableQuery = memo(DataTableQuery)

export const DataTable = <TData,>({
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
  pageSize,
  isLoading = false,
  layout = "fit",
}: DataTableProps<TData>) => {
  if (isLoading) {
    return (
      <TableSkeleton
        layout={layout}
        rowCount={pageSize}
        search={search}
        filters={!!filters?.length}
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
    return (
      <NoRecords
        className={clx({
          "flex h-full flex-col overflow-hidden": layout === "fill",
        })}
      />
    )
  }

  return (
    <div
      className={clx("divide-y", {
        "flex h-full flex-col overflow-hidden": layout === "fill",
      })}
    >
      <MemoizedDataTableQuery
        search={search}
        orderBy={orderBy}
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
        layout={layout}
      />
    </div>
  )
}
