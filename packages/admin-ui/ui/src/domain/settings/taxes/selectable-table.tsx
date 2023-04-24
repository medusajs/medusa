import React, { useMemo, useEffect } from "react"
import { Product, ProductType, ShippingOption } from "@medusajs/medusa"
import {
  ColumnInstance,
  usePagination,
  useRowSelect,
  useTable,
} from "react-table"
import Table from "../../../components/molecules/table"
import IndeterminateCheckbox from "../../../components/molecules/indeterminate-checkbox"
import { PaginationProps } from "../../../types/shared"
import TableContainer from "../../../components/organisms/table-container"

type SelectableTableProps = {
  showSearch?: boolean
  objectName?: string
  label?: string
  isLoading?: boolean
  pagination: PaginationProps
  totalCount?: number
  data?: Product[] | ProductType[] | ShippingOption[]
  selectedIds?: string[]
  columns: Partial<ColumnInstance>[]
  onPaginationChange: (pagination: PaginationProps) => void
  onChange: (items: string[]) => void
  onSearch?: (search: string) => void
}

export const SelectableTable: React.FC<SelectableTableProps> = ({
  showSearch = true,
  label,
  objectName,
  selectedIds = [],
  isLoading,
  pagination,
  totalCount,
  data,
  columns,
  onPaginationChange,
  onChange,
  onSearch,
}) => {
  const handleQueryChange = (newQuery) => {
    onPaginationChange(newQuery)
  }

  const currentPage = useMemo(() => {
    return Math.floor(pagination.offset / pagination.limit)
  }, [pagination])

  const numPages = useMemo(() => {
    if (totalCount && pagination.limit) {
      return Math.ceil(totalCount / pagination.limit)
    }
    return 0
  }, [totalCount, pagination])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageCount,
    nextPage,
    previousPage,
    // Get the state from the instance
    state: { pageIndex, pageSize, selectedRowIds },
  } = useTable(
    {
      columns,
      data: data || [],
      manualPagination: true,
      initialState: {
        pageIndex: currentPage,
        pageSize: pagination.limit,
        selectedRowIds: selectedIds.reduce((prev, id) => {
          prev[id] = true
          return prev
        }, {}),
      },
      pageCount: numPages,
      autoResetSelectedRows: false,
      autoResetPage: false,
      getRowId: (row) => row.id,
    },
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        // Let's make a column for selection
        {
          id: "selection",
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllRowsSelectedProps }) => {
            return (
              <div>
                <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
              </div>
            )
          },
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => {
            return (
              <div>
                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
              </div>
            )
          },
        },
        ...columns,
      ])
    }
  )

  useEffect(() => {
    onChange(Object.keys(selectedRowIds))
  }, [selectedRowIds])

  const handleNext = () => {
    if (canNextPage) {
      handleQueryChange({
        ...pagination,
        offset: pagination.offset + pagination.limit,
      })
      nextPage()
    }
  }

  const handlePrev = () => {
    if (canPreviousPage) {
      handleQueryChange({
        ...pagination,
        offset: Math.max(pagination.offset - pagination.limit, 0),
      })
      previousPage()
    }
  }

  return (
    <div>
      <div className="inter-base-semibold my-large">{label}</div>
      <TableContainer
        isLoading={isLoading}
        hasPagination
        pagingState={{
          count: totalCount!,
          offset: pagination.offset,
          pageSize: pagination.offset + rows.length,
          title: objectName!,
          currentPage: pageIndex + 1,
          pageCount: pageCount,
          nextPage: handleNext,
          prevPage: handlePrev,
          hasNext: canNextPage,
          hasPrev: canPreviousPage,
        }}
        numberOfRows={pageSize}
      >
        <Table
          immediateSearchFocus={showSearch}
          enableSearch={showSearch}
          searchPlaceholder="Search Products.."
          handleSearch={onSearch}
          {...getTableProps()}
        >
          <Table.Body {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row)
              return (
                <Table.Row {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <Table.Cell {...cell.getCellProps()}>
                        {cell.render("Cell")}
                      </Table.Cell>
                    )
                  })}
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table>
      </TableContainer>
    </div>
  )
}
