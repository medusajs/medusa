import { ReceiptPercent } from "@medusajs/icons"
import { Customer, Order } from "@medusajs/medusa"
import { Button, Container, Heading, Table, clx } from "@medusajs/ui"
import {
  PaginationState,
  RowSelectionState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useAdminOrders } from "medusa-react"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { NoRecords } from "../../../../../components/common/empty-table-content"
import {
  OrderDateCell,
  OrderDisplayIdCell,
  OrderFulfillmentStatusCell,
  OrderPaymentStatusCell,
  OrderTotalCell,
} from "../../../../../components/common/order-table-cells"
import { Query } from "../../../../../components/filtering/query"
import { LocalizedTablePagination } from "../../../../../components/localization/localized-table-pagination"
import { useQueryParams } from "../../../../../hooks/use-query-params"

type CustomerGeneralSectionProps = {
  customer: Customer
}

const PAGE_SIZE = 10

export const CustomerOrderSection = ({
  customer,
}: CustomerGeneralSectionProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  })

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  )

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const params = useQueryParams(["q"])
  const { orders, count, isLoading, isError, error } = useAdminOrders(
    {
      customer_id: customer.id,
      limit: PAGE_SIZE,
      offset: pageIndex * PAGE_SIZE,
      fields:
        "id,status,display_id,created_at,email,fulfillment_status,payment_status,total,currency_code",
      ...params,
    },
    {
      keepPreviousData: true,
    }
  )

  const columns = useColumns()

  const table = useReactTable({
    data: orders ?? [],
    columns,
    pageCount: Math.ceil((count ?? 0) / PAGE_SIZE),
    state: {
      pagination,
      rowSelection,
    },
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  })

  const noRecords =
    Object.values(params).every((v) => !v) && !isLoading && !orders?.length

  if (isError) {
    throw error
  }

  return (
    <Container className="p-0 divide-y">
      <div className="flex items-center justify-between py-4 px-6">
        <Heading level="h2">{t("orders.domain")}</Heading>
        <div className="flex items-center gap-x-2">
          <Button size="small" variant="secondary">
            {t("general.create")}
          </Button>
        </div>
      </div>
      {!noRecords && (
        <div className="flex items-center justify-between py-4 px-6">
          <div></div>
          <div className="flex items-center gap-x-2">
            <Query />
          </div>
        </div>
      )}
      {noRecords ? (
        <NoRecords />
      ) : (
        <div>
          <Table>
            <Table.Header className="border-t-0">
              {table.getHeaderGroups().map((headerGroup) => {
                return (
                  <Table.Row
                    key={headerGroup.id}
                    className=" [&_th:last-of-type]:w-[1%] [&_th:last-of-type]:whitespace-nowrap [&_th]:w-1/5"
                  >
                    {headerGroup.headers.map((header) => {
                      return (
                        <Table.HeaderCell key={header.id}>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </Table.HeaderCell>
                      )
                    })}
                  </Table.Row>
                )
              })}
            </Table.Header>
            <Table.Body className="border-b-0">
              {table.getRowModel().rows.map((row) => (
                <Table.Row
                  key={row.id}
                  className={clx(
                    "transition-fg cursor-pointer [&_td:last-of-type]:w-[1%] [&_td:last-of-type]:whitespace-nowrap",
                    {
                      "bg-ui-bg-highlight hover:bg-ui-bg-highlight-hover":
                        row.getIsSelected(),
                    }
                  )}
                  onClick={() => navigate(`/orders/${row.original.id}`)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <Table.Cell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          <LocalizedTablePagination
            canNextPage={table.getCanNextPage()}
            canPreviousPage={table.getCanPreviousPage()}
            nextPage={table.nextPage}
            previousPage={table.previousPage}
            count={count ?? 0}
            pageIndex={pageIndex}
            pageCount={Math.ceil((count ?? 0) / PAGE_SIZE)}
            pageSize={PAGE_SIZE}
          />
        </div>
      )}
    </Container>
  )
}

const OrderActions = ({ order }: { order: Order }) => {
  const { t } = useTranslation()

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              icon: <ReceiptPercent />,
              label: t("customers.viewOrder"),
              to: `/orders/${order.id}/edit`,
            },
          ],
        },
      ]}
    />
  )
}

const columnHelper = createColumnHelper<any>()

const useColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("display_id", {
        header: "Order",
        cell: ({ getValue }) => <OrderDisplayIdCell id={getValue()} />,
      }),
      columnHelper.accessor("created_at", {
        header: "Date",
        cell: ({ getValue }) => <OrderDateCell date={getValue()} />,
      }),
      columnHelper.accessor("fulfillment_status", {
        header: "Fulfillment Status",
        cell: ({ getValue }) => (
          <OrderFulfillmentStatusCell status={getValue()} />
        ),
      }),
      columnHelper.accessor("payment_status", {
        header: "Payment Status",
        cell: ({ getValue }) => <OrderPaymentStatusCell status={getValue()} />,
      }),
      columnHelper.accessor("total", {
        header: () => t("fields.total"),
        cell: ({ getValue, row }) => (
          <OrderTotalCell
            total={getValue()}
            currencyCode={row.original.currency_code}
          />
        ),
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => <OrderActions order={row.original} />,
      }),
    ],
    [t]
  )
}
