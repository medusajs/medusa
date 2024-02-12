import {
  ColumnDef,
  OnChangeFn,
  PaginationState,
  Row,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"

type UseDataTableProps<TData> = {
  data?: TData[]
  columns: ColumnDef<TData, any>[]
  count?: number
  pageSize?: number
  enableRowSelection?: boolean | ((row: Row<TData>) => boolean)
  enablePagination?: boolean
  getRowId?: (original: TData, index: number) => string
  meta?: Record<string, unknown>
  prefix?: string
}

export const useDataTable = <TData,>({
  data = [],
  columns,
  count = 0,
  pageSize: _pageSize = 50,
  enablePagination = true,
  enableRowSelection = false,
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
  const [rowSelection, setRowSelection] = useState({})

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

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
      pagination: enablePagination ? pagination : undefined,
    },
    pageCount: Math.ceil((count ?? 0) / pageSize),
    enableRowSelection,
    getRowId,
    onRowSelectionChange: enableRowSelection ? setRowSelection : undefined,
    onPaginationChange: enablePagination
      ? (onPaginationChange as OnChangeFn<PaginationState>)
      : undefined,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: enablePagination
      ? getPaginationRowModel()
      : undefined,
    manualPagination: enablePagination ? true : undefined,
    meta,
  })

  return { table }
}
