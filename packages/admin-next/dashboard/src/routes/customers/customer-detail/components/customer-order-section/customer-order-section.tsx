import { Customer } from "@medusajs/medusa"
import { Button, Container, Heading } from "@medusajs/ui"
import { useAdminOrders } from "medusa-react"
import { useTranslation } from "react-i18next"
import { DataTable } from "../../../../../components/table/data-table"
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
      />
    </Container>
  )
}
