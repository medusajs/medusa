import {
  ColumnDef,
  PaginationState,
  Row,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"

type UseDataTableProps<TData, TValue> = {
  data?: TData[]
  columns: ColumnDef<TData, TValue>[]
  count?: number
  pageSize?: number
  enableRowSelection?: boolean | ((row: Row<TData>) => boolean)
  enablePagination?: boolean
  getRowId?: (original: TData, index: number) => string
  prefix?: string
}

export const useDataTable = <TData, TValue>({
  data = [],
  columns,
  count = 0,
  pageSize: _pageSize = 50,
  enablePagination = true,
  enableRowSelection = false,
  getRowId,
  prefix,
}: UseDataTableProps<TData, TValue>) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialOffset = searchParams.get(`${prefix ? `${prefix}_` : ""}offset`)

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: initialOffset ? Math.ceil(Number(initialOffset) / _pageSize) : 0,
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

    if (!pageIndex) {
      setSearchParams((prev) => {
        prev.delete(`${prefix ? `${prefix}_` : ""}offset`)
        return prev
      })

      return
    }

    setSearchParams((prev) => {
      prev.set(`${prefix ? `${prefix}_` : ""}offset`, `${pageIndex * pageSize}`)
      return prev
    })
  }, [pageIndex, pageSize, enablePagination, setSearchParams, prefix])

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
    onPaginationChange: enablePagination ? setPagination : undefined,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: enablePagination
      ? getPaginationRowModel()
      : undefined,
    manualPagination: enablePagination ? true : undefined,
  })

  return { table }
}
