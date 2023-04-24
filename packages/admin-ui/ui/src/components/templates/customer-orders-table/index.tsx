import { useAdminOrders } from "medusa-react"
import { useState } from "react"
import { useTable, usePagination } from "react-table"
import { useSelectedVendor } from "../../../context/vendor"
import Table from "../../molecules/table"
import TableContainer from "../../organisms/table-container"
import { useCustomerOrdersColumns } from "./use-customer-orders-columns"

type CustomerOrdersTableProps = {
  id: string
}

const LIMIT = 15

const CustomerOrdersTable = ({ id }: CustomerOrdersTableProps) => {
  const [offset, setOffset] = useState(0)
  const { isStoreView, selectedVendor } = useSelectedVendor()
  const { orders, isLoading, count } = useAdminOrders(
    {
      customer_id: id!,
      vendor_id: isStoreView ? "null" : selectedVendor!.id,
      offset: offset,
      limit: LIMIT,
      // TODO: expanding items is currently not supported by the API, re-enable when it is.
      // expand: "items",
    },
    {
      keepPreviousData: true,
    }
  )

  const columns = useCustomerOrdersColumns()

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
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data: orders || [],
      manualPagination: true,
      initialState: {
        pageSize: LIMIT,
        pageIndex: Math.floor(offset / LIMIT),
      },
      pageCount: Math.ceil(count || 0 / LIMIT),
      autoResetPage: false,
    },
    usePagination
  )

  const handleNext = () => {
    if (canNextPage) {
      setOffset(offset + LIMIT)
      nextPage()
    }
  }

  const handlePrev = () => {
    if (canPreviousPage) {
      setOffset(offset - LIMIT)
      previousPage()
    }
  }

  return (
    <TableContainer
      hasPagination
      isLoading={isLoading}
      pagingState={{
        count: count!,
        offset,
        pageSize: offset + rows.length,
        title: "Orders",
        currentPage: pageIndex + 1,
        pageCount: pageCount,
        nextPage: handleNext,
        prevPage: handlePrev,
        hasNext: canNextPage,
        hasPrev: canPreviousPage,
      }}
    >
      <Table {...getTableProps()}>
        <Table.Head>
          {headerGroups.map((headerGroup) => {
            return (
              <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  return (
                    <Table.HeadCell {...column.getHeaderProps()}>
                      {column.render("Header")}
                    </Table.HeadCell>
                  )
                })}
              </Table.HeadRow>
            )
          })}
        </Table.Head>
        <Table.Body {...getTableBodyProps()}>
          {rows.map((row, index) => {
            prepareRow(row)
            return (
              <Table.Row
                linkTo={`/admin/orders/${row.original.id}`}
                className="py-2"
                {...row.getRowProps()}
              >
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

export default CustomerOrdersTable
