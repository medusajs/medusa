import { ArrowPath } from "@medusajs/icons"
import { Customer, Order } from "@medusajs/medusa"
import { Button, Container, Heading } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { DataTable } from "../../../../../components/table/data-table"
import { useOrders } from "../../../../../hooks/api/orders"
import { useOrderTableColumns } from "../../../../../hooks/table/columns/use-order-table-columns"
import { useOrderTableFilters } from "../../../../../hooks/table/filters/use-order-table-filters"
import { useOrderTableQuery } from "../../../../../hooks/table/query/use-order-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"

type CustomerGeneralSectionProps = {
  customer: Customer
}

const PAGE_SIZE = 10
const DEFAULT_RELATIONS = "customer,items,sales_channel"
const DEFAULT_FIELDS =
  "id,status,display_id,created_at,email,fulfillment_status,payment_status,total,currency_code"

export const CustomerOrderSection = ({
  customer,
}: CustomerGeneralSectionProps) => {
  const { t } = useTranslation()

  const { searchParams, raw } = useOrderTableQuery({
    pageSize: PAGE_SIZE,
  })
  const { orders, count, isLoading, isError, error } = useOrders(
    {
      customer_id: customer.id,
      expand: DEFAULT_RELATIONS,
      fields: DEFAULT_FIELDS,
      ...searchParams,
    },
    {
      placeholderData: keepPreviousData,
    }
  )

  const columns = useColumns()
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
            {t("actions.create")}
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
        pageSize={PAGE_SIZE}
        orderBy={["display_id", "created_at", "updated_at"]}
        search={true}
        queryObject={raw}
      />
    </Container>
  )
}

const CustomerOrderActions = ({ order }: { order: Order }) => {
  const { t } = useTranslation()

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              label: t("transferOwnership.label"),
              to: `${order.id}/transfer-ownership`,
              icon: <ArrowPath />,
            },
          ],
        },
      ]}
    />
  )
}

const columnHelper = createColumnHelper<Order>()

const useColumns = () => {
  const base = useOrderTableColumns({ exclude: ["customer"] })

  return useMemo(
    () => [
      ...base,
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => <CustomerOrderActions order={row.original} />,
      }),
    ],
    [base]
  )
}
