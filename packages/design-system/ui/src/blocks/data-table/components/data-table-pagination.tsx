"use client"

import * as React from "react"

import { useDataTableContext } from "@/blocks/data-table/context/use-data-table-context"
import { Skeleton } from "@/components/skeleton"
import { Table } from "@/components/table"

interface DataTablePaginationProps {
  /**
   * The translations for strings in the pagination component.
   */
  translations?: React.ComponentProps<typeof Table.Pagination>["translations"]
}

/**
 * This component adds a pagination component and functionality to the data table.
 */
const DataTablePagination = (props: DataTablePaginationProps) => {
  const { instance } = useDataTableContext()

  if (!instance.enablePagination) {
    throw new Error(
      "DataTable.Pagination was rendered but pagination is not enabled. Make sure to pass pagination to 'useDataTable'"
    )
  }

  if (instance.showSkeleton) {
    return <DataTablePaginationSkeleton />
  }

  return (
    <Table.Pagination
      translations={props.translations}
      className="shrink-0"
      canNextPage={instance.getCanNextPage()}
      canPreviousPage={instance.getCanPreviousPage()}
      pageCount={instance.getPageCount()}
      count={instance.rowCount}
      nextPage={instance.nextPage}
      previousPage={instance.previousPage}
      pageIndex={instance.pageIndex}
      pageSize={instance.pageSize}
    />
  )
}
DataTablePagination.displayName = "DataTable.Pagination"

const DataTablePaginationSkeleton = () => {
  return (
    <div>
      <div className="flex items-center justify-between p-4">
        <Skeleton className="h-7 w-[138px]" />
        <div className="flex items-center gap-x-2">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-7 w-11" />
          <Skeleton className="h-7 w-11" />
        </div>
      </div>
    </div>
  )
}

export { DataTablePagination }
export type { DataTablePaginationProps }

