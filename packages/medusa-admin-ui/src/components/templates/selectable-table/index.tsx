import {
  CustomerGroup,
  Product,
  ProductCollection,
  ProductTag,
  ProductType,
} from "@medusajs/medusa"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import {
  Column,
  HeaderGroup,
  Row,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable,
} from "react-table"
import { useDebounce } from "../../../hooks/use-debounce"
import useQueryFilters from "../../../hooks/use-query-filters"
import IndeterminateCheckbox from "../../molecules/indeterminate-checkbox"
import Table, { TableProps } from "../../molecules/table"
import TableContainer from "../../organisms/table-container"

type SelectableTableProps<T extends object> = {
  resourceName?: string
  label?: string
  isLoading?: boolean
  totalCount: number
  options: Omit<
    TableProps,
    "filteringOptions" | "searchValue" | "handleSearch"
  > & {
    filters?: Pick<TableProps, "filteringOptions">
  }
  data?: T[]
  selectedIds?: string[]
  columns: Column<T>[]
  onChange?: (items: string[]) => void
  renderRow: (props: { row: Row<T> }) => React.ReactElement
  renderHeaderGroup?: (props: {
    headerGroup: HeaderGroup<T>
  }) => React.ReactElement
} & ReturnType<typeof useQueryFilters>

let a: Omit<TableProps, "filteringOptions"> & {
  filters?: Pick<TableProps, "filteringOptions">
}

export const SelectableTable = <
  T extends
    | Product
    | CustomerGroup
    | ProductCollection
    | ProductTag
    | ProductType
>({
  label,
  resourceName = "",
  selectedIds = [],
  isLoading,
  totalCount = 0,
  data,
  columns,
  onChange,
  options,
  renderRow,
  renderHeaderGroup,
  setQuery,
  queryObject,
  paginate,
}: SelectableTableProps<T>) => {
  const memoizedData = useMemo(() => data || [], [data])

  const table = useTable<T>(
    {
      columns,
      data: memoizedData,
      manualPagination: true,
      initialState: {
        pageIndex: queryObject.offset / queryObject.limit,
        pageSize: queryObject.limit,
        selectedRowIds: selectedIds.reduce((prev, id) => {
          prev[id] = true
          return prev
        }, {} as Record<string, boolean>),
      },
      pageCount: Math.ceil(totalCount / queryObject.limit),
      autoResetSelectedRows: false,
      autoResetPage: false,
      getRowId: (row: any) => row.id,
    },
    useSortBy,
    usePagination,
    useRowSelect,
    useSelectionColumn
  )

  useEffect(() => {
    if (onChange) {
      onChange(Object.keys(table.state.selectedRowIds))
    }
  }, [table.state.selectedRowIds])

  const handleNext = () => {
    if (!table.canNextPage) {
      return
    }

    paginate(1)
    table.nextPage()
  }

  const handlePrev = () => {
    if (!table.canPreviousPage) {
      return
    }

    paginate(-1)
    table.previousPage()
  }

  const handleSearch = useCallback(
    (text: string) => {
      setQuery(text)

      if (text) {
        table.gotoPage(0)
      }
    },
    [setQuery, table]
  )

  const [searchQuery, setSearchQuery] = useState("")

  const debouncedSearch = useDebounce(searchQuery, 500)

  useEffect(() => {
    handleSearch(debouncedSearch)
  }, [debouncedSearch])

  return (
    <div>
      {label && <div className="inter-base-semibold my-large">{label}</div>}
      <TableContainer
        isLoading={isLoading}
        numberOfRows={queryObject.limit}
        hasPagination
        pagingState={{
          count: totalCount!,
          offset: queryObject.offset,
          pageSize: queryObject.offset + table.rows.length,
          title: resourceName,
          currentPage: table.state.pageIndex + 1,
          pageCount: table.pageCount,
          nextPage: handleNext,
          prevPage: handlePrev,
          hasNext: table.canNextPage,
          hasPrev: table.canPreviousPage,
        }}
      >
        <Table
          {...options}
          {...table.getTableProps()}
          handleSearch={options.enableSearch ? setSearchQuery : undefined}
          searchValue={searchQuery}
          className="relative"
        >
          {renderHeaderGroup && (
            <Table.Head>
              {table.headerGroups?.map((headerGroup) =>
                renderHeaderGroup({ headerGroup })
              )}
            </Table.Head>
          )}

          <Table.Body {...table.getTableBodyProps()}>
            {table.rows.map((row) => {
              table.prepareRow(row)
              return renderRow({ row })
            })}
          </Table.Body>
        </Table>
      </TableContainer>
    </div>
  )
}

const useSelectionColumn = (hooks) => {
  hooks.visibleColumns.push((columns) => [
    {
      id: "selection",
      Header: ({ getToggleAllRowsSelectedProps }) => {
        return (
          <div className="flex justify-center">
            <IndeterminateCheckbox
              {...getToggleAllRowsSelectedProps()}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )
      },
      Cell: ({ row }) => {
        return (
          <div className="flex justify-center">
            <IndeterminateCheckbox
              {...row.getToggleRowSelectedProps()}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )
      },
    },
    ...columns,
  ])
}
