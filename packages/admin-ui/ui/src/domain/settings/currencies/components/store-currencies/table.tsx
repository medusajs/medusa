import { Currency } from "@medusajs/medusa"
import React, { useEffect } from "react"
import { TableInstance } from "react-table"
import Table from "../../../../../components/molecules/table"
import TableContainer from "../../../../../components/organisms/table-container"

type Props = {
  isLoading?: boolean
  count: number
  offset: number
  setOffset: (offset: number) => void
  setQuery: (query: string) => void
  setSelectedRowIds: (selectedRowIds: string[]) => void
  tableAction?: React.ReactNode
  tableState: TableInstance<Currency>
}

const CurrenciesTable = ({
  isLoading,
  offset,
  setOffset,
  setSelectedRowIds,
  tableState,
  tableAction,
  count,
}: Props) => {
  const {
    rows,
    headerGroups,
    getTableProps,
    getTableBodyProps,
    canNextPage,
    canPreviousPage,
    previousPage,
    nextPage,
    prepareRow,
    state: { pageSize, pageIndex, selectedRowIds },
    pageCount,
  } = tableState

  const handleNext = () => {
    if (canNextPage) {
      setOffset(offset + pageSize)
      nextPage()
    }
  }

  const handlePrev = () => {
    if (canPreviousPage) {
      setOffset(offset - pageSize)
      previousPage()
    }
  }

  useEffect(() => {
    if (setSelectedRowIds) {
      setSelectedRowIds(Object.keys(selectedRowIds))
    }
  }, [selectedRowIds])

  return (
    <TableContainer
      isLoading={isLoading}
      hasPagination
      numberOfRows={pageSize}
      pagingState={{
        count: count,
        offset: offset,
        pageSize: offset + rows.length,
        title: "Currencies",
        currentPage: pageIndex + 1,
        pageCount: pageCount,
        nextPage: handleNext,
        prevPage: handlePrev,
        hasNext: canNextPage,
        hasPrev: canPreviousPage,
      }}
    >
      <Table
        {...getTableProps()}
        className={"table-fixed"}
        tableActions={tableAction}
      >
        <Table.Head>
          {headerGroups?.map((headerGroup) => (
            <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((col) => (
                <Table.HeadCell
                  {...col.getHeaderProps(col.getSortByToggleProps())}
                  className={hasClassName(col) ? col.className : undefined}
                >
                  {col.render("Header")}
                </Table.HeadCell>
              ))}
            </Table.HeadRow>
          ))}
        </Table.Head>
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
  )
}

const hasClassName = (col: unknown): col is { className: string } => {
  return (col as { className: string }).className !== undefined
}

export default CurrenciesTable
