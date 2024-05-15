import { keepPreviousData } from "@tanstack/react-query"
import { Container, Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

import { DataTable } from "../../../../../components/table/data-table/data-table"
import { useOrderTableColumns } from "../../../../../hooks/table/columns/use-order-table-columns"
import { useOrderTableFilters } from "../../../../../hooks/table/filters/use-order-table-filters"
import { useOrderTableQuery } from "../../../../../hooks/table/query/use-order-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { useOrders } from "../../../../../hooks/api/orders"

import { DEFAULT_FIELDS } from "../../const"

const PAGE_SIZE = 20

export const OrderListTable = () => {
  const { t } = useTranslation()
  const { searchParams, raw } = useOrderTableQuery({
    pageSize: PAGE_SIZE,
  })

  const { orders, count, isError, error, isLoading } = useOrders(
    {
      fields: DEFAULT_FIELDS,
      ...searchParams,
    },
    {
      placeholderData: keepPreviousData,
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
