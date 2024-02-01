import { ReceiptPercent } from "@medusajs/icons"
import { Customer, Order } from "@medusajs/medusa"
import { Button, Container, Heading } from "@medusajs/ui"
import { createColumnHelper } from "@tanstack/react-table"
import { useAdminOrders } from "medusa-react"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"
import {
  OrderDateCell,
  OrderDisplayIdCell,
  OrderFulfillmentStatusCell,
  OrderPaymentStatusCell,
  OrderTotalCell,
} from "../../../../../components/common/order-table-cells"
import { DataTable } from "../../../../../components/data-table"
import { useOrderTableColumns } from "../../../../../hooks/tables/columns/use-order-table-columns"
import { useOrderTableFilters } from "../../../../../hooks/tables/filters/use-order-table-filters"
import { useOrderTableQuery } from "../../../../../hooks/tables/query/use-order-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"

type CustomerGeneralSectionProps = {
  customer: Customer
}

const PAGE_SIZE = 10
const DEFAULT_RELATIONS = "customer,items,sales_channel"
const DEFAULT_FIELDS =
  "id,status,display_id,created_at,email,fulfillment_status,payment_status,total,currency_code"
const PREFIX = "co"

export const CustomerOrderSection = ({
  customer,
}: CustomerGeneralSectionProps) => {
  const { t } = useTranslation()

  const { searchParams, raw } = useOrderTableQuery({
    pageSize: PAGE_SIZE,
    prefix: PREFIX,
  })
  const { orders, count, isLoading, isError, error } = useAdminOrders(
    {
      customer_id: customer.id,
      expand: DEFAULT_RELATIONS,
      fields: DEFAULT_FIELDS,
      ...searchParams,
    },
    {
      keepPreviousData: true,
    }
  )

  const columns = useOrderTableColumns({
    exclude: ["customer"],
  })
  const filters = useOrderTableFilters()

  const { table } = useDataTable({
    data: orders ?? [],
    columns,
    enablePagination: true,
    count,
    pageSize: PAGE_SIZE,
  })

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("orders.domain")}</Heading>
        <div className="flex items-center gap-x-2">
          <Button size="small" variant="secondary">
            {t("general.create")}
          </Button>
        </div>
      </div>
      <DataTable
        columns={columns}
        table={table}
        pagination
        navigateTo={(row) => `/orders/${row.original.id}`}
        filters={filters}
        count={count}
        isLoading={isLoading}
        rowCount={PAGE_SIZE}
        orderBy={["display_id", "created_at", "updated_at"]}
        search={true}
        queryObject={raw}
        prefix={PREFIX}
      />
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
