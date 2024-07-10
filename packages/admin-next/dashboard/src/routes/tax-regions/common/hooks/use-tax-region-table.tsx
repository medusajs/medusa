import { HttpTypes } from "@medusajs/types"
import {
  OnChangeFn,
  PaginationState,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"

type UseTaxRegionTableProps = {
  data?: HttpTypes.AdminTaxRegion[]
  count?: number
  pageSize?: number
  prefix?: string
}

export const useTaxRegionTable = ({
  data = [],
  count = 0,
  pageSize: _pageSize = 10,
  prefix,
}: UseTaxRegionTableProps) => {
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

  useEffect(() => {
    const index = offset ? Math.ceil(Number(offset) / _pageSize) : 0

    if (index === pageIndex) {
      return
    }

    setPagination((prev) => ({
      ...prev,
      pageIndex: index,
    }))
  }, [offset, _pageSize, pageIndex])

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
    columns: [], // We don't actually want to render any columns
    pageCount: Math.ceil(count / pageSize),
    state: {
      pagination,
    },
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: onPaginationChange as OnChangeFn<PaginationState>,
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
  })

  return {
    table,
  }
}
