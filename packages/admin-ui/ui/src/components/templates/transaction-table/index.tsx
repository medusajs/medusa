import React, { FC } from "react"
import { usePagination, useTable } from "react-table"
import useQueryFilters from "../../../hooks/use-query-filters"
import Table from "../../molecules/table"
import useTransactionTableColumns from "./use-transaction-table-columns"
import { useGetBalanceTransactions } from "../../../hooks/admin/balances/queries"
import * as qs from "query-string"

const TransactionTableRow = ({ row }) => (
  <Table.Row {...row.getRowProps()} color="inherit" className="group">
    {row.cells.map((cell, index) => cell.render("Cell", { index }))}
  </Table.Row>
)

export interface TransactionTableProps {
  vendor_id?: string
}

const TransactionTable: FC<{ balanceId: string }> = ({ balanceId }) => {
  const {
    q: query,
    queryObject,
    paginate,
    setQuery,
  } = useQueryFilters({
    limit: 15,
    offset: 0,
  })

  const { transactions = [], count = 0 } = useGetBalanceTransactions({
    balance_id: balanceId,
    ...queryObject,
  })

  const columns = useTransactionTableColumns(balanceId)

  const table = useTable(
    {
      data: transactions || [],
      columns,
      initialState: {
        pageSize: queryObject.limit,
        pageIndex: queryObject.offset / queryObject.limit,
      },
      pageCount: Math.ceil(count / queryObject.limit),
      manualPagination: true,
      autoResetPage: false,
    },
    usePagination
  )

  const handleNext = () => {
    table.nextPage()
    paginate(1)
  }

  const handlePrev = () => {
    table.previousPage()
    paginate(-1)
  }

  const handleSearch = (text: string) => {
    setQuery(text)

    if (text) {
      table.gotoPage(0)
    }
  }

  return (
    <div className="w-full overflow-y-auto flex flex-col justify-between h-full">
      <Table>
        <Table.Head>
          {table.headerGroups?.map((headerGroup) => (
            <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((col) => (
                <Table.HeadCell {...col.getHeaderProps()}>
                  {col.render("Header")}
                </Table.HeadCell>
              ))}
            </Table.HeadRow>
          ))}
        </Table.Head>

        <Table.Body {...table.getTableBodyProps()}>
          {table.rows.map((row) => {
            table.prepareRow(row)

            return <TransactionTableRow key={row.original.id} row={row} />
          })}
        </Table.Body>
      </Table>
      {/* <TablePagination
        count={count}
        limit={queryObject.limit}
        offset={queryObject.offset}
        pageSize={queryObject.offset + table.rows.length}
        title="Transactions"
        currentPage={queryObject.offset / queryObject.limit + 1}
        pageCount={table.pageCount}
        nextPage={handleNext}
        prevPage={handlePrev}
        hasNext={queryObject.offset + queryObject.limit < count}
        hasPrev={queryObject.offset > 0}
      /> */}
    </div>
  )
}

export default TransactionTable
