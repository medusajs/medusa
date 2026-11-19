import {
  ColumnDef,
  OnChangeFn,
  PaginationState,
  Row,
  RowData,
  RowSelectionState,
  useTable,
} from "@tanstack/react-table"
import {
  DataTableFeatures,
  dataTableFeatures,
} from "../components/table/data-table/data-table-features"
import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"

type UseDataTableProps<TData extends RowData> = {
  data?: TData[]
  columns: ColumnDef<DataTableFeatures, TData, any>[]
  count?: number
  pageSize?: number
  enableRowSelection?:
    boolean | ((row: Row<DataTableFeatures, TData>) => boolean)
  rowSelection?: {
    state: RowSelectionState
    updater: OnChangeFn<RowSelectionState>
  }
  enablePagination?: boolean
  enableExpandableRows?: boolean
  getRowId?: (original: TData, index: number) => string
  getSubRows?: (original: TData) => TData[]
  meta?: Record<string, unknown>
  prefix?: string
}

export const useDataTable = <TData extends RowData>({
  data = [],
  columns,
  count = 0,
  pageSize: _pageSize = 20,
  enablePagination = true,
  enableRowSelection = false,
  enableExpandableRows = false,
  rowSelection: _rowSelection,
  getSubRows,
  getRowId,
  meta,
  prefix,
}: UseDataTableProps<TData>) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const offsetKey = `${prefix ? `${prefix}_` : ""}offset`
  const offset = searchParams.get(offsetKey)

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: offset ? Math.ceil(Number(offset) / _pageSize) : 0,
    pageSize: _pageSize,
  })
  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  )
  const [localRowSelection, setLocalRowSelection] = useState({})
  const rowSelection = _rowSelection?.state ?? localRowSelection
  const setRowSelection = _rowSelection?.updater ?? setLocalRowSelection

  useEffect(() => {
    if (!enablePagination) {
      return
    }

    const index = offset ? Math.ceil(Number(offset) / _pageSize) : 0

    if (index === pageIndex) {
      return
    }

    setPagination((prev) => ({
      ...prev,
      pageIndex: index,
    }))
  }, [offset, enablePagination, _pageSize, pageIndex])

  const onPaginationChange = (
    updater: (old: PaginationState) => PaginationState
  ) => {
    const state = updater(pagination)
    const { pageIndex, pageSize } = state

    setSearchParams((prev) => {
      if (!pageIndex) {
        prev.delete(offsetKey)
        return prev
      }

      const newSearch = new URLSearchParams(prev)
      newSearch.set(offsetKey, String(pageIndex * pageSize))

      return newSearch
    })

    setPagination(state)
    return state
  }

  const table = useTable({
    features: dataTableFeatures,
    data,
    columns,
    state: {
      rowSelection: rowSelection, // We always pass a selection state to the table even if it's not enabled
      pagination: enablePagination ? pagination : undefined,
    },
    pageCount: Math.ceil((count ?? 0) / pageSize),
    enableRowSelection,
    getRowId,
    getSubRows,
    onRowSelectionChange: enableRowSelection ? setRowSelection : undefined,
    onPaginationChange: enablePagination
      ? (onPaginationChange as OnChangeFn<PaginationState>)
      : undefined,
    enableExpanding: enableExpandableRows,
    manualPagination: true,
    meta,
  })

  return { table }
}
