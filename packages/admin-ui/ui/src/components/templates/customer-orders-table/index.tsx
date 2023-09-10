import { Order } from "@medusajs/medusa"
import { useAdminOrders } from "medusa-react"
import { useState } from "react"
import { useTable, usePagination } from "react-table"
import { useTranslation } from "react-i18next"
import RefreshIcon from "../../fundamentals/icons/refresh-icon"
import Table from "../../molecules/table"
import TableContainer from "../../organisms/table-container"
import TransferOrdersModal from "../transfer-orders-modal"
import { useCustomerOrdersColumns } from "./use-customer-orders-columns"

const LIMIT = 15

type Props = {
  id: string
}

const CustomerOrdersTable = ({ id }: Props) => {
  const { t } = useTranslation()
  const [selectedOrderForTransfer, setSelectedOrderForTransfer] =
    useState<Order | null>(null)

  const [offset, setOffset] = useState(0)
  const { orders, isLoading, count } = useAdminOrders(
    {
      customer_id: id!,
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
    <>
      <TableContainer
        hasPagination
        isLoading={isLoading}
        pagingState={{
          count: count!,
          offset,
          pageSize: offset + rows.length,
          title: t("customer-orders-table-orders", "Orders"),
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
            {rows.map((row) => {
              prepareRow(row)
              return (
                <Table.Row
                  forceDropdown
                  actions={[
                    {
                      label: t(
                        "customer-orders-table-transfer-order",
                        "Transfer order"
                      ),
                      icon: <RefreshIcon size={"20"} />,
                      onClick: () => {
                        setSelectedOrderForTransfer(row.original as Order)
                      },
                    },
                  ]}
                  {...row.getRowProps()}
                  linkTo={`/a/orders/${row.original.id}`}
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
      {selectedOrderForTransfer && (
        <TransferOrdersModal
          onDismiss={() => setSelectedOrderForTransfer(null)}
          order={selectedOrderForTransfer}
        />
      )}
    </>
  )
}

export default CustomerOrdersTable
