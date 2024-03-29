import { Container, Heading } from "@medusajs/ui"
import { useAdminOrders } from "medusa-react"
import { useTranslation } from "react-i18next"
import { DataTable } from "../../../../../components/table/data-table/data-table"
import { useOrderTableColumns } from "../../../../../hooks/table/columns/use-order-table-columns"
import { useOrderTableFilters } from "../../../../../hooks/table/filters/use-order-table-filters"
import { useOrderTableQuery } from "../../../../../hooks/table/query/use-order-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"

const PAGE_SIZE = 20
const DEFAULT_RELATIONS =
  "customer,items,sales_channel,shipping_address,shipping_address.country"
const DEFAULT_FIELDS =
  "id,status,display_id,created_at,email,fulfillment_status,payment_status,total,currency_code"

export const OrderListTable = () => {
  const { t } = useTranslation()
  const { searchParams, raw } = useOrderTableQuery({
    pageSize: PAGE_SIZE,
  })

  const { orders, count, isError, error, isLoading } = useAdminOrders(
    {
      expand: DEFAULT_RELATIONS,
      fields: DEFAULT_FIELDS,
      ...searchParams,
    },
    {
      keepPreviousData: true,
    }
  )

  const filters = useOrderTableFilters()
  const columns = useOrderTableColumns({})

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
        <Heading>{t("orders.domain")}</Heading>
      </div>
      <DataTable
        columns={columns}
        table={table}
        pagination
        navigateTo={(row) => `/orders/${row.original.id}`}
        filters={filters}
        count={count}
        search
        isLoading={isLoading}
        pageSize={PAGE_SIZE}
        orderBy={["display_id", "created_at", "updated_at"]}
        queryObject={raw}
      />
    </Container>
  )
}
